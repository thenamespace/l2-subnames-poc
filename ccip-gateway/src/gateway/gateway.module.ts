import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { AppPropertiesModule } from 'src/configuration/app-properties.module';
import { Web3Module } from 'src/web3/web3.module';

@Module({
  imports: [
    AppPropertiesModule,
    Web3Module
  ],
  controllers: [GatewayController],
  providers: [
    GatewayService,
  ],
})
export class GatewayModule {}
