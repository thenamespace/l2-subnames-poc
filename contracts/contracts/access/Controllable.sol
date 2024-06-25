// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Controllable is Ownable {
    mapping(address => bool) controllers;

    event ControllerChanged(address controller, bool access);

    constructor() Ownable(_msgSender()) {}

    modifier onlyController() {
        require(isController(_msgSender()), "Controllable: Not Controller");
        _;
    }

    function setController(
        address controller,
        bool access
    ) public virtual onlyOwner {
        controllers[controller] = access;
        emit ControllerChanged(controller, access);
    }

    function isController(address wallet) internal view returns (bool) {
        return controllers[wallet];
    }
}
