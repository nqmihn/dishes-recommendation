import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entity
import { ProductDocumentEntity } from './data/entities/product-document-entity';

// Datasource
import { ProductDocumentDatasource } from './data/datasources/product-document-datasource';

// Repository
import { ProductDocumentRepository } from './domain/repositories/product-document-repository';
import { ProductDocumentRepositoryImpl } from './data/repositories/product-document-repository-impl';

// Usecases
import { GenProductDocumentUsecase } from './domain/usecases/gen-product-document-usecase';
import { ChatRecommendUsecase } from './domain/usecases/chat-recommend-usecase';

// Services
import { OpenAIService } from './domain/services/openai-service';

// Controllers
import { ProductDocumentConsumer } from './app/controllers/product-document-consumer';
import { ChatConsumer } from './app/controllers/chat-consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductDocumentEntity]),
    ConfigModule,
  ],
  controllers: [ProductDocumentConsumer, ChatConsumer],
  providers: [
    // Datasources
    ProductDocumentDatasource,

    // Repository binding: abstract -> impl
    {
      provide: ProductDocumentRepository,
      useClass: ProductDocumentRepositoryImpl,
    },

    // Services
    OpenAIService,

    // Usecases
    GenProductDocumentUsecase,
    ChatRecommendUsecase,
  ],
  exports: [
    ProductDocumentRepository,
    OpenAIService,
    GenProductDocumentUsecase,
    ChatRecommendUsecase,
  ],
})
export class ProductDocumentModule {}
