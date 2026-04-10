import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

// Entities
import { ChatSessionEntity } from './data/entities/chat-session-entity';
import { ChatMessageEntity } from './data/entities/chat-message-entity';

// Datasources
import { ChatSessionDatasource } from './data/datasources/chat-session-datasource';
import { ChatMessageDatasource } from './data/datasources/chat-message-datasource';

// Repository interfaces
import { ChatSessionRepository } from './domain/repositories/chat-session-repository';
import { ChatMessageRepository } from './domain/repositories/chat-message-repository';

// Repository implementations
import { ChatSessionRepositoryImpl } from './data/repositories/chat-session-repository-impl';
import { ChatMessageRepositoryImpl } from './data/repositories/chat-message-repository-impl';

// Usecases
import { SendChatMessageUsecase, AI_CHAT_CLIENT } from './domain/usecases/send-chat-message-usecase';
import { GetChatHistoryUsecase } from './domain/usecases/get-chat-history-usecase';

// Controllers
import { ChatController } from './app/http/controllers/chat-controller';

// External modules
import { ProductModule } from '../product/product-module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatSessionEntity, ChatMessageEntity]),
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: AI_CHAT_CLIENT,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get('rabbitmq.user')}:${configService.get('rabbitmq.password')}@${configService.get('rabbitmq.host')}:${configService.get('rabbitmq.port')}/${configService.get('rabbitmq.vhost')}`,
            ],
            queue: configService.get('rabbitmq.ai_queue_name') || 'ai-product-queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
    ProductModule,
  ],
  controllers: [ChatController],
  providers: [
    // Datasources
    ChatSessionDatasource,
    ChatMessageDatasource,

    // Repositories
    {
      provide: ChatSessionRepository,
      useClass: ChatSessionRepositoryImpl,
    },
    {
      provide: ChatMessageRepository,
      useClass: ChatMessageRepositoryImpl,
    },

    // Usecases
    SendChatMessageUsecase,
    GetChatHistoryUsecase,
  ],
  exports: [
    ChatSessionRepository,
    ChatMessageRepository,
  ],
})
export class ChatModule {}
