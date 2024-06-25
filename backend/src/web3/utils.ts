import { Network } from 'src/dto/types';
import { Chain } from 'viem';

export function getNetwork(chain: Chain): Network {
  return chain.name.toLocaleLowerCase() as Network;
}
