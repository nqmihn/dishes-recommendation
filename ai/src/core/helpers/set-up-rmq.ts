import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parseBoolean } from './utils';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export async function setupRabbitMQ(app: INestApplication) {
  const configService = app.get(ConfigService);
  const rabbitUser = configService.get('rabbitmq.user');
  const rabbitPassword = configService.get('rabbitmq.password');
  const rabbitHost = configService.get('rabbitmq.host');
  const rabbitPort = configService.get('rabbitmq.port');
  const vhost = configService.get('rabbitmq.vhost');
  const queueName = configService.get('rabbitmq.queue_name');
  const queueOptionDurable =
    parseBoolean(configService.get('rabbitmq.queue_option_durable')) ?? false; // Fallback to a default boolean value

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${rabbitUser}:${rabbitPassword}@${rabbitHost}:${rabbitPort}/${vhost}`,
      ],
      noAck: false,
      queue: queueName,
      wildcards: true,
      queueOptions: {
        durable: queueOptionDurable,
      },
    },
  });
  await app.startAllMicroservices();
}
