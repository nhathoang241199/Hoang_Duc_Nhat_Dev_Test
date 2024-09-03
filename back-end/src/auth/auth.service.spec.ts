import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(), // Mock UserService
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(), // Mock JwtService
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data without password if validation is successful', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        videos: [],
        votes: [],
      } as User;
      const result = {
        id: 1,
        email: 'test@example.com',
        videos: [],
        votes: [],
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      expect(
        await authService.validateUser('test@example.com', 'password'),
      ).toEqual(result);
    });

    it('should return null if validation fails', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      expect(
        await authService.validateUser('test@example.com', 'password'),
      ).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        videos: [],
        votes: [],
      } as User;

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      expect(
        await authService.validateUser('test@example.com', 'password'),
      ).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token if login is successful', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      const user = { id: 1, email: 'test@example.com' };
      const token = 'testToken';

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      expect(await authService.login(loginDto)).toEqual({
        access_token: token,
      });
    });
  });
});
