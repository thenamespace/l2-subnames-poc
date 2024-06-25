import { Module } from '@nestjs/common';
import { AppConfig } from './app-config.service';

@Module({
  providers: [AppConfig],
  exports: [AppConfig],
})
export class AppConfigModule {}
