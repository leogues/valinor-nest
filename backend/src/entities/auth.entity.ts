import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
@Index(['source', 'sourceId'], { unique: true })
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
