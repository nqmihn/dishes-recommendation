import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  redis_db: process.env.CACHE_REDIS_DB,
}));
