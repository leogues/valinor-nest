import { Auth } from 'src/entities/auth.entity';
import { User } from 'src/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'root',
  password: 'root',
  database: 'kanban',
  entities: [Auth, User],
  synchronize: true,
};

export const dataSource = new DataSource(dataSourceOptions);
