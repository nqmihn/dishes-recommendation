import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  port: parseInt(process.env.APP_PORT ?? '80') || 80,
  debug: process.env.APP_DEBUG === 'true',
  url: process.env.APP_URL,
}));
