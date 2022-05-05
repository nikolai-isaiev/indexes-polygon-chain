import { Inject, Injectable } from '@nestjs/common';
import { IndexesService } from './indexes/indexes.service';
import { IOptionsIndexes } from './interfaces/interfaces';

@Injectable()
export class AppService {
  constructor(
    @Inject(IndexesService) protected readonly indexesService: IndexesService,
  ) {}

  async indexBlocks(options: IOptionsIndexes) {
    return await this.indexesService.indexBlocks(options);
  }
}
