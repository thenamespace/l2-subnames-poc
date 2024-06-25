import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './config/app-config.service';
import { ListingController } from './controller/listing-controller';
import { MintController } from './controller/mint-controller';
import { ListedNamesModule } from './listed-names/listed-names.module';
import { MintSigner } from './minting/mint-signer';
import { MintingModule } from './minting/minting.module';
import { MintingService } from './minting/minting.service';
import { Web3Module } from './web3/web3.module';

const nodeEnv = process.env.NODE_ENV;
const isTest = nodeEnv === 'test';

@Module({
  imports: [
    // set up configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: isTest ? ['./test/.env', '.env'] : ['.env'],
    }),
    ListedNamesModule,
    MintingModule,
    Web3Module,
  ],
  controllers: [MintController, ListingController],
  providers: [MintingService, MintSigner, AppConfig],
})
export class AppModule {}
