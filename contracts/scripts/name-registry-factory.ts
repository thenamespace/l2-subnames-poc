import { config as dotEnvConfig } from "dotenv";
import { task } from "hardhat/config";
import { Hash } from "viem";

dotEnvConfig();

type Domain = {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: Hash;
};

const types = {
  RegistryContext: [
    { name: "listingName", type: "string" },
    { name: "symbol", type: "string" },
    { name: "parentLabel", type: "string" },
    { name: "baseUri", type: "string" },
    { name: "owner", type: "address" },
    { name: "resolver", type: "address" },
    { name: "parentControl", type: "uint8" },
    { name: "listingType", type: "uint8" },
  ],
};

/**
yarn hardhat createName \
--listing-name basesubs \
--parent-label basesubs \
--symbol basesubs \
--uri http://localhost:3000/api/v0.1.0/metadata/11155111/ \
--chain-id 84532 \
--deployer 0x42DFD80711BcBcC9A18ac9fcFed5a575Ad5Be9D1 \
--network base-sepolia
 */
task("createName")
  .addParam("listingName")
  .addParam("symbol")
  .addParam("parentLabel")
  .addParam("uri")
  .addParam("chainId")
  .addParam("deployer")
  .setAction(async (args, hre) => {
    const [owner] = await hre.viem.getWalletClients();

    console.log(await owner.getAddresses());

    const deployer = await hre.viem.getContractAt(
      "contracts/v2/NamespaceDeployer.sol:NamespaceDeployer",
      args.deployer
    );

    const factoryAddress = await deployer.read.factoryAddress();
    const factory = await hre.viem.getContractAt(
      "NameRegistryFactory",
      factoryAddress
    );

    const domain: Domain = {
      name: "Namespace",
      version: "1",
      chainId: args.chainId,
      verifyingContract: factory.address,
    };

    const resolverAddress = await deployer.read.resolverAddress();

    const message = {
      listingName: args.listingName as string,
      symbol: args.symbol as string,
      parentLabel: args.parentLabel as string,
      baseUri: args.uri as string,
      owner: owner.account.address,
      resolver: resolverAddress,
      parentControl: 1,
      listingType: 0,
    };

    const signature = await owner.signTypedData({
      domain,
      types,
      message,
      primaryType: "RegistryContext",
    });

    const tx = await factory.write.create([message, signature]);

    console.log(tx);
  });
