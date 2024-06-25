// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

struct MintContext {
    address owner;
    string label;
    string parentLabel;
    address resolver;
    uint256 price;
    uint256 fee;
    address paymentReceiver;
    bytes[] resolverData;
    uint256 expiry;
}

struct NodeRecord {
    address owner;
    address resolver;
}

struct RegistryContext {
    string listingName;
    string symbol;
    string parentLabel;
    string baseUri;
    address owner;
    address resolver;
    ParentControl parentControl;
    ListingType listingType;
}

enum ListingType {
    BASIC,
    EXPIRABLE
}

enum ParentControl {
    NO_CONTROL,
    CONTROLLABLE
}
