// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Controllable} from "./access/Controllable.sol";
import {NodeTransfer, NodeBurned} from "./Events.sol";

interface IEnsTokenEmitter {
        function emitNodeTransfer(
        address from,
        address to,
        bytes32 node,
        bytes32 parentNode
    ) external;

    function emitNodeBurned(
        bytes32 node,
        bytes32 parentNode
    ) external;
}

contract EnsTokenEmitter is Controllable {
    mapping(address => bool) emitters;

    modifier onlyEmitter() {
        require(emitters[msg.sender], "Not valid emitter");
        _;
    }

    function emitNodeTransfer(
        address from,
        address to,
        bytes32 node,
        bytes32 parentNode
    ) external onlyEmitter {
        emit NodeTransfer(from, to, node, parentNode);
    }

    function emitNodeBurned(
        bytes32 node,
        bytes32 parentNode
    ) external onlyEmitter {
        emit NodeBurned(node, parentNode);
    }

    function setEmitter(address emitter, bool allow) external onlyController {
        emitters[emitter] = allow;
    }
}
