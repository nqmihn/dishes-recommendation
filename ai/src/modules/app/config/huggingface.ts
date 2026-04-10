import { registerAs } from '@nestjs/config';

export default registerAs('huggingface', () => ({
  apiToken: process.env.HF_API_TOKEN,
  embeddingModel: process.env.HF_EMBEDDING_MODEL || 'sentence-transformers/all-MiniLM-L6-v2',
  embeddingDimensions: parseInt(process.env.HF_EMBEDDING_DIMENSIONS ?? '384') || 384,
}));
