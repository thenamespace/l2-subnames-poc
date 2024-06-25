import { time } from "@nomicfoundation/hardhat-network-helpers";
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
  MintContext: [
    { name: "label", type: "string" },
    { name: "parentLabel", type: "string" },
    { name: "resolver", type: "address" },
    { name: "owner", type: "address" },
    { name: "price", type: "uint256" },
    { name: "fee", type: "uint256" },
    { name: "paymentReceiver", type: "address" },
    { name: "expiry", type: "uint256" },
  ],
};

/**
yarn hardhat mintSubname \
--label 123 \
--parent-label 101010 \
--resolver 0x7426090CDC024e99a10aC5754ca72f360306E007 \
--owner 0xEf2c32797724C2572D83Dd69E71c1A821e07FECa \
--payment-receiver 0xEf2c32797724C2572D83Dd69E71c1A821e07FECa \
--chain-id 1337 \
--deployer 0x4343db796b79cfee8b461db06c48169e94fd3ee3 \
--network localhost
 */
task("mintSubname")
  .addParam("label")
  .addParam("parentLabel")
  .addParam("resolver")
  .addParam("owner")
  .addParam("paymentReceiver")
  .addParam("deployer")
  .addParam("chainId")
  .setAction(async (args, hre) => {
    const [owner] = await hre.viem.getWalletClients();

    console.log(owner.account.address);

    const deployer = await hre.viem.getContractAt(
      "NamespaceDeployer",
      args.deployer
    );

    const controllerAddress = await deployer.read.controllerAddress();
    const controller = await hre.viem.getContractAt(
      "contracts/v2/NameRegistryController.sol:NameRegistryController",
      controllerAddress
    );

    console.log("controllerAddress", controllerAddress);

    // const blockTime = await time.latest();

    const message = {
      label: args.label,
      parentLabel: args.parentLabel,
      resolver: args.resolver,
      owner: args.owner,
      price: BigInt(0),
      fee: BigInt(0),
      paymentReceiver: args.paymentReceiver,
      expiry: 0,
    };

    const domain: Domain = {
      name: "Namespace",
      version: "1",
      chainId: args.chainId,
      verifyingContract: controller.address,
    };

    const signature = await owner.signTypedData({
      domain,
      types,
      message,
      primaryType: "MintContext",
    });

    const mintContext = {
      ...message,
      resolverData: [] as Hash[],
    };

    console.log(mintContext);

    const minted = await controller.write.mint([mintContext, signature], {
      value: message.price,
    });

    console.log("minted ->", minted);
  });
