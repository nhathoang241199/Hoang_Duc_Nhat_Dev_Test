import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { Video } from './video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { VoteDto } from './dto/vote-video.dto';
import { NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { NotificationGateway } from '../gateways/notification.gateway';

// Mock VideoService
const mockVideoService = {
  findAll: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
  vote: jest.fn(),
};

// Mock NotificationGateway
const mockNotificationGateway = {
  sendVideoNotification: jest.fn(), // Mock phương thức gửi thông báo
};

describe('VideoController', () => {
  let videoController: VideoController;
  let videoService: VideoService;
  let notificationGateway: NotificationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        {
          provide: VideoService,
          useValue: mockVideoService,
        },
        {
          provide: NotificationGateway,
          useValue: mockNotificationGateway,
        },
      ],
    }).compile();

    videoController = module.get<VideoController>(VideoController);
    videoService = module.get<VideoService>(VideoService);
    notificationGateway = module.get<NotificationGateway>(NotificationGateway);
  });

  describe('findAll', () => {
    it('should return an array of videos', async () => {
      const result = [new Video()];
      jest.spyOn(videoService, 'findAll').mockResolvedValue(result);

      expect(
        await videoController.findAll({ user: { userId: 1 } }, 1, 10),
      ).toBe(result);
    });
  });

  describe('create', () => {
    it('should create and return a video', async () => {
      const createVideoDto: CreateVideoDto = {
        url: 'http://example.com',
        title: 'Test Video',
        description: 'Test Description',
        banner: 'Test Banner',
      };
      const newVideo = new Video();
      newVideo.id = 1;
      newVideo.url = createVideoDto.url;
      newVideo.title = createVideoDto.title;
      newVideo.description = createVideoDto.description;
      newVideo.banner = createVideoDto.banner;
      newVideo.createdAt = new Date();

      jest.spyOn(videoService, 'create').mockResolvedValue(newVideo);

      expect(
        await videoController.create(createVideoDto, { user: { userId: 1 } }),
      ).toBe(newVideo);
    });
  });
});
