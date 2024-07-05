import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  source: string;

  @Column()
  sourceId: string;

  @Column()
  accessToken: string;

  @Column({ nullable: true })
  refreshToken: string | null;

  @Column()
  expires: Date;

  @OneToOne(() => User, (user) => user.auth, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
