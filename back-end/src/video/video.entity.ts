import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Vote } from '../vote/vote.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  banner: string;

  @ManyToOne(() => User, (user) => user.videos)
  user: User;

  @OneToMany(() => Vote, (vote) => vote.video)
  votes: Vote[];

  @CreateDateColumn()
  createdAt: Date;
}
