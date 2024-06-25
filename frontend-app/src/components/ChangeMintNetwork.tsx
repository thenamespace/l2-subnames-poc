import { Button, Typography } from "@ensdomains/thorin";
import { Web3Network, useWeb3Network } from "../web3";
import { NetworkIcon } from "./NetworkIcon";
import { useSwitchChain } from "wagmi";

export const ChangeMintNetwork = ({
  requiredNetwork,
}: {
  requiredNetwork: Web3Network;
}) => {
  const { networksMap } = useWeb3Network();
  const requiredNetworkId = networksMap[requiredNetwork];

  const { switchChainAsync, isPending, isError } = useSwitchChain();

  const toFirstUppercase = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const pendingSwitch = isPending && !isError;

  return (
    <div
      className="text-center d-flex flex-column justify-content-center align-items-center pt-4"
    >
      <NetworkIcon chain={requiredNetwork} iconSize="large"></NetworkIcon>
      <Typography className="mt-2" fontVariant="small">
        Minting requires you change network to
      </Typography>
      <Typography fontVariant="largeBold">
        {toFirstUppercase(requiredNetwork)}
      </Typography>
      <Button
        loading={pendingSwitch}
        disabled={pendingSwitch}
        style={{ width: 200 }}
        className="mt-2"
        onClick={() => switchChainAsync({ chainId: requiredNetworkId })}
      >
        { isPending ? "Waiting for wallet" : "Switch"}
      </Button>
    </div>
  );
};
