import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { User, UserSchema } from '../../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
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
        { provide: getModelToken(User.name), useValue: {} },
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

  describe('Login di un utente', () => {
    it("should return an access token if user's logged", async () => {
      // Case "all it's gonna be alright"
      const u = {
        nickname: 'test',
        _id: 'test',
        pwd: 'test',
      };
      const result = new Promise<any>((resolve, reject) => {
        resolve(u);
      });
      jest
        .spyOn(authService, 'validateUser')
        .mockImplementation((u, p) => result);
      jest
        .spyOn(authService, 'login')
        .mockImplementation(async (capo: User) => {
          return { access_token: 'token' };
        });

      expect(await controller.login(u as User)).toHaveProperty('access_token');
    });

    describe('Login di un utente con password errata', () => {
      it('should return 401 unauthorized', async () => {
        const u = { nickname: 'test', _id: 'test', pwd: 'errata' } as User;

        jest
          .spyOn(authService, 'validateUser')
          .mockImplementation((u, p) => null);

        await expect(controller.login(u as User)).rejects.toThrow(
          new UnauthorizedException(),
        );
      });
    });

    describe('Registrazione di un utente', () => {
      it('should return an access token if a user is successfully created', async () => {
        // Case "all it's gonna be alright"
        const u = {
          nickname: 'test',
          _id: 'test',
          pwd: 'test',
        } as User;
        const result = new Promise<any>((resolve, reject) => {
          resolve(u);
        });
        jest.spyOn(userService, 'create').mockImplementation((u) => result);
        jest.spyOn(authService, 'login').mockImplementation(async (u) => {
          return { access_token: 'token' };
        });

        expect(await controller.register(u)).toHaveProperty('access_token');
      });
    });

    describe('Registrazione di un utente con nickname esistente', () => {
      it('should return 409 (Conflict)', async () => {
        // Case "all it's gonna be alright"
        const u = {
          nickname: 'test',
          _id: 'test',
          pwd: 'test',
        } as User;

        jest.spyOn(userService, 'create').mockImplementation(async (u) => null);

        await expect(controller.register(u as User)).rejects.toThrow(
          new ConflictException(),
        );
      });
    });
  });
});
