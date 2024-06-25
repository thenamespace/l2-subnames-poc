import { Address } from "viem";
import { Web3Network } from "./types";
import { useWeb3Network } from "./use-web3-network";

interface ContractAddresses {
  nameRegistryController: Address;
}

const addresses: Record<Web3Network, ContractAddresses> = {
  "base-sepolia": {
    nameRegistryController: "0xc170eaff499cC58724139ba5721E414447B9be3d",
  },
};

export const useGetAddresses = () => {
  const { networkName } = useWeb3Network();

  return addresses[networkName];
};
