import { Injectable } from '@nestjs/common';
import { Index, IndexesResults } from 'meilisearch';
import { PageParams } from 'src/core/models/page-params';
import { SearchRepository } from '../repositories/search-repository';

@Injectable()
export class GetSearchIndexesUsecase {
  constructor(private readonly searchRepository: SearchRepository) {}

  async call(pageParams: PageParams): Promise<IndexesResults<Index[]>> {
    return await this.searchRepository.list(pageParams);
  }
}
