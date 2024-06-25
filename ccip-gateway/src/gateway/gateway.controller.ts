import { Controller, Get, Param, Post } from '@nestjs/common';
import {
  Address,
  Hash,
} from 'viem';
import { GatewayService } from './gateway.service';

class GatewayRequest {
  sender: Address;
  data: Hash;
}

@Controller('/resolve')
export class GatewayController {
  constructor(private readonly service: GatewayService) {}

  @Get('/:sender/:data.json')
  public async handleGet(@Param() request: GatewayRequest) {
    const { data, sender } = request;
    return this.service.handle(sender, data);
  }

  @Post(':sender/:data.json')
  public async handlePost(@Param() request: GatewayRequest) {
    const { data, sender } = request;
    return this.service.handle(sender, data);
  }
}
