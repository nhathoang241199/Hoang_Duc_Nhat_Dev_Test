import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { VoteRepository } from './vote.repository';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: VoteRepository,
  ) {}

  async countVotesByVideo(videoId: number, isLike: boolean): Promise<number> {
    return this.voteRepository.count({
      where: { video: { id: videoId }, isLike },
    });
  }

  async findUserVote(videoId: number, userId: number): Promise<Vote | null> {
    return this.voteRepository.findOne({
      where: { video: { id: videoId }, user: { id: userId } },
    });
  }

  async createOrUpdateVote(
    videoId: number,
    userId: number,
    isLike: boolean,
  ): Promise<Vote> {
    let vote = await this.voteRepository.findOne({
      where: { video: { id: videoId }, user: { id: userId } },
    });

    if (vote) {
      vote.isLike = isLike;
    } else {
      vote = this.voteRepository.create({
        video: { id: videoId } as any,
        user: { id: userId } as any,
        isLike,
      });
    }

    return this.voteRepository.save(vote);
  }
}
