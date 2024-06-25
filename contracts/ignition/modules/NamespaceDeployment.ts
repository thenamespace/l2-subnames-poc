import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VERIFIER = "";
const TREASURY = "";
const OWNER_ADDRESS = "";
const TOKEN_URI = ""

const NamespaceDeploymentModule = buildModule("NamespaceDeploymentModule", (m) => {
  const namespaceDeployer = m.contract("NamespaceDeployer", [VERIFIER, TREASURY, OWNER_ADDRESS, TOKEN_URI])

  return { namespaceDeployer };
});

export default NamespaceDeploymentModule;
