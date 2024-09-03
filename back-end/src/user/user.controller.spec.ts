import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'testuser',
        password: 'testpass',
      };
      const user = new User();
      user.id = 1;
      user.email = 'testuser';

      jest.spyOn(userService, 'createUser').mockResolvedValue(user);

      expect(await userController.register(createUserDto)).toEqual(user);
      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [new User()];
      jest.spyOn(userService, 'findAll').mockResolvedValue(result);

      expect(await userController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = new User();
      jest.spyOn(userService, 'findOne').mockResolvedValue(result);

      expect(await userController.findOne('1')).toBe(result);
      expect(userService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const removeSpy = jest
        .spyOn(userService, 'remove')
        .mockResolvedValue(undefined);

      await userController.remove('1');
      expect(removeSpy).toHaveBeenCalledWith(1);
    });
  });
});
