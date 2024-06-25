import "@nomicfoundation/hardhat-toolbox-viem";
import { config as dotEnvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "./scripts/deployer";
import "./scripts/name-registry";
import "./scripts/name-registry-factory";
import "./scripts/name-registry-controller";

dotEnvConfig();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      // allowUnlimitedContractSize: true,
      // forking: {
      //   url: "https://eth-sepolia.g.alchemy.com/v2/" + process.env.SEPOLIA_KEY,
      //   blockNumber: 5904049,
      // },
      // accounts: [
      //   {
      //     privateKey: process.env.SIGNER_KEY as string,
      //     balance: "2031099704110453080000",
      //   },
      // ],
    },
    sepolia: {
      chainId: 11155111,
      accounts: [process.env.SIGNER_KEY as string],
      url: "https://eth-sepolia.g.alchemy.com/v2/" + process.env.SEPOLIA_KEY,
      gasPrice: 2000000000,
      gas: 10_000_000,
    },
    "base-sepolia": {
      chainId: 84532,
      accounts: [process.env.SIGNER_KEY as string],
      url: "https://base-sepolia.g.alchemy.com/v2/" + process.env.BASE_TEST_KEY,
      gasPrice: 2000000000,
      gas: 10_000_000,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
};

export default config;
