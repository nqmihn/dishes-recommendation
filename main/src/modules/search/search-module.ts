import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MeiliSearchModule } from 'nestjs-meilisearch';
import { IndexAllSearchableCommand } from './app/console/command/index-all-searchable-command';
import { SyncSearchableIndexesCommand } from './app/console/command/sync-searchable-indexes-command';
import meilisearch from './config/meilisearch';
import { SearchRepositoryImpl } from './data/repositories/search-repository-impl';
import { MeilisearchService } from './data/services/meilisearch-service';
import { SearchRepository } from './domain/repositories/search-repository';
import { AddSearchDocumentsUsecase } from './domain/usecases/add-search-documents-usecase';
import { DeleteSearchDocumentsUsecase } from './domain/usecases/delete-search-documents-usecase';
import { DeleteSearchIndexUsecase } from './domain/usecases/delete-search-index-usecase';
import { GetSearchIndexesUsecase } from './domain/usecases/get-search-indexes-usecase';
import { SearchUsecase } from './domain/usecases/search-usecase';
import { SyncSearchIndexesUsecase } from './domain/usecases/sync-search-indexes-usecase';
import { UpdateSearchDocumentsUsecase } from './domain/usecases/update-search-documents-usecase';
import { UpdateSearchSettingsUsecase } from './domain/usecases/update-search-settings-usecase';
import { SyncIndexSettingsCommand } from './app/console/command/sync-index-settings-command';
import { ProductModule } from '../product/product-module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [meilisearch],
    }),
    MeiliSearchModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: <string>configService.get('meilisearch.host'),
        apiKey: configService.get('meilisearch.key'),
      }),
    }),
    forwardRef(() => ProductModule),
  ],
  providers: [
    MeilisearchService,
    AddSearchDocumentsUsecase,
    {
      provide: SearchRepository,
      useClass: SearchRepositoryImpl,
    },
    SearchUsecase,
    UpdateSearchDocumentsUsecase,
    IndexAllSearchableCommand,
    DeleteSearchIndexUsecase,
    DeleteSearchDocumentsUsecase,
    SyncSearchableIndexesCommand,
    GetSearchIndexesUsecase,
    SyncSearchIndexesUsecase,
    UpdateSearchSettingsUsecase,
    SyncIndexSettingsCommand,
  ],
  exports: [
    AddSearchDocumentsUsecase,
    SearchUsecase,
    UpdateSearchDocumentsUsecase,
    DeleteSearchIndexUsecase,
    DeleteSearchDocumentsUsecase,
  ],
})
export class SearchModule {}
