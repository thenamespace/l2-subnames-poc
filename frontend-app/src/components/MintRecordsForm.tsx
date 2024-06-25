import {
  Button,
  Card,
  Input,
  Typography,
  CrossSVG,
  ScrollBox,
  Helper,
} from "@ensdomains/thorin";
import { useState } from "react";
import {
  textsCategories,
  availableTexts,
  TextRecord,
  NameRecords,
  AddressRecord,
  getAvailableAddrByCoin,
  availableAddresses,
} from "./NameRecordsForm";
import "./MintRecordsForm.css";
import { isAddress } from "viem";
import { useAccount } from "wagmi";

export interface RecordsUpdateInput {
  baseAddr?: string;
  ethAddr?: string;
  texts: TextRecord[];
}

export type SetRecordsMode = "update" | "select";

export const SetRecordsForm = ({
  onBack,
  nameRecords,
  setNameRecords,
  onRecordsSelected,
}: {
  onBack: () => void;
  nameRecords: NameRecords;
  setNameRecords: (value: NameRecords) => void;
  onRecordsSelected: () => void;
}) => {
  const [mode, setMode] = useState<SetRecordsMode>("select");
  const { address } = useAccount();

  const handleToggleText = (key: string) => {
    const _records = { ...nameRecords };
    let _texts = [..._records.texts];
    if (_texts.find((t) => t.key === key)) {
      _texts = _texts.filter((t) => t.key !== key);
    } else {
      _texts.push({ key, value: "" });
    }
    _records.texts = _texts;
    setNameRecords(_records);
  };

  const handleTogglAddr = (coinType: number) => {
    const _records = { ...nameRecords };
    let _addresses = [..._records.addresses];

    if (_addresses.find((i) => i.coinType === coinType)) {
      _addresses = _addresses.filter((addr) => addr.coinType !== coinType);
    } else {
      let addrValue = "";
      if (coinType === 60 && address) {
        addrValue = address;
      }
      _addresses.push({ value: addrValue, coinType });
    }
    _records.addresses = _addresses;
    setNameRecords(_records);
  };

  const handleTextsValueChanged = (key: string, value: string) => {
    const _records = { ...nameRecords };
    const _texts = [..._records.texts];
    for (let text of _texts) {
      if (text.key === key) {
        text.value = value;
      }
    }
    _records.texts = _texts;
    setNameRecords(_records);
  };

  const handleTextsRemoved = (key: string) => {
    const _records = { ...nameRecords };
    let _texts = _records.texts.filter((t) => t.key !== key);
    _records.texts = _texts;
    setNameRecords(_records);
  };

  const handleAddrValueChanged = (coinType: number, value: string) => {
    const _records = { ...nameRecords };
    const _addresses = [..._records.addresses];
    for (let addr of _addresses) {
      if (addr.coinType === coinType) {
        addr.value = value;
      }
    }
    _records.addresses = _addresses;
    setNameRecords(_records);
  };

  const handleAddrRemoved = (coinType: number) => {
    const _records = { ...nameRecords };
    const _addresses = _records.addresses.filter(
      (i) => i.coinType !== coinType
    );
    _records.addresses = _addresses;
    setNameRecords(_records);
  };

  const checkInputsValid = () => {
    const { texts, addresses } = nameRecords;
    let valid = true;

    for (const text of texts) {
      if (text.value.length === 0) {
        valid = false;
      }
    }

    for (const addr of addresses) {
      const validatorFunc = getAvailableAddrByCoin(addr.coinType)?.isValid;
      if (addr.value.length === 0 || !validatorFunc?.(addr.value)) {
        valid = false;
      }
    }
    return valid;
  };

  const handleRecordsSelected = () => {
    if (checkInputsValid()) {
      onRecordsSelected();
    }
  };

  const noRecordsSelected =
    nameRecords.addresses.length === 0 && nameRecords.texts.length === 0;

  if (mode === "select") {
    return (
      <div className="mint-records-form">
        <Typography fontVariant="extraLarge" className="mb-2">Select records</Typography>
        {noRecordsSelected && (
          <Helper className="mt-4">
            <Typography>No records selected</Typography>
          </Helper>
        )}

        {!noRecordsSelected && (
          <ScrollBox style={{ maxHeight: 300, padding: 10 }}>
            <AddressesInputs
              onAddrChange={(coin, val) => handleAddrValueChanged(coin, val)}
              onAddrRemoved={handleAddrRemoved}
              selectedAddresses={nameRecords.addresses}
            />
            <TextsInputs
              onTextChanged={(key, value) =>
                handleTextsValueChanged(key, value)
              }
              onTextRemoved={(key) => handleTextsRemoved(key)}
              selectedTexts={nameRecords.texts}
            />
          </ScrollBox>
        )}
        <div className="p-1 mt-1">
           <Typography color="blue" style={{cursor:"pointer"}} onClick={() => setMode("update")}>+ Add records</Typography>
        </div>
        <div className="d-flex mt-3">
          <Button
            className="me-2"
            colorStyle="blueSecondary"
            onClick={() => onBack()}
          >
            Back
          </Button>
          <Button
            disabled={!checkInputsValid()}
            onClick={() => handleRecordsSelected()}
          >
            {noRecordsSelected ? "Skip" : "Next"}
          </Button>
        </div>
      </div>
    );
  }

  const recordsSelectedCount =
    nameRecords.addresses.length + nameRecords.texts.length;

  if (mode === "update") {
    return (
      <div className="mint-records-form">
        <Typography fontVariant="extraLarge" className="mb-2">
          Select records
        </Typography>
        <ScrollBox style={{ height: 300, padding: 10, overflowX: "hidden" }}>
          <div>
            <SelectTexts
              textToggled={(key) => handleToggleText(key)}
              selectedTexts={nameRecords.texts}
            />
          </div>
          <div>
            <Typography color="grey" fontVariant="small" className="mb-2">
              Addresses
            </Typography>
            <SelectAddresses
              onAddrToggled={(coinType: number) => handleTogglAddr(coinType)}
              selectedAddrs={nameRecords.addresses}
            />
          </div>
        </ScrollBox>
        <div className="d-flex mt-4">
          <Button
            onClick={() => setMode("select")}
          >{`Save (${recordsSelectedCount})`}</Button>
        </div>
      </div>
    );
  }

  return <div></div>;
};

