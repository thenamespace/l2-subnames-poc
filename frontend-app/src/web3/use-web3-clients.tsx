import { usePublicClient, useWalletClient } from "wagmi";
import { useWeb3Network } from "./use-web3-network";

export const useWeb3Clients = () => {
 
  const { networkId } = useWeb3Network()
  const { data: walletClient } = useWalletClient({ chainId: networkId });
  const publicClient = usePublicClient({ chainId: networkId });

  return {
    walletClient,
    publicClient,
  };
};
