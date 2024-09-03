import { Test, TestingModule } from '@nestjs/testing';
import { VoteService } from './vote.service';
import { Vote } from './vote.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('VoteService', () => {
  let voteService: VoteService;
  let voteRepository: jest.Mocked<Repository<Vote>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteService,
        {
          provide: getRepositoryToken(Vote),
          useValue: {
            count: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    voteService = module.get<VoteService>(VoteService);
    voteRepository = module.get(getRepositoryToken(Vote)) as jest.Mocked<
      Repository<Vote>
    >;
  });

  describe('countVotesByVideo', () => {
    it('should return the count of votes', async () => {
      const videoId = 1;
      const isLike = true;
      const count = 5;
      voteRepository.count.mockResolvedValue(count);

      const result = await voteService.countVotesByVideo(videoId, isLike);

      expect(result).toBe(count);
      expect(voteRepository.count).toHaveBeenCalledWith({
        where: { video: { id: videoId }, isLike },
      });
    });
  });

  describe('findUserVote', () => {
    it('should return a vote if it exists', async () => {
      const videoId = 1;
      const userId = 2;
      const vote = {
        video: { id: videoId },
        user: { id: userId },
        isLike: true,
      } as Vote;
      voteRepository.findOne.mockResolvedValue(vote);

      const result = await voteService.findUserVote(videoId, userId);

      expect(result).toBe(vote);
      expect(voteRepository.findOne).toHaveBeenCalledWith({
        where: { video: { id: videoId }, user: { id: userId } },
      });
    });

    it('should return null if vote does not exist', async () => {
      const videoId = 1;
      const userId = 2;
      voteRepository.findOne.mockResolvedValue(null);

      const result = await voteService.findUserVote(videoId, userId);

      expect(result).toBeNull();
      expect(voteRepository.findOne).toHaveBeenCalledWith({
        where: { video: { id: videoId }, user: { id: userId } },
      });
    });
  });

  describe('createOrUpdateVote', () => {
    it('should update an existing vote', async () => {
      const videoId = 1;
      const userId = 2;
      const isLike = false;
      const existingVote = {
        video: { id: videoId },
        user: { id: userId },
        isLike: true,
      } as Vote;
      voteRepository.findOne.mockResolvedValue(existingVote);
      voteRepository.save.mockResolvedValue({ ...existingVote, isLike });

      const result = await voteService.createOrUpdateVote(
        videoId,
        userId,
        isLike,
      );

      expect(result.isLike).toBe(isLike);
      expect(voteRepository.findOne).toHaveBeenCalledWith({
        where: { video: { id: videoId }, user: { id: userId } },
      });
      expect(voteRepository.save).toHaveBeenCalledWith({
        ...existingVote,
        isLike,
      });
    });

    it('should create a new vote if not existing', async () => {
      const videoId = 1;
      const userId = 2;
      const isLike = true;
      voteRepository.findOne.mockResolvedValue(null);
      const newVote = {
        video: { id: videoId } as any,
        user: { id: userId } as any,
        isLike,
      };
      voteRepository.create.mockReturnValue(newVote as Vote);
      voteRepository.save.mockResolvedValue(newVote as Vote);

      const result = await voteService.createOrUpdateVote(
        videoId,
        userId,
        isLike,
      );

      expect(result).toEqual(newVote);
      expect(voteRepository.findOne).toHaveBeenCalledWith({
        where: { video: { id: videoId }, user: { id: userId } },
      });
      expect(voteRepository.create).toHaveBeenCalledWith({
        video: { id: videoId } as any,
        user: { id: userId } as any,
        isLike,
      });
      expect(voteRepository.save).toHaveBeenCalledWith(newVote);
    });
  });
});