const SelectAddresses = ({
  onAddrToggled,
  selectedAddrs,
}: {
  onAddrToggled: (coinType: number) => void;
  selectedAddrs: AddressRecord[];
}) => {
  const getCoinType = (name: string) => {
    return availableAddresses[name] ? availableAddresses[name].coinType : 60;
  };

  const isActive = (name: string) => {
    const coinType = getCoinType(name);
    return selectedAddrs.find((addr) => addr.coinType === coinType);
  };

  const getIconUrl = (name: string) => {
    return availableAddresses[name] ? availableAddresses[name].iconUrl : "";
  };

  return (
    <div className="row mb-2">
      {Object.keys(availableAddresses).map((addr) => (
        <div
          className="col-lg-4 col-sm-6 col-xs-12 p-1"
          onClick={() => onAddrToggled(getCoinType(addr))}
        >
          <Card
            className={`p-3 records-item ${isActive(addr) ? "active" : ""}`}
          >
            <div className="d-flex justify-content-between">
              <img src={getIconUrl(addr)} alt={addr} width="20px"></img>
              <Typography fontVariant="small">
                {availableAddresses[addr].chainName}
              </Typography>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

const SelectTexts = ({
  textToggled,
  selectedTexts,
}: {
  textToggled: (key: string) => void;
  selectedTexts: TextRecord[];
}) => {
  const isActive = (key: string) => {
    return selectedTexts.find((text) => text.key === key) !== undefined;
  };

  return (
    <div>
      {Object.keys(textsCategories).map((category) => (
        <div key={category} className="row mb-2">
          <Typography color="grey" fontVariant="small" className="mb-2">
            {category}
          </Typography>
          {textsCategories[category].map((text) => (
            <div
              className="col-lg-4 col-sm-6 col-xs-12 p-1"
              onClick={() => textToggled(text.key)}
            >
              <Card
                className={`p-3 records-item ${
                  isActive(text.key) ? "active" : ""
                }`}
              >
                <div className="d-flex justify-content-between">
                  <img src={text.icon} alt={text.key} width="20px"></img>
                  <Typography>{text.label}</Typography>
                </div>
              </Card>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const AddressesInputs = ({
  selectedAddresses,
  onAddrChange,
  onAddrRemoved,
}: {
  selectedAddresses: AddressRecord[];
  onAddrChange: (coinType: number, value: string) => void;
  onAddrRemoved: (coinType: number) => void;
}) => {
  const getLabel = (coinType: number) => {
    const addr = getAvailableAddrByCoin(coinType);
    return addr ? addr.chainName : "";
  };

  const getIcon = (coinType: number) => {
    const addr = getAvailableAddrByCoin(coinType);
    return addr ? addr.iconUrl : "";
  };

  const getName = (coinType: number) => {
    return getAvailableAddrByCoin(coinType)?.chainName || "";
  };

  const isValidAddr = (value: string) => {
    return isAddress(value);
  };

  return (
    <div>
      {selectedAddresses.map((addr) => (
        <div key={addr.coinType} className="mb-1">
          <Input
            icon={<img src={getIcon(addr.coinType)} width="18px"></img>}
            suffix={
              <CrossSVG
                style={{ cursor: "pointer" }}
                onClick={() => onAddrRemoved(addr.coinType)}
              />
            }
            error={!isValidAddr(addr.value)}
            label={getLabel(addr.coinType)}
            value={addr.value}
            placeholder={`${getName(addr.coinType)} address`}
            onChange={(e) => onAddrChange(addr.coinType, e.target.value)}
          ></Input>
        </div>
      ))}
    </div>
  );
};

const TextsInputs = ({
  selectedTexts,
  onTextChanged,
  onTextRemoved,
}: {
  selectedTexts: TextRecord[];
  onTextChanged: (key: string, value: string) => void;
  onTextRemoved: (key: string) => void;
}) => {
  const getLabel = (key: string) => {
    return getByKey(key)?.label || "";
  };

  const getIcon = (key: string) => {
    return getByKey(key)?.icon || "";
  };

  const getPlaceholder = (key: string) => {
    return getByKey(key)?.placeholder || "";
  };

  const getByKey = (key: string) => {
    return availableTexts.find((text) => text.key === key);
  };

  return (
    <div>
      {selectedTexts.map((txt) => (
        <div key={txt.key} className="mb-2">
          <Input
            label={getLabel(txt.key)}
            labelSecondary={txt.key}
            error={txt.value.length === 0}
            placeholder={getPlaceholder(txt.key)}
            icon={<img src={getIcon(txt.key)} width="18px"></img>}
            value={txt.value}
            onChange={(e) => onTextChanged(txt.key, e.target.value)}
            suffix={
              <CrossSVG
                style={{ cursor: "pointer" }}
                onClick={() => onTextRemoved(txt.key)}
              />
            }
          ></Input>
        </div>
      ))}
    </div>
  );
};
