// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ListingType, ParentControl} from "../Types.sol";

interface IEnsNameToken {
    function mint(address, uint256, address) external;
    function mint(address, uint256, address, uint256) external;
    function burn(uint256) external;
    function fuse() external returns (uint8);
    function ownerOf(uint256) external view returns (address);
    function nameTokenOwner() external view returns (address);
    function transferFrom(address, address, uint256) external;
    function listingType() external pure returns (ListingType);
    function parentControl() external view returns (ParentControl);
    function isApprovedForAll(address approver, address operator) external view returns(bool);
}