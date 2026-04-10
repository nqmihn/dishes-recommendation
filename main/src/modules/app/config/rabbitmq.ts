import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => {
  return {
    user: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASSWORD,
    host: process.env.RABBITMQ_HOST,
    port: process.env.RABBITMQ_PORT,
    vhost: process.env.RABBITMQ_VHOST,
    queue_name: process.env.RABBITMQ_QUEUE_NAME, 
    queue_option_durable: process.env.RABBITMQ_QUEUE_OPTION_DURABLE || true,
    ai_queue_name: process.env.RABBITMQ_AI_QUEUE_NAME || 'ai-product-queue',
  };
});
