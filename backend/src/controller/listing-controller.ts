import { Controller, Get, Param } from '@nestjs/common';
import { ListedNamesService } from 'src/listed-names/listed-names.service';

@Controller('/api/v0.1.0/listings')
export class ListingController {
  constructor(private listing: ListedNamesService) {}

  @Get()
  public async getListings() {
    return this.listing.getListings();
  }

  @Get('/:name')
  public async getListing(@Param('name') name: string) {
    return this.listing.getNameListing(name);
  }
}
