import { MintContextResponse } from "../api/types";
import { useWeb3Clients } from "./use-web3-clients";
import REGISTRY_CONTROLLER_ABI from "./abi/name-registry-controller.json";
import { useGetAddresses } from "./use-get-addresses";
import { Hash } from "viem";
import { useAccount } from "wagmi";

export const useNameController = () => {
  const { publicClient, walletClient } = useWeb3Clients();
  const { nameRegistryController } = useGetAddresses();
  const { address } = useAccount();

  const mint = async (params: MintContextResponse): Promise<Hash> => {
    const mintFee = BigInt(params.parameters.fee || 0);
    const mintPrice = BigInt(params.parameters.price || 0);
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { request } = await publicClient?.simulateContract({
      abi: REGISTRY_CONTROLLER_ABI,
      functionName: "mint",
      address: nameRegistryController,
      args: [params.parameters, params.signature],
      account: address,
      value: BigInt(0),
    });
    return (await walletClient?.writeContract(request)) as Hash;
  };

  return {
    mint,
  };
};
