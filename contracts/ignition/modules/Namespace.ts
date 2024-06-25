import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VERIFIER = "";
const TREASURY = "";
const OWNER_ADDRESS = "";

const NamespaceModule = buildModule("NamespaceModule", (m) => {
  const registry = m.contract("NameRegistry", []);
  const controller = m.contract("NameRegistryController", [
    VERIFIER,
    TREASURY,
    registry,
  ]);

  m.call(registry, "setController", [controller, true]);
  m.call(registry, "transferOwnership", [OWNER_ADDRESS]);
  m.call(controller, "transferOwnership", [OWNER_ADDRESS]);

  const resolver = m.contract("NameResolver", [registry]);

  return { registry, controller, resolver };
});

export default NamespaceModule;

// NamespaceModule#NameRegistry - 0x4fEfb2D4c6483777290F6e7e1957e36297F1124A
// NamespaceModule#NameRegistryController - 0xB3f2eA0fA4Ec33A2fDC0854780BBe2696Dd388E0
// NamespaceModule#NameResolver - 0xF3d81Ced4346e5c101f9e1eB1614B7b64386E5d1
