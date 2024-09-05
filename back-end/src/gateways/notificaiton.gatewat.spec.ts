import { Test, TestingModule } from '@nestjs/testing';
import { NotificationGateway } from './notification.gateway';
import { Server } from 'socket.io';

describe('NotificationGateway', () => {
  let notificationGateway: NotificationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationGateway],
    }).compile();

    notificationGateway = module.get<NotificationGateway>(NotificationGateway);
    // Mock Server (Socket.io)
    notificationGateway.server = { emit: jest.fn() } as any;
  });

  it('should send notification to the correct user', () => {
    const title = 'video title';
    const email = 'user@gmail.com';

    notificationGateway.sendVideoNotification(title, email);

    expect(notificationGateway.server.emit).toHaveBeenCalledWith(
      'videoShared',
      {
        title,
        user: email,
      },
    );
  });
});
