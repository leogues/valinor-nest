import { User as UserEntity } from 'src/entities/user.entity';
import { WithoutTimestamp } from 'src/utils/type';

export type User = WithoutTimestamp<UserEntity>;
export type UserDTO = Omit<User, 'id' | 'auth'>;
