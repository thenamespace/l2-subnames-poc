import { config as dotEnvConfig } from "dotenv";
import { task } from "hardhat/config";

dotEnvConfig();

const ethNode =
  "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae";

/**
yarn hardhat getRecords \
--label 123 \
--parent-name namespace.eth \
--deployer 0x4fefb2d4c6483777290f6e7e1957e36297f1124a \
--network localhost
 */
task("getRecords")
  .addParam("label")
  .addParam("parentName")
  .addParam("deployer")
  .setAction(async (args, hre) => {
    const deployer = await hre.viem.getContractAt(
      "NamespaceDeployer",
      args.deployer
    );

    const registryAddress = await deployer.read.registryAddress();
    const registry = await hre.viem.getContractAt(
      "NameRegistry",
      registryAddress
    );

    const parentNode = await registry.read.namehash([ethNode, args.parentName]);
    console.log("parentNode", parentNode);

    const node = await registry.read.namehash([parentNode, args.label]);
    console.log("node", node);

    const records = await registry.read.records([node]);

    console.log(records);
  });
