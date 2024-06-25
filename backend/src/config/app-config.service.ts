import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Hash } from 'viem';

@Injectable()
export class AppConfig {
  public baseSepoliaRpc: string;
  public signerKey: Hash;
  public appSignerName: string;
  public appSignerVersion: string;
  public namesApiUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseSepoliaRpc = this.configService.get('BASE_SEPOLIA_RPC');
    this.signerKey = this.configService.getOrThrow('SIGNER_KEY');
    this.appSignerName = this.configService.getOrThrow('APP_SIGNER_NAME');
    this.appSignerVersion = this.configService.getOrThrow('APP_SIGNER_VERSION');
    this.namesApiUrl = this.configService.getOrThrow('NAMES_API_URL');
  }
}
