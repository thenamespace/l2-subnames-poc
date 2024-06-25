import { Injectable } from '@nestjs/common';
import { Network } from 'src/dto/types';
import { Address, namehash, zeroAddress } from 'viem';
import REGISTRY_ABI from '../abi/name-registry.json';
import { RpcClient } from '../rpc-client';

@Injectable()
export class NameRegistryService {
  constructor(private rpc: RpcClient) {}

  public async isSubnameTaken(
    network: Network,
    subname: string,
    contract: Address,
  ) {
    const publicClient = this.rpc.getPublicClient(network);

    const owner = await publicClient.readContract({
      address: contract,
      abi: REGISTRY_ABI,
      functionName: 'ownerOf',
      args: [BigInt(namehash(subname))],
    });

    return owner !== zeroAddress;
  }
}
