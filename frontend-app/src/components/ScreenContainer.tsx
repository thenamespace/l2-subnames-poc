import { PropsWithChildren } from "react";
import { Spinner } from "@ensdomains/thorin";
import "./ScreenContainer.css";
import { TopNavigation } from "./TopNavigation";

interface ScreenContainerProps extends PropsWithChildren {
    isLoading?: boolean
    hideNav?: boolean
}

export const ScreenContainer = ({ children, isLoading, hideNav }: ScreenContainerProps) => {

    if (isLoading) {
        return <div className="screen-container loading">
            <Spinner color="blue" size="large"/>
        </div>
    }

    return <div className="screen-container">
        {!hideNav && <TopNavigation/>}
        <div className="screen-content-container">
            {children}
        </div>
    </div>
}