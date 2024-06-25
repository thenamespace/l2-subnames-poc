import { Module } from "@nestjs/common";
import { Web3Clients } from "./web3-clients";
import { AppPropertiesModule } from "src/configuration/app-properties.module";

@Module({
    imports: [AppPropertiesModule],
    exports: [Web3Clients],
    providers: [Web3Clients]
})
export class Web3Module {}