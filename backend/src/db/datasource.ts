import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

export const dataSourceOptions: PostgresConnectionOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  synchronize: true,
  logging: true,
  entities: [__dirname + '/../entities/*.ts'],
  migrations: [__dirname + '/../db/migrations/*{.js,.ts}'],
};
