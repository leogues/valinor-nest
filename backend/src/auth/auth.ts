import { Auth as AuthEntity } from 'src/entities/auth.entity';
import { WithoutTimestamp } from 'src/utils/type';

export type Auth = WithoutTimestamp<AuthEntity>;
export type AuthDTO = Omit<Auth, 'id' | 'user'>;
