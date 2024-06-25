// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./EnsNameToken.sol";
import {ListingType} from "../Types.sol";

contract ExpirableEnsNameToken is EnsNameToken {
    mapping(bytes32 tokenNode => uint256 expiry) public expiries;

    constructor(string memory name, string memory symbol, string memory baseUri, bytes32 nameNode, ParentControl _parentControl, address _emitter)
        EnsNameToken(name, symbol, baseUri, nameNode, _parentControl, _emitter)
    {}

    function mint(address owner, uint256 tokenId, address resolver, uint256 expiry) external {

        if (isExpired(tokenId)) {
            address previousOwner = _ownerOf(tokenId);
            if (previousOwner != address(0)) {
                _burn(tokenId);
            }
        }

        super.mint(owner, tokenId, resolver);

        expiries[bytes32(tokenId)] = expiry;
    }

    function ownerOf(uint256 tokenId) public view override returns (address) {
        if (isExpired(tokenId)) {
            return address(0);
        }

        return super.ownerOf(tokenId);
    }

    function isExpired(uint256 tokenId) internal view returns(bool) {
        bytes32 node = bytes32(tokenId);
        return expiries[node] < block.timestamp;
    }

    function listingType() public override pure returns(ListingType) {
        return ListingType.EXPIRABLE;
    }

    function setExpiry(bytes32 node, uint64 expiry) external onlyController {
        expiries[node] += expiry;
    }
}
