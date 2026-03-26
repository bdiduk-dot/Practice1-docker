import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'nestuser',
  password: process.env.POSTGRES_PASSWORD || 'nestpassword',
  database: process.env.POSTGRES_DB || 'nestdb',
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  migrationsRun: false,
});
