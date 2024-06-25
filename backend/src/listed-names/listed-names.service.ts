import { Injectable, NotFoundException } from '@nestjs/common';
import { NameListing } from 'src/dto/name-listing.dto';
import listings from 'src/listed-names/listings.json';

@Injectable()
export class ListedNamesService {
  public async getListings(): Promise<NameListing[]> {
    return listings as NameListing[];
  }

  public async getNameListing(ensName: string): Promise<NameListing> {
    const listing = listings.find((l) => l.name === ensName) as NameListing;
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    return listing;
  }
}
