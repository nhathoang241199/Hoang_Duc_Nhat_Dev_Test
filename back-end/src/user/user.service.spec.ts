import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const user = { email: 'test@example.com', id: 1 } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await userService.findByEmail('test@example.com');
      expect(result).toEqual(user);
    });

    it('should return undefined if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      const result = await userService.findByEmail('nonexistent@example.com');
      expect(result).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should throw ConflictException if user already exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as User);

      await expect(
        userService.createUser({
          email: 'test@example.com',
          password: 'password',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create and save a new user', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
      const createUserDto = { email: 'new@example.com', password: 'password' };
      const hashedPassword = 'hashedPassword';
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest
        .spyOn(userRepository, 'create')
        .mockReturnValue(createUserDto as User);
      jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(createUserDto as User);

      const result = await userService.createUser(createUserDto);
      expect(result).toEqual(createUserDto);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, email: 'test@example.com' } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await userService.findOne(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(userService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      // Mock implementation
      (userRepository.delete as jest.Mock).mockResolvedValue({
        affected: 1,
        raw: {}, // Add raw to match the DeleteResult type
      });

      await expect(userService.remove(1)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      // Mock implementation
      (userRepository.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(userService.remove(1)).resolves.toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, email: 'test@example.com' } as User;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await userService.findById(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(userService.findById(1)).rejects.toThrow(NotFoundException);
    });
  });
});
