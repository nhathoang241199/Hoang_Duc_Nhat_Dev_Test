import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './video.entity';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { UserModule } from '../user/user.module';
import { VoteRepository } from '../vote/vote.repository';
import { Vote } from '../vote/vote.entity';
import { VoteModule } from '../vote/vote.module';
import { UserRepository } from 'src/user/user.repository';
import { NotificationGateway } from 'src/gateways/notification.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video, VoteRepository, Vote]),
    UserModule,
    VoteModule,
  ],
  providers: [VideoService, NotificationGateway],
  controllers: [VideoController],
})
export class VideoModule {}
