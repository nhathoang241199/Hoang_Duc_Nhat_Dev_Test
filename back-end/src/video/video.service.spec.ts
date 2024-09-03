import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video.service';
import { Video } from './video.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { VoteService } from '../vote/vote.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';

// Mock các repository và dịch vụ
const mockVideoRepository = () => ({
  findAndCount: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

const mockUserService = () => ({
  findByEmail: jest.fn(),
  findOne: jest.fn(),
});

const mockVoteService = () => ({
  countVotesByVideo: jest.fn(),
});

describe('VideoService', () => {
  let videoService: VideoService;
  let videoRepository: Repository<Video>;
  let userService: UserService;
  let voteService: VoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        { provide: getRepositoryToken(Video), useValue: mockVideoRepository() },
        { provide: UserService, useValue: mockUserService() },
        { provide: VoteService, useValue: mockVoteService() },
      ],
    }).compile();

    videoService = module.get<VideoService>(VideoService);
    videoRepository = module.get<Repository<Video>>(getRepositoryToken(Video));
    userService = module.get<UserService>(UserService);
    voteService = module.get<VoteService>(VoteService);
  });

  it('should return a list of videos', async () => {
    const videoList = [
      {
        id: 1,
        title: 'Test Video',
        url: 'http://test.com',
        description: 'Test Description',
        banner: 'Test Banner',
        createdAt: '2024-09-03T08:08:28.758Z' as unknown as Date,
        user: null,
        votes: [],
      } as Video,
    ];
    const page = 1;
    const pageSize = 10;
    const userId = null;

    jest
      .spyOn(videoRepository, 'findAndCount')
      .mockResolvedValue([videoList, 1]);

    const result = await videoService.findAll(page, pageSize, userId);
    expect(result).toEqual({
      currentPage: 1,
      total: 1,
      totalPages: 1,
      videos: [
        {
          banner: 'Test Banner',
          createdAt: '2024-09-03T08:08:28.758Z',
          description: 'Test Description',
          id: 1,
          likes: undefined,
          title: 'Test Video',
          unlikes: undefined,
          url: 'http://test.com',
          user: null,
          userVoteStatus: undefined,
          votes: [],
        },
      ],
    });
  });

  describe('create', () => {
    it('should create a video and return it', async () => {
      const createVideoDto: CreateVideoDto = {
        url: 'http://example.com/video',
        title: 'New Video',
        description: 'New description',
        banner: 'http://example.com/banner',
      };

      const mockVideo = {
        id: 1,
        ...createVideoDto,
        createdAt: new Date(),
        user: null, // or mock user if needed
        votes: [], // or mock votes if needed
      };

      jest.spyOn(videoRepository, 'save').mockResolvedValue(mockVideo);

      const result = await videoService.create(
        createVideoDto,
        { userId: 1 }.userId,
      );
      expect(result).toEqual(mockVideo);
    });
  });
});
