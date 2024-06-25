import { Select } from "@ensdomains/thorin";
import { Web3Network } from "../web3";
import baseIcon from "../assets/networks/base.png";
import optimismIcon from "../assets/networks/optimism.png";
import arbitrumIcon from "../assets/networks/arbitrum.png";
import sepoliaIcon from "../assets/networks/sepolia.png";

export const NetworkSelector = () => {
  return (
    <Select
      style={{ width: 200 }}
      value={"base"}
      options={[
        {
          value: "sepolia",
          label: "Sepolia",
          prefix: <ChainIcon chain="sepolia" />,
        },
        { value: "base", label: "Base", prefix: <ChainIcon chain="base" /> },
        {
          value: "baseSepolia",
          label: "Base Sepolia",
          prefix: <ChainIcon chain="base-sepolia" />,
        },
        {
          value: "arbitrum",
          label: "Arbitrum (coming soon)",
          prefix: <ChainIcon chain="arbitrum" />,
          disabled: true,
        },
        {
          value: "optimism",
          label: "Optimism (coming soon)",
          prefix: <ChainIcon chain="optimism" />,
          disabled: true,
        },
      ]}
      //@ts-ignore
      placeholder="Select an option..."
      size="small"
      onChange={(e) => console.log(e)}
      tabIndex={2}
    />
  );
};

const chainIcons: Record<Web3Network, string> = {
  arbitrum: arbitrumIcon,
  base: baseIcon,
  "base-sepolia": baseIcon,
  optimism: optimismIcon,
  sepolia: sepoliaIcon,
};

export const ChainIcon = ({ chain }: { chain: Web3Network }) => {
  return <img src={chainIcons[chain]} width="25px"></img>;
};
