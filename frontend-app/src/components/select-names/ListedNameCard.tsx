import { Card, Typography } from "@ensdomains/thorin"
import { NetworkIcon } from "../NetworkIcon"
import { Web3Network } from "../../web3"
import "./ListedNameCard.css";

export const ListedNameCard = ({ name, network, active }: { name: string, network: Web3Network, active?: boolean }) => {

    const uppercase = (value: string) => {
        const firstChar = value.charAt(0).toUpperCase();
        return firstChar + value.substring(1, value.length);
    }

    return <Card className={`name-card ${active ? "active" : ""}`}>
        <NetworkIcon iconSize="large" chain={network}></NetworkIcon>
        <div>
            <Typography fontVariant="largeBold">{name}</Typography>
            <Typography fontVariant="extraSmall" color="grey">{uppercase(network)}</Typography>
        </div>
    </Card>
}