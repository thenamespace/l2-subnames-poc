import { config as dotEnvConfig } from "dotenv";
import { task } from "hardhat/config";
import { namehash } from "viem";

dotEnvConfig();

/**
yarn hardhat setRecords \
--label 123 \
--parent-label 101010 \
--deployer 0x4343db796b79cfee8b461db06c48169e94fd3ee3 \
--network localhost
 */
task("setRecords")
  .addParam("label")
  .addParam("parentLabel")
  .addParam("deployer")
  .setAction(async (args, hre) => {
    const publicClient = await hre.viem.getPublicClient();
    const signers = await hre.viem.getWalletClients();

    const deployer = await hre.viem.getContractAt(
      "NamespaceDeployer",
      args.deployer
    );

    const resolverAddress = await deployer.read.resolverAddress();
    const resolver = await hre.viem.getContractAt(
      "contracts/v2/NamePublicResolver.sol:NamePublicResolver",
      resolverAddress
    );

    const node = namehash(`${args.label}.${args.parentLabel}.eth`);

    const textTxn1 = await resolver.write.setText(
      [node, "avatar", "some_url"],
      { account: signers[0].account }
    );
    const text1 = await publicClient.waitForTransactionReceipt({
      hash: textTxn1,
    });

    const textTxn2 = await resolver.write.setText([node, "twitter", "@nss"], {
      account: signers[0].account,
    });
    const text2 = await publicClient.waitForTransactionReceipt({
      hash: textTxn2,
    });

    const contentTxn = await resolver.write.setContenthash(
      [
        node,
        "0x59490384a0971278439902045b10fd40d6496e7d9d7f6a5f86afdad81df0c65d",
      ],
      { account: signers[0].account }
    );
    const content = await publicClient.waitForTransactionReceipt({
      hash: contentTxn,
    });

    console.log(text1);
    console.log(text2);
    console.log(content);
  });
