// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Controllable} from "./access/Controllable.sol";

interface INameListingManager {
    function setNameTokenNode(bytes32 node, address nameToken) external;
    function setNameTokenNode(bytes32 node, address nameToken, address lister) external;
    function nameTokenNodes(bytes32 node) external view returns (address);
}

contract NameListingManager is Controllable {
    uint8 public controllerVersion;

    mapping(uint8 version => address controller) public versionedControllers;
    mapping(address nameToken => address controller) public tokenControllers;

    mapping(bytes32 node => address nameToken) public nameTokenNodes;
    mapping(address lister => address nameToken) public tokenListers;

    modifier onlyLister(address nameToken) {
        address lister = tokenListers[nameToken];
        require(msg.sender == lister, "Only lister can perform the action.");

        _;
    }

    function setNameTokenNode(bytes32 node, address nameToken) external onlyController {
        nameTokenNodes[node] = nameToken;
    }

    function setNameTokenNode(bytes32 node, address nameToken, address lister) external onlyController {
        nameTokenNodes[node] = nameToken;
        tokenListers[lister] = nameToken;
        tokenControllers[nameToken] = msg.sender;
    }

    function addController(address controller) external {
        versionedControllers[++controllerVersion] = controller;

        super.setController(controller, true);
    }

    function updateTokenController(uint8 version, address nameToken) external onlyLister(nameToken) {
        address currentController = tokenControllers[nameToken];
        Controllable(nameToken).setController(currentController, false);

        address newController = versionedControllers[version];
        tokenControllers[nameToken] = newController;
        Controllable(nameToken).setController(newController, true);
    }
}
