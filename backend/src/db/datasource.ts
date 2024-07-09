import * as dotenv from 'dotenv';
import { Auth } from 'src/entities/auth.entity';
import { User } from 'src/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

export const dataSourceOptions: PostgresConnectionOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  synchronize: true,
  logging: true,
  entities: [Auth, User],
  migrations: [__dirname + '/../db/migrations/*{.js,.ts}'],
};
