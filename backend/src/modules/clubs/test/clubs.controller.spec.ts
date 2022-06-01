import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../../schemas/user.schema';
import { Club } from '../../../schemas/club.schema';
import { ClubsController } from '../clubs.controller';
import { ClubsService } from '../clubs.service';
import { UsersService } from '../../users/users.service';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from '../../auth/auth.module';
import { AppModule } from '../../../app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { before } from '@nestjs/swagger/dist/plugin';

describe('ClubsController', () => {
  let user = {
    nickname: 'test',
    _id: 'test',
    pwd: 'test',
    club: null,
    isAdmin: false,
  } as User;

  let user2 = {
    nickname: 'test2',
    _id: 'test2',
    pwd: 'test2',
    club: null,
    isAdmin: false,
  } as User;

  let newClub = {
    name: 'testClub',
    description: 'testClubDesc',
    players: [],
  } as Club;

  const req = { user: user };

  let app: INestApplication;
  let controller: ClubsController;
  let service: ClubsService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubsController],
      providers: [
        CaslAbilityFactory,
        UsersService,
        ClubsService,
        { provide: getModelToken(Club.name), useValue: {} },
        { provide: getModelToken(User.name), useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          context.switchToHttp().getRequest().user = user;
          return true;
        },
      })
      .compile();

    controller = module.get<ClubsController>(ClubsController);
    service = module.get<ClubsService>(ClubsService);
    userService = module.get<UsersService>(UsersService);

    app = module.createNestApplication();
    await app.init();
  });

  describe('Creazione di un club', () => {
    it('should create a new club and make the user admin', async () => {
      jest.spyOn(service, 'addClub').mockImplementation(async (_) => newClub);
      jest.spyOn(userService, 'findById').mockImplementation(async (_) => user);
      jest.spyOn(userService, 'update').mockImplementation(async (id, u) => {
        user = u;
        return u;
      });
      jest.spyOn(service, 'update').mockImplementation(async (id, club) => {
        newClub = club;
        return club;
      });

      const test = await request(app.getHttpServer())
        .post('/clubs')
        .send({ name: 'testClub', description: 'testClubDesc' })
        .expect(201);

      expect(test.body.players).toBeDefined();
      expect(test.body.players[0]._id).toBe(user._id);
    });
  });

  describe('Invio richiesta di ammissione ad un club, accettazione, rimozione', () => {
    it('should send a request', async () => {
      jest
        .spyOn(service, 'getClubById')
        .mockImplementation(async (_) => newClub);
      jest
        .spyOn(userService, 'findById')
        .mockImplementation(async (_) => user2);
      jest.spyOn(userService, 'update').mockImplementation(async (id, u) => {
        user2 = u;
        return u;
      });
      jest.spyOn(service, 'update').mockImplementation(async (id, club) => {
        newClub = club;
        return club;
      });
      const req = { user: user2 };

      const response = await controller.sendRequest(req, 'message', 'test');
      expect(response.players[1]._id).toBe(user2._id);
      expect(user2.club).toBeNull();
      expect(user2.clubRequest.club._id).toBe(newClub._id);

      const test = await request(app.getHttpServer())
        .patch('/clubs/joinRequest/test2')
        .expect(200);

      expect(user2.clubRequest).toBeNull();
      expect(user2.club._id).toBe(newClub._id);

      const res = await controller.exitFromMyOwnClub(req);
      expect(res._id).toBe(newClub._id);
    });
  });

  describe('Invio richiesta di ammissione ad un club, rifiuto', () => {
    it('should send a request', async () => {
      jest
        .spyOn(service, 'getClubById')
        .mockImplementation(async (_) => newClub);
      jest
        .spyOn(userService, 'findById')
        .mockImplementation(async (_) => user2);
      jest.spyOn(userService, 'update').mockImplementation(async (id, u) => {
        user2 = u;
        return u;
      });
      jest.spyOn(service, 'update').mockImplementation(async (id, club) => {
        newClub = club;
        return club;
      });
      const req = { user: user2 };

      const response = await controller.sendRequest(req, 'message', 'test');
      expect(response.players[1]._id).toBe(user2._id);
      expect(user2.club).toBeNull();
      expect(user2.clubRequest.club._id).toBe(newClub._id);

      const test = await request(app.getHttpServer())
        .delete('/clubs/joinRequest/test2')
        .expect(200);

      expect(user2.clubRequest).toBeNull();
      expect(user2.club).toBeNull();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
