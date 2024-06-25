import { Body, Controller, Post } from '@nestjs/common';
import { MintingService } from 'src/minting/minting.service';
import { MintRequest, MintResponse } from 'src/dto/types';

@Controller('/api/v0.1.0/mint')
export class MintController {
  constructor(private mintService: MintingService) {}

  @Post()
  public async mint(@Body() req: MintRequest): Promise<MintResponse> {
    return this.mintService.verifySubnameMint(req);
  }
}
