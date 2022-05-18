import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Club, ClubSchema } from '../../schemas/club.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;
  let userService: UsersService;

  beforeEach(async () => {
    function mockUserModel(dto: any) {
      this.data = dto;
      this.save = () => {
        return this.data;
      };
    }

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        ConfigService,
        UsersService,
        { provide: JwtService, useValue: {} },
        { provide: getModelToken(User.name), useValue: UserSchema },
        { provide: getModelToken(Club.name), useValue: ClubSchema },
        AuthService,
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    controller = moduleRef.get<AuthController>(AuthController);
    userService = moduleRef.get<UsersService>(UsersService);
  });

  describe('defined', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('login', () => {
    it("should return an access token if user's logged", async () => {
      // Case "all it's gonna be alright"
      const u = {
        nickname: 'test',
        _id: 'test',
        pwd: 'test',
        googleToken: '',
        imageUrl: '',
        matches: [],
        friends: [],
      };
      const result = new Promise<any>((resolve, reject) => {
        resolve(u);
      });
      jest.spyOn(authService, 'validateUser').mockImplementation((u) => result);
      jest.spyOn(authService, 'login').mockImplementation((u) => {
        return { access_token: 'token' };
      });

      expect(await controller.login(u as User)).toHaveProperty('access_token');

      // Case "all it's wrong in this world" (unregistered user)
      jest
        .spyOn(authService, 'validateUser')
        .mockImplementation((u, p) => null);

      await expect(controller.login(u as User)).rejects.toThrow(
        new UnauthorizedException(),
      );
    });
  });

  describe('register', () => {
    it('should return an access token if a user is successfully created', async () => {
      // Case "all it's gonna be alright"
      const u = {
        nickname: 'test',
        _id: 'test',
        pwd: 'test',
        imageUrl: '',
        googleToken: '',
        matches: [],
        friends: [],
      };
      const result = new Promise<any>((resolve, reject) => {
        resolve(u);
      });
      jest.spyOn(userService, 'create').mockImplementation((u) => result);
      jest.spyOn(authService, 'login').mockImplementation((u) => {
        return { access_token: 'token' };
      });

      expect(await controller.register(u as User)).toHaveProperty(
        'access_token',
      );

      // Case "all it's wrong in this world" (registering procedure fails)
      jest.spyOn(userService, 'create').mockImplementation((u) => null); // save operation fails

      await expect(controller.register(u as User)).rejects.toThrow(
        new InternalServerErrorException(),
      );
    });
  });
});
