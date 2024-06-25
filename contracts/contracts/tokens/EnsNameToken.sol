// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Controllable} from "../access/Controllable.sol";
import {NodeRecord} from "../Types.sol";
import {IEnsTokenEmitter} from "../EnsTokenEmitter.sol";
import {ListingType, ParentControl} from "../Types.sol";

contract EnsNameToken is ERC721, Controllable {
    string private baseURI;
    mapping(bytes32 tokenNode => address resolver) public resolvers;
    ParentControl public immutable parentControl;
    bytes32 immutable NAME_NODE;
    IEnsTokenEmitter emitter;

    modifier onlyNameTokenOwner() {
        require(msg.sender == nameTokenOwner(), "Only name token owner allowed");

        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        string memory baseUri,
        bytes32 nameNode,
        ParentControl _parentControl,
        address _emitter
    ) ERC721(name, symbol) {
        baseURI = baseUri;
        NAME_NODE = nameNode;
        emitter = IEnsTokenEmitter(_emitter);
        parentControl = _parentControl;
    }

    function mint(address owner, uint256 tokenId, address resolver) public onlyController {
        _mint(owner, tokenId);

        resolvers[bytes32(tokenId)] = resolver;
    }

    function burn(uint256 tokenId) external onlyController {
        _burn(tokenId);

        delete resolvers[bytes32(tokenId)];
        emitter.emitNodeBurned(bytes32(tokenId), NAME_NODE);
    }

    function nameTokenOwner() public view returns (address) {
        uint256 nameTokenId = uint256(NAME_NODE);
        return _ownerOf(nameTokenId);
    }

    function ownerOf(uint256 tokenId) public view virtual override returns (address) {
        return _ownerOf(tokenId);
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        super.transferFrom(from, to, tokenId);
        emitter.emitNodeTransfer(from, to, bytes32(tokenId), NAME_NODE);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function listingType() public pure virtual returns (ListingType) {
        return ListingType.BASIC;
    }

    function setBaseUri(string memory uri) external onlyNameTokenOwner {
        baseURI = uri;
    }
}
