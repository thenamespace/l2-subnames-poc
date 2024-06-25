import { AvailableAddressRecord } from "./Types";
import zora from "../../assets/icons/addresses/zora.svg";
import op from "../../assets/icons/addresses/op.svg";
import arb from "../../assets/icons/addresses/arb.svg";
import eth from "../../assets/icons/addresses/eth.svg";
import bitcoin from "../../assets/icons/addresses/bitcoin.svg";
import sol from "../../assets/icons/addresses/sol.svg";
import base from "../../assets/icons/addresses/base.svg";
import matic from "../../assets/icons/addresses/matic.svg";
import { isAddress } from "viem";
import { validate as validateBtc } from 'bitcoin-address-validation';

// ETH, BTC, SOL, ARB, OP, BASE, MATIC, AVAX, CELO, FTM, NEAR, ZORA
export const availableAddresses: Record<string, AvailableAddressRecord> = {
  ETH: {
    iconUrl: eth,
    coinType: 60,
    isValid: (value: string) => {
      return isAddress(value);
    },
    chainName: "ETH",
  },
  BTC: {
    iconUrl: bitcoin,
    coinType: 0,
    isValid: (value: string) => {
      return validBitcoinAddr(value);
    },
    chainName: "BTC",
  },
  BASE: {
    iconUrl: base,
    coinType: 2147492101,
    isValid: (value: string) => isAddress(value),
    chainName: "BASE",
  },
  SOL: {
    iconUrl: sol,
    coinType: 501,
    isValid: (value: string) => isAddress(value),
    chainName: "SOL",
  },
  ARB: {
    iconUrl: arb,
    coinType: 2147525809,
    isValid: (value: string) => {
      return isAddress(value);
    },
    chainName: "ARB",
  },
  OP: {
    iconUrl: op,
    coinType: 2147483658,
    isValid: (value: string) => {
      return isAddress(value);
    },
    chainName: "OP",
  },
  ZORA: {
    iconUrl: zora,
    coinType: 2155261425,
    isValid: (value: string) => {
      return isAddress(value);
    },
    chainName: "ZORA",
  },
  MATIC: {
    iconUrl: matic,
    coinType: 2147483785,
    isValid: (value: string) => {
      return isAddress(value);
    },
    chainName: "MATIC",
  },
};

export const getAvailableAddrByCoin = (
  coinType: number
): AvailableAddressRecord | undefined => {
  for (const addr of Object.keys(availableAddresses)) {
    const current = availableAddresses[addr];
    if (current.coinType === coinType) {
      return current;
    }
  }
};

const validBitcoinAddr = (value: string) => {
  return validateBtc(value);
};