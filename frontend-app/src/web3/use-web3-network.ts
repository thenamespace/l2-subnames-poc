import { useAccount } from "wagmi";
import { Web3Network } from "./types";

export const SEPOLIA_ID = 11155111;
export const BASE_ID = 8453;

const networkIdNameMapping: Record<string, Web3Network> = {
  "8453": "base",
  "84532": "base-sepolia",
  "11155111": "sepolia",
};

const networkNamesMap: Record<Web3Network, number> = {
  base: 8453,
  "base-sepolia": 84532,
  sepolia: 11155111,
  arbitrum: 10,
  optimism: 20,
};

export const useWeb3Network = (): {
  networkName: Web3Network;
  networkId: number;
  networksMap: Record<Web3Network, number>;
} => {
  const { chain } = useAccount();

  return {
    networkName: chain?.id ? networkIdNameMapping[chain.id] : "base",
    networkId: chain?.id || BASE_ID,
    networksMap: networkNamesMap,
  };
};
