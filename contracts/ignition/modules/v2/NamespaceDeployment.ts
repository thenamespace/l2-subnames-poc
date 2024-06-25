import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VERIFIER = "0xEf2c32797724C2572D83Dd69E71c1A821e07FECa";
const TREASURY = "0xEf2c32797724C2572D83Dd69E71c1A821e07FECa";
const OWNER_ADDRESS = "0xEf2c32797724C2572D83Dd69E71c1A821e07FECa";

const NamespaceDeploymentModule = buildModule(
  "NamespaceDeploymentModule",
  (m) => {
    const namespaceDeployer = m.contract("NamespaceDeployer", [
      VERIFIER,
      TREASURY,
      OWNER_ADDRESS,
    ]);

    return { namespaceDeployer };
  }
);

export default NamespaceDeploymentModule;

/**
yarn hardhat ignition deploy ignition/modules/v2/NamespaceDeployment.ts --network localhost
 */

// NamespaceModule#NameRegistry - 0x4fEfb2D4c6483777290F6e7e1957e36297F1124A
// NamespaceModule#NameRegistryController - 0xB3f2eA0fA4Ec33A2fDC0854780BBe2696Dd388E0
// NamespaceModule#NameResolver - 0xF3d81Ced4346e5c101f9e1eB1614B7b64386E5d1
// NamespaceDeploymentModule#NamespaceDeployer - 0x4fEfb2D4c6483777290F6e7e1957e36297F1124A
