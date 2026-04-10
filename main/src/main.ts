import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { setupSwagger } from './core/helpers/setup-swagger';
import { setupValidationPipe } from './core/helpers/setup-validation';
import { AllExceptionsFilter } from './exceptions/all-exceptions-filter';
import { AppModule } from './modules/app/app.module';
import { setupInjector } from './injector';
import { setupRabbitMQ } from './core/helpers/set-up-rmq';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      exposedHeaders: ['X-Total-Count', 'X-Error-Code', 'X-Error-Message', 'Content-Disposition'],
    },
    abortOnError: true,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(setupValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableVersioning();
  // await setupRabbitMQ(app);
  await setupSwagger(app);
  setupInjector(app);

  // Catch All Promise Exception
  process.on('unhandledRejection', function (err) {
    console.log(err);
  });

  await app.listen(app.get(ConfigService).get<number>('app.port') ?? 80);
}

bootstrap();
