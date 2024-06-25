import { Address, namehash, zeroAddress } from "viem";
import NAME_REGISTRY_ABI from "./abi/name-registry.json";
import { useWeb3Clients } from "./use-web3-clients";

export const useNameRegistry = () => {
  const { publicClient } = useWeb3Clients();

  const isSubnameAvailable = async (fullSubname: string, contract: Address) => {
    const node = namehash(fullSubname);
    const ownerAddress = await publicClient?.readContract({
      abi: NAME_REGISTRY_ABI,
      address: contract,
      functionName: "ownerOf",
      args: [BigInt(node)],
    });

    return ownerAddress === zeroAddress;
  };

  return {
    isSubnameAvailable,
  };
};
