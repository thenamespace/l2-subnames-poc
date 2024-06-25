// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EnsUtils} from "./libs/EnsUtils.sol";
import {RegistryContext, ListingType} from "./Types.sol";
import {EnsTokenCreated} from "./Events.sol";
import {InvalidSignature, NodeAlreadyTaken} from "./Errors.sol";
import {EnsNameToken} from "./tokens/EnsNameToken.sol";
import {ExpirableEnsNameToken} from "./tokens/ExpirableEnsNameToken.sol";
import {IEnsNameToken} from "./tokens/IEnsNameToken.sol";
import {INameListingManager} from "./NameListingManager.sol";
import {EnsTokenEmitter} from "./EnsTokenEmitter.sol";

bytes32 constant REGISTRY_CONTEXT = keccak256(
    "RegistryContext(string listingName,string symbol,string parentLabel,string baseUri,address owner,address resolver,uint8 parentControl,uint8 listingType)"
);

contract NameRegistryFactory is EIP712, Ownable {
    address private verifier;
    address manager;
    address controller;
    bytes32 private immutable ETH_NODE;
    address emitter;
    uint256 immutable MAX_INT = 2 ** 256 - 1;

    constructor(
        address _verifier,
        address _manager,
        address _controller,
        bytes32 ethNode,
        address owner,
        address _emitter
    ) EIP712("Namespace", "1") Ownable(owner) {
        verifier = _verifier;
        manager = _manager;
        controller = _controller;
        ETH_NODE = ethNode;
        emitter = _emitter;
    }

    function create(RegistryContext memory context, bytes memory verificationSignature) external {
        bytes32 nameNode = EnsUtils.namehash(ETH_NODE, context.parentLabel);

        address token = INameListingManager(manager).nameTokenNodes(nameNode);
        if (token != address(0)) {
            revert NodeAlreadyTaken(nameNode);
        }

        verifySignature(context, verificationSignature);

        EnsNameToken nameToken = createToken(context, nameNode);
        nameToken.setController(controller, true);
        nameToken.setController(address(this), true);

        INameListingManager(manager).setNameTokenNode(nameNode, address(nameToken), msg.sender);
        EnsTokenEmitter(emitter).setEmitter(address(nameToken), true);

        claim2LDomain(context.owner, context.resolver, nameNode, address(nameToken));

        nameToken.setController(address(this), false);
        nameToken.transferOwnership(manager);

        emit EnsTokenCreated(
            address(nameToken),
            msg.sender,
            context.listingName,
            context.symbol,
            context.parentLabel,
            context.baseUri,
            context.owner,
            context.resolver,
            context.parentControl,
            context.listingType
        );
    }

    function claim2LDomain(address owner, address resolver, bytes32 nameNode, address nameTokenAddress) internal {
        IEnsNameToken token = IEnsNameToken(nameTokenAddress);
        if (token.listingType() == ListingType.EXPIRABLE) {
            token.mint(owner, uint256(nameNode), resolver, MAX_INT);
        } else {
            token.mint(owner, uint256(nameNode), resolver);
        }
    }

    function verifySignature(RegistryContext memory context, bytes memory signature) internal view {
        address extractedAddr = extractSigner(context, signature);
        if (extractedAddr != verifier) {
            revert InvalidSignature(extractedAddr);
        }
    }

    function extractSigner(RegistryContext memory context, bytes memory signature) internal view returns (address) {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    REGISTRY_CONTEXT,
                    keccak256(abi.encodePacked(context.listingName)),
                    keccak256(abi.encodePacked(context.symbol)),
                    keccak256(abi.encodePacked(context.parentLabel)),
                    keccak256(abi.encodePacked(context.baseUri)),
                    context.owner,
                    context.resolver,
                    context.parentControl,
                    context.listingType
                )
            )
        );
        return ECDSA.recover(digest, signature);
    }

    function createToken(RegistryContext memory context, bytes32 nameNode) internal returns (EnsNameToken) {
        if (context.listingType == ListingType.EXPIRABLE) {
            return new ExpirableEnsNameToken(
                context.listingName, context.symbol, context.baseUri, nameNode, context.parentControl, emitter
            );
        }

        return new EnsNameToken(
            context.listingName, context.symbol, context.baseUri, nameNode, context.parentControl, emitter
        );
    }

    function setVerifier(address _verifier) public onlyOwner {
        verifier = _verifier;
    }
}
