import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  connect: process.env.DB_CONNECTION,
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: process.env.DB_LOGGING === 'true',
  autoLoadEntities: true,
  migrations: ['dist/migrations/*.js'],
  migrationsRun: false,
  synchronize: false,
  relationLoadStrategy: 'query',
}));
