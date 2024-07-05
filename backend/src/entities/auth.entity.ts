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

  @Column('text')
  source: string;

  @Column('text')
  sourceId: string;

  @Column('text')
  accessToken: string;

  @Column({ type: 'text', nullable: true })
  refreshToken: string | null;

  @Column()
  expires: Date;

  @OneToOne(() => User, (user) => user.auth, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
