import { Card, Typography } from "@ensdomains/thorin"
import { ScreenContainer } from "../components"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import namespaceLogo from "../assets/logo/namespace.png";
import "./ConnectPage.css";

export const ConnectPage = () => {
    return <ScreenContainer hideNav={true}>
        <div className="connect-page-container">
        <Card className="connect-wallet-card">
            <img src={namespaceLogo} width="120px"></img>
            <Typography fontVariant="largeBold">Wanna mint some subnames?</Typography>
            <Typography>Connect your wallet to continue</Typography>
            <ConnectButton></ConnectButton>
        </Card>
        </div>
    </ScreenContainer>
}