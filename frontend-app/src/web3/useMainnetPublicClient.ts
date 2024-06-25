import { usePublicClient } from "wagmi"

export const useMainnetPublicClient = () => {
    return usePublicClient({chainId:1})
}