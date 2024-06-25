import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/config/config.module';
import { ListedNamesModule } from 'src/listed-names/listed-names.module';
import { Web3Module } from 'src/web3/web3.module';
import { MintSigner } from './mint-signer';
import { MintingService } from './minting.service';

@Module({
  providers: [MintingService, MintSigner],
  imports: [Web3Module, ListedNamesModule, AppConfigModule],
})
export class MintingModule {}
