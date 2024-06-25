/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  EnsSVG,
  Input,
  MagnifyingGlassSimpleSVG,
  Toast,
  Typography,
} from "@ensdomains/thorin";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { Address, Hash, encodeFunctionData, namehash } from "viem";
import { useAccount } from "wagmi";
import abi from "../../web3/abi/name-registry-controller.json";
import { useWeb3Clients } from "../../web3/use-web3-clients";
import { Listing, ListingOption, MintContext} from "../../api/types";
import { getListings, getMintingParameters } from "../../api";
import { useGetAddresses } from "../../web3";
import NAME_RESOLVER_ABI from "../../web3/abi/name-resolver-abi.json";

export const MintFormContainer = () => {
  const { address } = useAccount();
  const [listings, setListings] = useState<ListingOption[]>([]);
  const [showListings, setShowlistings] = useState(false);
  const [selectedName, setSelectedName] = useState<string>();
  const [showLabel, setShowLabel] = useState(false);
  const [label, setLabel] = useState<string>();
  const [isError, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isMinting, setMinting] = useState(false);
  const [mintDone, setMintDone] = useState(false);
  const { publicClient, walletClient } = useWeb3Clients();

  const { nameRegistryController } = useGetAddresses();

  function searchNames(evt: any) {
    const name = evt.target.value;
    setSelectedName(name);
    setShowLabel(false);
    setMintDone(false);

    if (name === "") {
      setShowlistings(false);
      return;
    }

   getListings(name)
      .then((resp) => updateListings(resp))
      .catch((err) => {
        console.log(err.response.data.error[0].message);
      });
  }

  function updateListings(listings: Listing[]) {
    const updated = listings.map((l) => {
      return { value: l.name, label: l.name };
    });

    setListings(updated);
    setShowlistings(updated?.length > 0);
  }

  function selectListing(name: string) {
    setShowlistings(false);
    setSelectedName(name);
    setShowLabel(true);
  }

  function handleLabelChange(evt: any) {
    const label = evt.target.value;
    setLabel(label);
    setMintDone(false);
  }

  function verifyMint() {
    setMinting(true);

    getMintingParameters(label as string, selectedName as string, address as Address, "sepolia")
      .then((resp) => mint(resp.signature, resp.parameters))
      .catch(handleError)
      .finally(handleMintDone);
  }

  function handleError(error: any) {
    setError(true);
    if (error.response?.data) {
      setErrorMsg(error.response.data.message);
    } else if (error.message) {
      setErrorMsg(error.message);
    }
  }

  function handleErrorToastClosed() {
    setError(false);
    setMintDone(false);
  }

  function handleMintDone() {
    setMinting(false);
    setMintDone(true);
  }

  async function mint(signature: string, mintContext: MintContext) {
    const fullName = `${mintContext.label}.${mintContext.parentLabel}.eth`;
    const nameNode = namehash(fullName);
    const setAddrFunc = encodeFunctionData({
      abi: NAME_RESOLVER_ABI,
      args: [nameNode, address],
      functionName: "setAddr"
    })

    mintContext.resolverData = [setAddrFunc]

    const { request } = (await publicClient?.simulateContract({
      address: nameRegistryController,
      functionName: "mint",
      args: [mintContext, signature],
      abi,
      account: address,
    })) as any;


    const tx = (await walletClient?.writeContract(request)) as Hash;
    return await publicClient?.waitForTransactionReceipt({ hash: tx });
  }

  return (
    <div>
      <ConnectButton />
      <Card className="name-listing-form">
        <Typography>Find your name</Typography>
        <div>
          <div className="listing-input">
            <Input
              label="ENS Name"
              placeholder="Start typing an ENS name.."
              prefix={<EnsSVG />}
              onChange={searchNames}
              value={selectedName}
              disabled={isMinting}
            />
          </div>

          {showListings && (
            <Card>
              {listings.map((l) => {
                return (
                  <ul>
                    <li
                      key={l.label}
                      className="name-listing"
                      onClick={() => selectListing(l.label)}
                    >
                      {l.label}
                    </li>
                  </ul>
                );
              })}
            </Card>
          )}

          {showLabel && (
            <div className="listing-input">
              <Input
                icon={<MagnifyingGlassSimpleSVG />}
                label="Label"
                suffix={selectedName}
                onChange={handleLabelChange}
                disabled={isMinting}
              />
            </div>
          )}
        </div>

        {label && (
          <Button onClick={verifyMint} disabled={isMinting || mintDone}>
            Mint
          </Button>
        )}

        {mintDone && !isError && (
          <Typography>{`Congrats! You have successfully minted ${label}.${selectedName}`}</Typography>
        )}
      </Card>

      <Toast
        open={isError}
        title="Error"
        description="Signup failed due to the error below."
        variant="desktop"
        onClose={handleErrorToastClosed}
        msToShow={3600000}
      >
        <div>
          <Typography>
            <pre className="toast-error-message">
              {errorMsg && errorMsg.length > 0 ? errorMsg : "Transaction error"}
            </pre>
          </Typography>
        </div>
      </Toast>
    </div>
  );
};
