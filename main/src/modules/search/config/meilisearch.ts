import { registerAs } from '@nestjs/config';

export default registerAs('meilisearch', () => ({
  host: process.env.MEILISEARCH_HOST || 'http://meilisearch:7700',
  key: process.env.MEILISEARCH_KEY || '123456',
}));
