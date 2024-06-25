import { Address, PublicClient, namehash } from "viem";
import NAME_RESOLVER_ABI from "./name-resolver.abi.json";

export interface ResolverResult {
    value: string
    ttl: number
}

export class NameResolver {

    constructor(private readonly publicClient: PublicClient, private readonly contractAddress: Address) {}

    public async getText(fullName: string, key: string): Promise<ResolverResult> {

        const resolvedText = await this.publicClient.readContract({
            abi: NAME_RESOLVER_ABI,
            address: this.contractAddress,
            functionName: "text",
            args: [namehash(fullName), key]
        }) as string

        return {
            ttl: this.getTTL(),
            value: resolvedText
        }
    }
    public async getAddress(fullName: string, coinType: string): Promise<ResolverResult> {
        const resolvedAddress = await this.publicClient.readContract({
            abi: NAME_RESOLVER_ABI,
            address: this.contractAddress,
            functionName: "addr",
            args: [namehash(fullName), BigInt(coinType)]
        }) as string

        return {
            ttl: this.getTTL(),
            value: resolvedAddress
        }
    }
    public async getContentHash(fullName: string): Promise<ResolverResult> {
        const contentHash = await this.publicClient.readContract({
            abi: NAME_RESOLVER_ABI,
            address: this.contractAddress,
            functionName: "contenthash",
            args: [namehash(fullName)]
        }) as string

        return {
            ttl: this.getTTL(),
            value: contentHash
        }
    }
    private getTTL() {
        return new Date().getTime();
    }
}