import { registerAs } from '@nestjs/config';

export default registerAs('openai', () => ({
  baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
}));
