import { Module } from '@nestjs/common';
import { ListedNamesService } from './listed-names.service';

@Module({
  providers: [ListedNamesService],
  exports: [ListedNamesService],
})
export class ListedNamesModule {}
