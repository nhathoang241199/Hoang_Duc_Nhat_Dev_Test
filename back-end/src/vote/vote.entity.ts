import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Video } from '../video/video.entity';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.votes)
  user: User;

  @ManyToOne(() => Video, (video) => video.votes)
  video: Video;

  @Column({ type: 'boolean' })
  isLike: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
