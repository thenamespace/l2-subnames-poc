import { Address, Hash } from "viem";
import { Web3Network } from "../web3";

export interface Listing {
  name: string;
  network: Web3Network;
  contract: Address;
}

export interface ListingOption {
  value: string;
  label: string;
}

export interface MintContext {
  label: string;
  parentLabel: string;
  resolver: Address;
  owner: Address;
  price: string;
  fee: string;
  expiry: string;
  paymentReceiver: Address;
  resolverData: Hash[];
}

export interface MintContextResponse {
  parameters: MintContext;
  signature: string;
}
