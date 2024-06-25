import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, namehash, parseGwei } from "viem";

describe("NameRegistry", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployNameRegistry() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const registry = await hre.viem.deployContract("NameRegistry", []);
    const tx = await registry.write.setController([
      owner.account.address,
      true,
    ]);

    const publicClient = await hre.viem.getPublicClient();

    await publicClient.waitForTransactionReceipt({ hash: tx });

    return {
      registry,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe("Mint", function () {
    
    it("Only controller can mint", async function () {
      const { registry, owner, publicClient } = await deployNameRegistry();

      const parentNode = namehash("arti.eth");
      const ownerAddr = owner.account.address;
      const tx = await registry.write.mint([
          "label",
          parentNode,
          ownerAddr,
          ownerAddr,
          BigInt(Number.MAX_SAFE_INTEGER),
          [],
        ]);
        const receipt = await publicClient.waitForTransactionReceipt({hash:tx});
        const events = await registry.getEvents.NameMinted();
    });
  });
});
