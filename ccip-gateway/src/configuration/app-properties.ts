import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppProperties {

    public sepoliaRPC: string
    public baseRPC: string
    public signerWallet: string

    constructor(private readonly configService: ConfigService) {
        this.sepoliaRPC = this.configService.get("SEPOLIA_RPC_URL");
        this.baseRPC = this.configService.get("BASE_RPC_URL");
        this.signerWallet = this.configService.getOrThrow("SIGNER_WALLET");

    }
}