export interface RecordsUpdateInput {
    baseAddr?: string;
    ethAddr?: string;
    texts: TextRecord[];
}
export interface AddressRecord {
    coinType: number
    value: string
}

export interface NameRecords {
    ethAddress?: string
    addresses: AddressRecord[]
    texts: TextRecord[]
    contenthash?: string
}

export interface TextRecord {
    key: string;
    value: string;
}

export interface TextRecordCard {
    icon?: string;
    key: string;
    label: string;
    placeholder?: string
}

export interface AvailableAddressRecord {
    isValid: (value: string) => boolean
    chainName: string
    coinType: number
    iconUrl?: string
}
