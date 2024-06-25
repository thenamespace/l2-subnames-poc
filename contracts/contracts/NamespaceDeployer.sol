// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {NameListingManager, INameListingManager} from "./NameListingManager.sol";
import {NameRegistryController} from "./NameRegistryController.sol";
import {NameRegistryFactory} from "./NameRegistryFactory.sol";
import {NamePublicResolver} from "./NamePublicResolver.sol";
import {EnsTokenEmitter} from "./EnsTokenEmitter.sol";

bytes32 constant ETH_NODE = 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae;

contract NamespaceDeployer {
    address public controllerAddress;
    address public managerAddress;
    address public factoryAddress;
    address public resolverAddress;
    address public emitterAddress;

    constructor(address verifier, address treasury, address owner) {

        EnsTokenEmitter emitter = new EnsTokenEmitter();
        emitterAddress = address(emitter);

        NameListingManager manager = new NameListingManager();
        managerAddress = address(manager);

        NameRegistryController controller =
            new NameRegistryController(treasury, verifier, INameListingManager(managerAddress), ETH_NODE, owner);
        controllerAddress = address(controller);

        NameRegistryFactory factory =
            new NameRegistryFactory(verifier, managerAddress, controllerAddress, ETH_NODE, owner, emitterAddress);
        factoryAddress = address(factory);

        NamePublicResolver resolver = new NamePublicResolver(manager);
        resolverAddress = address(resolver);

        manager.setController(factoryAddress, true);
        manager.addController(controllerAddress);
        manager.transferOwnership(owner);

        emitter.setController(factoryAddress, true);
        emitter.transferOwnership(owner);
    }
}
