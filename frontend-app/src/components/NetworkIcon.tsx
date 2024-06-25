import { Web3Network } from "../web3";
import baseIcon from "../assets/networks/base.png";
import optimismIcon from "../assets/networks/optimism.png";
import arbitrumIcon from "../assets/networks/arbitrum.png";
import sepoliaIcon from "../assets/networks/sepolia.png";

const chainIcons: Record<Web3Network, string> = {
    arbitrum: arbitrumIcon,
    base: baseIcon,
    optimism: optimismIcon,
    sepolia: sepoliaIcon
}

type IconSize = "small" | "large" | "default"
const iconSizes: Record<IconSize, number> = {
    default: 25,
    large: 50,
    small: 15
}

export const NetworkIcon = ({ chain, iconSize }: { chain: Web3Network, iconSize?: IconSize }) => {
    const size = iconSize ? iconSizes[iconSize] : iconSizes.default;
    return <img src={chainIcons[chain]} width={`${size}px`}></img>
}
