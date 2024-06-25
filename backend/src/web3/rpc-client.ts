import { BadRequestException, Injectable } from '@nestjs/common';
import { Network } from 'src/dto/types';
import {
  PrivateKeyAccount,
  PublicClient,
  createPublicClient,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { AppConfig } from '../config/app-config.service';

const supportedChains = {
  'base-sepolia': baseSepolia,
};

@Injectable()
export class RpcClient {
  private readonly signer: PrivateKeyAccount;
  private readonly clients: Record<string, PublicClient> = {};

  constructor(private readonly config: AppConfig) {
    const baseSepoliaClient = createPublicClient({
      chain: baseSepolia as any,
      transport: this.config.baseSepoliaRpc
        ? http(this.config.baseSepoliaRpc)
        : http(),
    });

    this.clients['base-sepolia'] = baseSepoliaClient as PublicClient;
    this.signer = privateKeyToAccount(this.config.signerKey);
  }

  public getPublicClient = (network: Network) => {
    return this.clients[network];
  };

  public getSigner = () => {
    return this.signer;
  };

  public getChain = (network: Network) => {
    if (!supportedChains[network]) {
      throw new BadRequestException('Unsupported network ' + network);
    }
    return supportedChains[network];
  };
}
