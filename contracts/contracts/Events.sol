// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ListingType, ParentControl} from "./Types.sol";

event NodeCreated(bytes32 node, address owner, address resolver);

event NameMinted(
    string label,
    string parentLabel,
    bytes32 subnameNode,
    bytes32 parentNode,
    address owner,
    uint256 price,
    uint256 fee,
    address paymentReceiver,
    uint256 expiry,
    bytes extraData
);

event EnsTokenCreated(
    address tokenAddress,
    address listerAddress,
    string listingName,
    string symbol,
    string indexed parentLabel,
    string baseUri,
    address owner,
    address resolver,
    ParentControl parentControl,
    ListingType listingType
);

event NodeTransfer(address from, address to, bytes32 node, bytes32 parentNode);

event NodeBurned(bytes32 node, bytes32 parentNode);
