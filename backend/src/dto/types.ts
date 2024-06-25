import { Address } from 'viem';

export type Network = 'base-sepolia';

export interface ListedName {
  label: string;
  namehash: string;
  price: number;
  network: Network;
  owner: string;
}

export interface MintRequest {
  label: string;
  ensName: string;
  owner: Address;
  network: Network;
}

export interface MintResponse {
  signature: string;
  parameters: {
    label: string;
    parentLabel: string;
    owner: Address;
    resolver: Address;
    price: string;
    fee: string;
    paymentReceiver: Address;
  };
}
