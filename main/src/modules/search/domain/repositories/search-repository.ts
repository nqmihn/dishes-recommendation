import { Index, IndexesResults, Settings } from 'meilisearch';
import { PageParams } from 'src/core/models/page-params';
import { SearchFilterQueryBuilder } from '../builders/SearchFilterQueryBuilder';
import { SearchableModel } from '../models/searchable-model';

export abstract class SearchRepository {
  public abstract addDocuments(searchable: SearchableModel[]): Promise<void>;

  public abstract search(
    index: string,
    query: string,
    limit: number,
    filterBuilder: SearchFilterQueryBuilder | undefined,
    attributesToSearchOn: string[] | undefined,
  ): Promise<Record<string, any>>;

  public abstract updateDocuments(searchable: SearchableModel[]): Promise<void>;

  public abstract deleteDocuments(searchable: SearchableModel[]): Promise<void>;

  public abstract deleteDocument(searchable: SearchableModel): Promise<void>;

  public abstract delete(index: string): Promise<void>;

  abstract list(pageParams: PageParams): Promise<IndexesResults<Index[]>>;

  abstract createIndex(index: string, primaryKey: string): Promise<void>;

  abstract updateSettings(index: string, settings: Settings): Promise<void>;
}
