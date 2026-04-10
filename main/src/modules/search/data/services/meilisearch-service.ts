import { Injectable } from '@nestjs/common';
import { Index, IndexesResults, MeiliSearch } from 'meilisearch';
import { Settings } from 'meilisearch/src/types/types';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { PageParams } from 'src/core/models/page-params';
import { SearchFilterQueryBuilder } from '../../domain/builders/SearchFilterQueryBuilder';
import { SearchableModel } from '../../domain/models/searchable-model';

@Injectable()
export class MeilisearchService {
  constructor(@InjectMeiliSearch() private readonly meilisearch: MeiliSearch) {}

  async addDocuments(searchable: SearchableModel[]): Promise<void> {
    await this.meilisearch
      .index(searchable[0].getSearchIndexName())
      .addDocuments(searchable.map((document) => document.toSearchJson()));
  }

  async search(
    index: string,
    query: string,
    limit: number,
    filterBuilder: SearchFilterQueryBuilder | undefined,
    attributesToSearchOn: string[] | undefined,
  ): Promise<Record<string, any>> {
    return await this.meilisearch.index(index).search(query, {
      limit: limit,
      filter: filterBuilder?.getWhereQuery(),
      attributesToSearchOn: attributesToSearchOn,
    });
  }

  async updateDocuments(searchable: SearchableModel[]): Promise<void> {
    await this.deleteDocuments(searchable);

    await this.meilisearch.index(searchable[0].getSearchIndexName()).updateDocuments(
      searchable.map((document) => document.toSearchJson()),
      { primaryKey: 'id' },
    );
  }

  async deleteDocuments(searchable: SearchableModel[]): Promise<void> {
    await this.meilisearch
      .index(searchable[0].getSearchIndexName())
      .deleteDocuments(searchable.map((document) => document.getSearchDocument({ isRelation: false }).id));
  }

  async deleteDocument(searchable: SearchableModel): Promise<void> {
    await this.meilisearch.index(searchable.getSearchIndexName()).deleteDocument(searchable.toJson(false).id);
  }

  async delete(index: string): Promise<void> {
    await this.meilisearch.index(index).delete();
  }

  async updateSettings(index: string, settings: Settings): Promise<void> {
    await this.meilisearch.index(index).updateSettings(settings);
  }

  async createIndex(index: string, primaryKey: string): Promise<void> {
    await this.meilisearch.createIndex(index, { primaryKey: primaryKey });
  }

  async list(pageParams: PageParams): Promise<IndexesResults<Index[]>> {
    return await this.meilisearch.getIndexes({ limit: pageParams.limit, offset: pageParams.page * pageParams.limit });
  }
}
