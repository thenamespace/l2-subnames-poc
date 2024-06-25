import { task } from "hardhat/config";

task("getAddresses")
  .addParam("deployer")
  .setAction(async (args, hre) => {
    const deployer = await hre.viem.getContractAt(
      "contracts/v2/NamespaceDeployer.sol:NamespaceDeployer",
      args.deployer
    );

    const factory = await deployer.read.factoryAddress();
    console.log("Factory", factory);

    const controller = await deployer.read.controllerAddress();
    console.log("Controller", controller);

    const resolver = await deployer.read.resolverAddress();
    console.log("Resolver", resolver);
  });

// base-sepolia
// Factory 0xeDC0Cfc71890845f0A5d2cf8CFF9F9064242A40B
// Controller 0x782A5e454C36E6a79cbd96a54Ae6F82d522a498c
// Resolver 0xc57FbFf8C2E5d285f1cF8E62e3fAD2da2ac69B4b

// sepolia
// Factory 0x06ab6E2888698863429984e73068bc36975FCC65
// Controller 0xF43a2BcF22E60c7c2c2CB9C0722eFd5bda25C65a
// Resolver 0x7426090CDC024e99a10aC5754ca72f360306E007

// localhost
// Factory 0xD4CDFC67d30320F0d063E388Fab204c6692d797f
// Controller 0xFa47f74919Fe432B7e4dB77D4ff05637729D7632
// Resolver 0x90Ffc4e37E1C1a88F4d3F5b082769F1E1EB1ff42
