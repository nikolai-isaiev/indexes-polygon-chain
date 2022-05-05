import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { IOptionsIndexes } from './interfaces/interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/indexes-blocks')
  async indexesBlocks(@Body() options: IOptionsIndexes) {
    return await this.appService.indexBlocks(options);
  }
}
