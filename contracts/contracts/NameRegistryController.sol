// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {IEnsNameToken} from "./tokens/IEnsNameToken.sol";
import {INameListingManager} from "./NameListingManager.sol";
import {MintContext, ParentControl, ListingType} from "./Types.sol";
import {NameMinted} from "./Events.sol";
import {ZeroAddressNotAllowed, NodeAlreadyTaken, NotAuthorized} from "./Errors.sol";
import {InsufficientFunds, InvalidSignature, NameRegistrationNotFound} from "./Errors.sol";
import {EnsUtils} from "./libs/EnsUtils.sol";
import {IMulticallable} from "./resolver/IMulticallable.sol";

bytes32 constant MINT_CONTEXT = keccak256(
    "MintContext(string label,string parentLabel,address resolver,address owner,uint256 price,uint256 fee,address paymentReceiver,uint256 expiry)"
);

/**
 * NameRegistryController controls the NFT minting under EnsNameToken contract
 * The minter requires parameters signed by a verifier address
 * in order to be able to perform EnsNameToken operations
 */
contract NameRegistryController is EIP712, Ownable {
    address public treasury;
    address private verifier;
    bytes32 private immutable ETH_NODE;

    INameListingManager public immutable manager;

    constructor(address _treasury, address _verifier, INameListingManager _manager, bytes32 ethNode, address owner)
        EIP712("Namespace", "1")
        Ownable(owner)
    {
        treasury = _treasury;
        verifier = _verifier;
        manager = _manager;
        ETH_NODE = ethNode;
    }

    /**
     * Mints a new name node.
     * @param context The information about minting a new subname.
     * @param signature Signature used to verify minting parameters
     */
    function mint(MintContext memory context, bytes memory signature, bytes memory extraData) public payable {
        verifySignature(context, signature);

        bytes32 parentNode = _namehash(ETH_NODE, context.parentLabel);
        bytes32 node = _namehash(parentNode, context.label);

        address nameToken = manager.nameTokenNodes(parentNode);

        if (nameToken == address(0)) {
            revert NameRegistrationNotFound();
        }

        manager.setNameTokenNode(node, nameToken);

        if (context.resolverData.length > 0) {
            _mintWithRecords(context, node, nameToken);
        } else {
            _mintSimple(context, node, nameToken);
        }

        _transferFunds(context);

        emit NameMinted(
            context.label,
            context.parentLabel,
            node,
            parentNode,
            context.owner,
            context.price,
            context.fee,
            context.paymentReceiver,
            context.expiry,
            extraData
        );
    }

    /**
     * Burns a name node.
     * Callable by a 2LDomain node owner
     * @param nodes An array on subname namehashes
     */
    function burnBulk(bytes32[] memory nodes) external {
        for (uint256 i = 0; i < nodes.length; i++) {
            _burn(nodes[i]);
        }
    }

    /**
     * Burns a name node.
     * Callable by a 2LDomain node owner
     * @param node Subname node namehash
     */
    function burn(bytes32 node) external {
        _burn(node);
    }

    function isNodeAvailable(string memory label, bytes32 parentNode) public view returns(bool) {
        address nameToken = manager.nameTokenNodes(parentNode);

        if (nameToken == address(0)) {
            revert NameRegistrationNotFound();
        }

        bytes32 node = _namehash(parentNode, label);
        return IEnsNameToken(nameToken).ownerOf(uint256(node)) == address(0);
    }

    function _burn(bytes32 node) internal {
        address nameRegistry = manager.nameTokenNodes(node);

        if (nameRegistry == address(0)) {
            revert NameRegistrationNotFound();
        }

        IEnsNameToken token = IEnsNameToken(nameRegistry);

        if (token.parentControl() == ParentControl.CONTROLLABLE && 
            token.nameTokenOwner() == _msgSender()) {
            token.burn(uint256(node));
        } else {
            revert NotAuthorized();
        }
    }

    function _mintSimple(MintContext memory context, bytes32 node, address nameToken) internal {
        _mint(nameToken, node, context.owner, context.resolver, context.expiry);
    }

    function _mintWithRecords(MintContext memory context, bytes32 node, address nameToken) internal {
        _mint(nameToken, node, address(this), context.resolver, context.expiry);

        _setRecordsMulticall(node, context.resolver, context.resolverData);

        IEnsNameToken(nameToken).transferFrom(address(this), context.owner, uint256(node));
    }

      function verifySignature(MintContext memory context, bytes memory signature) internal view {
        address extractedAddr = extractSigner(context, signature);
        if (extractedAddr != verifier) {
            revert InvalidSignature(extractedAddr);
        }
    }

    function extractSigner(MintContext memory context, bytes memory signature) internal view returns (address) {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    MINT_CONTEXT,
                    keccak256(abi.encodePacked(context.label)),
                    keccak256(abi.encodePacked(context.parentLabel)),
                    context.resolver,
                    context.owner,
                    context.price,
                    context.fee,
                    context.paymentReceiver,
                    context.expiry
                )
            )
        );
        return ECDSA.recover(digest, signature);
    }

    function _mint(address nameToken, bytes32 node, address owner, address resolver, uint256 expiry) internal {
        if (owner == address(0) || resolver == address(0)) {
            revert ZeroAddressNotAllowed();
        }

        IEnsNameToken token = IEnsNameToken(nameToken);

        uint256 tokenId = uint256(node);
        if (token.ownerOf(tokenId) != address(0)) {
            revert NodeAlreadyTaken(node);
        }

        if (token.listingType() == ListingType.EXPIRABLE) {
            IEnsNameToken(nameToken).mint(owner, tokenId, resolver, expiry);
        } else {
            IEnsNameToken(nameToken).mint(owner, tokenId, resolver);
        }
    }

    function _namehash(bytes32 parent, string memory label) internal pure returns (bytes32) {
        return EnsUtils.namehash(parent, label);
    }

    function _setRecordsMulticall(bytes32 node, address resolver, bytes[] memory data) internal {
        IMulticallable(resolver).multicallWithNodeCheck(node, data);
    }

    function _transferFunds(MintContext memory context) internal {
        uint256 totalPrice = context.fee + context.price;
        if (msg.value < totalPrice) {
            revert InsufficientFunds(totalPrice, msg.value);
        }

        if (context.price > 0) {
            (bool sentToOwner,) = payable(context.paymentReceiver).call{value: context.price}("");
            require(sentToOwner, "Could not transfer ETH to payment receiver");
        }

        if (context.fee > 0) {
            (bool sentToTreasury,) = payable(treasury).call{value: context.fee}("");
            require(sentToTreasury, "Could not transfer ETH to treasury");
        }
    }

    function setTreasury(address _treasury) public onlyOwner {
        treasury = _treasury;
    }

    function setVerifier(address _verifier) public onlyOwner {
        verifier = _verifier;
    }
}
