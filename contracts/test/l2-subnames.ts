import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ContractName } from "@nomicfoundation/hardhat-viem/types";
import { expect } from "chai";
import hre from "hardhat";
import { Address, Hash, namehash, parseEther, zeroAddress } from "viem";

describe("L2 Subnames", function () {
  const listingTypes = {
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

  const mintingTypes = {
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

  async function deployContracts() {
    const [
      owner,
      treasury,
      verifier,
      lister1,
      lister2,
      minter1,
      minter2,
      minter3,
    ] = await hre.viem.getWalletClients();

    const deployerContract = await hre.viem.deployContract(
      "NamespaceDeployer" as ContractName<string>,
      [
        verifier.account.address,
        treasury.account.address,
        owner.account.address,
      ]
    );

    const publicClient = await hre.viem.getPublicClient();

    return {
      publicClient,
      deployerContract,
      owner,
      treasury,
      verifier,
      lister1,
      lister2,
      minter1,
      minter2,
      minter3,
    };
  }

  async function createToken(message: any, lister: any) {
    const { publicClient, deployerContract, verifier, lister1 } =
      await loadFixture(deployContracts);

    // get the factory contract
    const factoryAddress =
      (await deployerContract.read.factoryAddress()) as Address;

    const factory = await hre.viem.getContractAt(
      "NameRegistryFactory" as ContractName<string>,
      factoryAddress
    );

    // sign the message
    const domain = {
      name: "Namespace",
      version: "1",
      chainId: 1337,
      verifyingContract: factoryAddress,
    };

    const signature = await verifier.signTypedData({
      domain,
      types: listingTypes,
      message,
      primaryType: "RegistryContext",
    });

    // create new token
    const tx = await factory.write.create([message, signature], {
      account: lister.account,
    });
    const listTxn = await publicClient.waitForTransactionReceipt({ hash: tx });

    return { listTxn };
  }

  async function mintName(message: any, listing: any, minter: any) {
    const { publicClient, deployerContract, verifier, lister1 } =
      await loadFixture(deployContracts);

    const loadListing = () => createToken(listing, lister1);
    const { listTxn } = await loadFixture(loadListing);

    // get the factory contract
    const controllerAddress =
      (await deployerContract.read.controllerAddress()) as Address;

    const controller = await hre.viem.getContractAt(
      "contracts/v2/NameRegistryController.sol:NameRegistryController" as ContractName<string>,
      controllerAddress
    );

    // sign the message
    const domain = {
      name: "Namespace",
      version: "1",
      chainId: 1337,
      verifyingContract: controller.address,
    };

    const signature = await verifier.signTypedData({
      domain,
      types: mintingTypes,
      message,
      primaryType: "MintContext",
    });

    // mint subname
    const mintContext = {
      ...message,
      resolverData: [] as Hash[],
    };

    const tx = await controller.write.mint([mintContext, signature], {
      account: minter.account,
      value: message.price + message.fee,
    });

    const mintTxn = await publicClient.waitForTransactionReceipt({
      hash: tx,
    });

    return { mintTxn, listTxn };
  }

  describe("Listing", function () {
    it("should allow valid listing", async function () {
      const { deployerContract, lister1 } = await loadFixture(deployContracts);

      const resolverAddress = await deployerContract.read.resolverAddress();
      const listing = {
        listingName: "namespace",
        symbol: "namespace",
        parentLabel: "namespace",
        baseUri: "namespace.tech",
        owner: lister1.account.address,
        resolver: resolverAddress as string,
        parentControl: 1,
        listingType: 0,
      };

      const loadListing = () => createToken(listing, lister1);
      await loadFixture(loadListing);

      // get the factory contract
      const factoryAddress =
        (await deployerContract.read.factoryAddress()) as Address;

      const factory = await hre.viem.getContractAt(
        "NameRegistryFactory" as ContractName<string>,
        factoryAddress
      );

      // check the token address
      const listingManagerAddress =
        (await deployerContract.read.managerAddress()) as Address;

      const manager = await hre.viem.getContractAt(
        "NameListingManager" as ContractName<string>,
        listingManagerAddress
      );

      const nameNode = namehash(`${listing.listingName}.eth`);
      const tokenAddress = await manager.read.nameTokenNodes([nameNode]);

      expect(tokenAddress).is.not.eq(zeroAddress);

      // check the token data
      const tokenCreated = await factory.getEvents.EnsTokenCreated();
      const args = tokenCreated[0].args as {
        tokenAddress: string;
        listerAddress: string;
        listingName: string;
        symbol: string;
        parentLabel: string;
        baseUri: string;
        owner: string;
        resolver: string;
      };

      expect(args.tokenAddress).to.eq(tokenAddress);
      expect(args.listerAddress.toLowerCase()).to.eq(
        lister1.account.address.toLowerCase()
      );
      expect(args.listingName).to.eq(listing.listingName);
      expect(args.symbol).to.eq(listing.symbol);
      expect(args.parentLabel).to.eq(listing.parentLabel);
      expect(args.baseUri).to.eq(listing.baseUri);
      expect(args.owner.toLowerCase()).to.eq(listing.owner.toLowerCase());
      expect(args.resolver.toLowerCase()).to.eq(listing.resolver.toLowerCase());
    });
  });

  describe("Minting", function () {
    it("should allow minting subnames", async function () {
      const { publicClient, treasury, deployerContract, lister1, minter1 } =
        await loadFixture(deployContracts);

      // get pre-mint balances
      const treasuryBalanceBefore = await publicClient.getBalance({
        address: treasury.account.address,
      });
      const minterBalanceBefore = await publicClient.getBalance({
        address: minter1.account.address,
      });
      const listerBalanceBefore = await publicClient.getBalance({
        address: lister1.account.address,
      });

      // mint
      const resolverAddress = await deployerContract.read.resolverAddress();

      const listing = {
        listingName: "namespace2",
        symbol: "namespace2",
        parentLabel: "namespace2",
        baseUri: "namespace2.tech",
        owner: lister1.account.address,
        resolver: resolverAddress as string,
        parentControl: 1,
        listingType: 0,
      };

      const mintContext = {
        label: "123",
        parentLabel: "namespace2",
        resolver: resolverAddress as string,
        owner: minter1.account.address,
        price: parseEther("0.3"),
        fee: parseEther("0.02"),
        paymentReceiver: lister1.account.address,
        expiry: BigInt(0),
      };

      const loadMint = () => mintName(mintContext, listing, minter1);
      const { mintTxn, listTxn } = await loadFixture(loadMint);

      // check post-mint balances
      const treasuryBalanceAfter = await publicClient.getBalance({
        address: treasury.account.address,
      });
      const minterBalanceAfter = await publicClient.getBalance({
        address: minter1.account.address,
      });
      const listerBalanceAfter = await publicClient.getBalance({
        address: lister1.account.address,
      });

      expect(treasuryBalanceAfter).to.be.eq(
        treasuryBalanceBefore + mintContext.fee
      );
      expect(minterBalanceAfter).to.be.eq(
        minterBalanceBefore -
          mintContext.price -
          mintContext.fee -
          mintTxn.effectiveGasPrice * mintTxn.cumulativeGasUsed
      );
      expect(listerBalanceAfter).to.be.eq(
        listerBalanceBefore +
          mintContext.price -
          listTxn.effectiveGasPrice * listTxn.cumulativeGasUsed
      );

      // verify minted data
      const controllerAddress =
        (await deployerContract.read.controllerAddress()) as Address;

      const controller = await hre.viem.getContractAt(
        "contracts/v2/NameRegistryController.sol:NameRegistryController" as ContractName<string>,
        controllerAddress
      );

      const createdNode = await controller.getEvents.NameMinted();
      const nodeArgs = createdNode[0].args as {
        label: string;
        parentLabel: string;
        subnameNode: string;
        owner: string;
        price: bigint;
        fee: bigint;
        paymentReceiver: string;
        expiry: bigint;
      };

      expect(nodeArgs.subnameNode).to.be.eq(
        namehash(`${mintContext.label}.${listing.listingName}.eth`)
      );
      expect(nodeArgs.owner.toLowerCase()).to.be.eq(
        minter1.account.address.toLowerCase()
      );
      expect(nodeArgs.label.toLowerCase()).to.be.eq(
        mintContext.label.toLowerCase()
      );
      expect(nodeArgs.parentLabel.toLowerCase()).to.be.eq(
        mintContext.parentLabel.toLowerCase()
      );
      expect(nodeArgs.price).to.be.eq(mintContext.price);
      expect(nodeArgs.fee).to.be.eq(mintContext.fee);
      expect(nodeArgs.paymentReceiver.toLowerCase()).to.be.eq(
        mintContext.paymentReceiver.toLowerCase()
      );
      expect(nodeArgs.expiry).to.be.eq(mintContext.expiry);
    });
  });
});
