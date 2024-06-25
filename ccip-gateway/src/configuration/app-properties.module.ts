import { Module } from '@nestjs/common';
import { AppProperties } from './app-properties';

@Module({
  exports: [AppProperties],
  providers: [AppProperties],
})
export class AppPropertiesModule {}
