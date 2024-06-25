import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SIGNERS = [""];
const URLS = [""]
const OWNER = ""

const OffchainResolverModule = buildModule("NamespaceModule", (m) => {
  const offchainResolver = m.contract("OffchainResolver", [URLS, SIGNERS]);

  m.call(offchainResolver, "transferOwnership", [OWNER]);

  return { offchainResolver };
});

export default OffchainResolverModule;