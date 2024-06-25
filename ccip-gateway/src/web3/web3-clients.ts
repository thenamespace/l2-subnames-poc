import { Injectable, OnModuleInit } from "@nestjs/common";
import { create } from "domain";
import { AppProperties } from "src/configuration/app-properties";
import { SupportedNetwork } from "src/types";
import { PublicClient, createPublicClient, http } from "viem";
import { base, sepolia } from "viem/chains";

@Injectable()
export class Web3Clients implements OnModuleInit {
    
    private clients: Record<SupportedNetwork, PublicClient>

    constructor(private readonly config: AppProperties) {}
    
    onModuleInit() {
        const sepoliaClient = createPublicClient({
            transport: this.config.sepoliaRPC ? http(this.config.sepoliaRPC) : http(),
            chain: sepolia
        })
        const baseClient = createPublicClient({
            transport: this.config.baseRPC ? http(this.config.baseRPC) : http(),
            chain: base
        })
        this.clients = {
            base: baseClient,
            sepolia: sepoliaClient
        }
    }

    public getClient(network: SupportedNetwork) {
        return this.clients[network];
    }
}