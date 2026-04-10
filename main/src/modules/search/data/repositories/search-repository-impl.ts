import { Injectable } from '@nestjs/common';
import { Index, IndexesResults, Settings } from 'meilisearch';
import { PageParams } from 'src/core/models/page-params';
import { SearchFilterQueryBuilder } from '../../domain/builders/SearchFilterQueryBuilder';
import { SearchableModel } from '../../domain/models/searchable-model';
import { SearchRepository } from '../../domain/repositories/search-repository';
import { MeilisearchService } from '../services/meilisearch-service';

@Injectable()
export class SearchRepositoryImpl extends SearchRepository {
  constructor(private readonly meilisearchService: MeilisearchService) {
    super();
  }

  public async addDocuments(searchable: SearchableModel[]): Promise<void> {
    await this.meilisearchService.addDocuments(searchable);
  }

  public async search(
    index: string,
    query: string,
    limit: number,
    filterBuilder: SearchFilterQueryBuilder | undefined,
    attributesToSearchOn: string[] | undefined,
  ): Promise<Record<string, any>> {
    return await this.meilisearchService.search(index, query, limit, filterBuilder, attributesToSearchOn);
  }

  public async updateDocuments(searchable: SearchableModel[]): Promise<void> {
    await this.meilisearchService.updateDocuments(searchable);
  }

  public async deleteDocuments(searchable: SearchableModel[]): Promise<void> {
    await this.meilisearchService.deleteDocuments(searchable);
  }

  public async deleteDocument(searchable: SearchableModel): Promise<void> {
    await this.meilisearchService.deleteDocument(searchable);
  }

  public async delete(index: string): Promise<void> {
    await this.meilisearchService.delete(index);
  }

  async list(pageParams: PageParams): Promise<IndexesResults<Index[]>> {
    return await this.meilisearchService.list(pageParams);
  }

  async createIndex(index: string, primaryKey: string): Promise<void> {
    await this.meilisearchService.createIndex(index, primaryKey);
  }

  async updateSettings(index: string, settings: Settings): Promise<void> {
    await this.meilisearchService.updateSettings(index, settings);
  }
}
