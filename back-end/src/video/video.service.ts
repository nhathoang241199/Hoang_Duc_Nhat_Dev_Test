import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { VoteService } from '../vote/vote.service';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { VoteDto } from './dto/vote-video.dto';
import { Video } from './video.entity';
import { NotificationGateway } from '../gateways/notification.gateway';

enum EVoteStatus {
  liked = 'liked',
  unliked = 'unliked',
  notVoted = 'notVoted',
}

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    private readonly userService: UserService,
    private readonly voteService: VoteService,
    private notificationGateway: NotificationGateway,
  ) {}

  async findAll(
    page: number,
    pageSize: number,
    userId: number | null,
  ): Promise<any> {
    const [videos, total] = await this.videoRepository.findAndCount({
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    try {
      const videoWithVoteInfo = await Promise.all(
        videos.map(async (video) => {
          const likes = await this.voteService.countVotesByVideo(
            video.id,
            true,
          );
          const unlikes = await this.voteService.countVotesByVideo(
            video.id,
            false,
          );

          let userVoteStatus: EVoteStatus | undefined = undefined;

          if (userId) {
            const vote = await this.voteService.findUserVote(video.id, userId);

            if (vote) {
              userVoteStatus = vote.isLike
                ? EVoteStatus.liked
                : EVoteStatus.unliked;
            } else {
              userVoteStatus = EVoteStatus.notVoted;
            }
          }

          return {
            ...video,
            likes,
            unlikes,
            userVoteStatus,
          };
        }),
      );
      return {
        videos: videoWithVoteInfo || [],
        total: total || 0,
        totalPages: Math.ceil(total / pageSize) || 1,
        currentPage: page || 1,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(video: CreateVideoDto, userId: number): Promise<Video> {
    const { url } = video;

    const existingVideo = await this.videoRepository.findOne({
      where: { url },
    });

    const user = await this.userService.findOne(userId);

    if (existingVideo) {
      throw new ConflictException('The video already exists!');
    }
    const savedVideo = this.videoRepository.save({ ...video, user: user });
    if (user) {
      this.notificationGateway.sendVideoNotification(video.title, user.email);
    }

    return savedVideo;
  }

  async delete(id: number): Promise<void> {
    await this.videoRepository.delete(id);
  }

  async voteVideo(userId: number, voteDto: VoteDto): Promise<void> {
    const { videoId, isLike } = voteDto;

    const video = await this.videoRepository.findOne({
      where: { id: videoId },
    });
    if (!video) {
      throw new NotFoundException('Video not found');
    }

    await this.voteService.createOrUpdateVote(videoId, userId, isLike);
  }
}
