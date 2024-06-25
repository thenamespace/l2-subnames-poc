import axios from "axios";
import { Listing, MintContextResponse } from "./types";
import { Address } from "viem";
import { Web3Network } from "../web3";

const api = import.meta.env.VITE_BACKEND_API;

//@ts-ignore
export const getListings = (name: string): Promise<Listing[]> => {
    return axios.get<Listing[]>(`${api}/api/v0.1.0/listings`).then(res => res.data);
}

export const getSingleListing = (name: string): Promise<Listing> => {
    return axios.get<Listing>(`${api}/api/v0.1.0/listings/${name}`).then(res => res.data)
}

export const getMintingParameters = (subnameLabel: string, parentEnsName: string, owner: Address, network: Web3Network) => {
    return axios.post<MintContextResponse>(`${api}/api/v0.1.0/mint`, {
        label: subnameLabel,
        ensName: parentEnsName,
        owner: owner,
        network
    }).then(res => res.data);
}