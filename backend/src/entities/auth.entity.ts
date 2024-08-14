import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @Column({ nullable: true, type: 'timestamp' })
  expires: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.auth, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: User | null;

  @Column()
  userId: number;
}
