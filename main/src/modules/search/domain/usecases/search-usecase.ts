import { Injectable } from '@nestjs/common';
import { SearchRepository } from '../repositories/search-repository';
import { SearchFilterQueryBuilder } from '../builders/SearchFilterQueryBuilder';

@Injectable()
export class SearchUsecase {
  constructor(private readonly searchRepository: SearchRepository) {}

  async call(
    index: string,
    query: string,
    limit: number,
    filterBuilder: SearchFilterQueryBuilder | undefined,
    attributesToSearchOn: string[] | undefined,
  ): Promise<Record<string, any>> {
    return await this.searchRepository.search(index, query, limit, filterBuilder, attributesToSearchOn);
  }
}
