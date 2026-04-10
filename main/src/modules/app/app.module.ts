import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app/controllers/api/public/app.controller';
import app from './config/app';
import localization from './config/localization';
import swagger from './config/swagger';
import { GetServiceInformationUsecase } from './domain/usecases/get-service-information.usecase';
import { Module } from '@nestjs/common';
import { HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { ConsoleModule } from 'nestjs-console';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import redis from './config/redis';
import cache from './config/cache';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { CategoryModule } from '../category/category-module';
import { ProductModule } from '../product/product-module';
import database from './config/database';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { ProxyConsumer } from './app/controllers/api/public/consumer.controller';
import rabbitmq from './config/rabbitmq';
import { GenSampleDataConsole } from './app/commands/gen-sample-data.console';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [app, swagger, localization, redis, cache, database, rabbitmq],
    }),
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow<string>('localization.fallback_locale'),
        loaderOptions: {
          path: join(__dirname, '../..', '/i18n/'),
          watch: false,
        },
      }),
      resolvers: [
        {
          use: QueryResolver,
          options: ['lang'],
        },
        new HeaderResolver(['x-language']),
      ],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let store;
        try {
          const redisStore = new KeyvRedis({
            socket: {
              host: configService.get<string>('redis.host') || 'localhost',
              port: configService.get<number>('redis.port') || 6379,
            },
            database: configService.get<number>('cache.redis_db') || 0,
          });
          await redisStore.get('health');
          store = redisStore;
          console.log('Connected to Redis for caching');
        } catch {
          store = new Keyv();
          console.warn('Failed to connect to Redis, using in-memory cache instead');
        }

        return { stores: [store] };
      },
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<TypeOrmModuleOptions>('database') as TypeOrmModuleOptions,
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    ConsoleModule,
    ScheduleModule.forRoot(),
    CategoryModule,
    ProductModule,
  ],
  controllers: [AppController, ProxyConsumer],
  providers: [
    GetServiceInformationUsecase,
    GenSampleDataConsole,
  ],
})
export class AppModule { }
