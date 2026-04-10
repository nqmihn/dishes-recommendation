import { Injectable } from '@nestjs/common';
import { Index } from 'meilisearch';
import { PageParams } from '../../../../core/models/page-params';
import { SearchableIndex } from '../enums/searchable-index';
import { SearchRepository } from '../repositories/search-repository';
import { GetSearchIndexesUsecase } from './get-search-indexes-usecase';

@Injectable()
export class SyncSearchIndexesUsecase {
  constructor(
    private readonly getSearchIndexesUsecase: GetSearchIndexesUsecase,
    private readonly searchRepository: SearchRepository,
  ) {}

  async call(): Promise<void> {
    const createdIndexes = await this.getCreatedIndexes();
    const searchableIndexes = Object.values(SearchableIndex);
    const indexes = searchableIndexes.filter((index) => !createdIndexes.includes(index));

    for (const index of indexes) {
      await this.searchRepository.createIndex(index, 'id');
      console.log(`Created ${index} index success!`);
    }
  }

  private async getCreatedIndexes(): Promise<string[]> {
    let page = 0;
    const createdIndexes: Index[] = [];
    while (true) {
      const pageParams = new PageParams(page, 100, false, false);
      const data = await this.getSearchIndexesUsecase.call(pageParams);
      if (data.results.length == 0) {
        break;
      }

      createdIndexes.push(...data.results);
      page++;
    }

    return createdIndexes.map((index) => index.uid);
  }
}
