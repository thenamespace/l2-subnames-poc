import { Address } from 'viem';
import { Network } from '../../dto/types';

interface NamespaceContracts {
  resolver: Address;
  controller: Address;
}

const contracts: Record<Network, NamespaceContracts> = {
  'base-sepolia': {
    resolver: '0x9C95841c90c781c55Cd1eEceaAcFe756d44d0f8D',
    controller: '0xc170eaff499cC58724139ba5721E414447B9be3d',
  },
};

export const getContracts = (network: Network) => {
  return contracts[network];
};
