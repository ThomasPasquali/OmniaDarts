import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { FriendRequestsController } from './friendRequests.controller';
import { FriendRequestsService } from './friendRequests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { FriendRequest } from '../../schemas/friendRequest.schema';

describe('FriendsController', () => {
  let user, user2, users, req;

  let app: INestApplication;
  let controller: FriendRequestsController;
  let service: FriendRequestsService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendRequestsController],
      providers: [
        FriendRequestsService,
        UsersService,
        { provide: getModelToken(FriendRequest.name), useValue: {} },
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

    controller = module.get<FriendRequestsController>(FriendRequestsController);
    service = module.get<FriendRequestsService>(FriendRequestsService);
    userService = module.get<UsersService>(UsersService);

    jest.spyOn(userService, 'findById').mockImplementation(async (id) => {
      return users.filter((u) => u._id == id)[0];
    });
    jest.spyOn(userService, 'update').mockImplementation(async (id, u) => {
      if (id == user._id) user = u;
      else user2 = u;
      return u;
    });
    jest
      .spyOn(service, 'createRequest')
      .mockImplementation(async (request) => request);
    jest
      .spyOn(service, 'updateRequest')
      .mockImplementation(async (id, request) => request);

    jest.spyOn(service, 'deleteRequest').mockImplementation(async (id) => {
      for (const u of users) {
        u.friendRequests = u.friendRequests.filter((re) => id != re._id);
      }
      return null;
    });

    user = {
      nickname: 'test',
      _id: 'test',
      pwd: 'test',
      club: null,
      friendRequests: [],
      isAdmin: false,
    } as User;

    user2 = {
      nickname: 'test2',
      _id: 'test2',
      pwd: 'test2',
      club: null,
      friendRequests: [],
      isAdmin: false,
    } as User;

    users = [user, user2];
    req = { user: user2 };

    app = module.createNestApplication();
    await app.init();
  });

  describe('Creazione richiesta di amicizia, accettazione', () => {
    it('should create a new friend to the currrent user', async () => {
      const test = await request(app.getHttpServer())
        .post(`/friends/${user2._id}`)
        .expect(201);

      expect(test.body.friendRequests[0].user._id).toBe(user2._id);
      expect(user.friendRequests[0].user._id).toBe(user2._id);
      expect(user2.friendRequests[0].user._id).toBe(user._id);
      expect(user2.friendRequests[0].isSender).toBe(false);
      expect(user.friendRequests[0].isSender).toBe(true);
      expect(user2.friendRequests[0].pending).toBe(true);
      expect(user.friendRequests[0].pending).toBe(true);

      // Accept
      const response = await controller.acceptFriend(req, user._id);

      expect(user2.friendRequests[0].pending).toBe(false);
      expect(user.friendRequests[0].pending).toBe(false);
    });
  });

  describe('Creazione richiesta di amicizia, rifiuto', () => {
    it('should create a new friend to the currrent user', async () => {
      const test = await request(app.getHttpServer())
        .post(`/friends/${user2._id}`)
        .expect(201);

      expect(test.body.friendRequests[0].user._id).toBe(user2._id);
      expect(user.friendRequests[0].user._id).toBe(user2._id);
      expect(user2.friendRequests[0].user._id).toBe(user._id);
      expect(user2.friendRequests[0].isSender).toBe(false);
      expect(user.friendRequests[0].isSender).toBe(true);
      expect(user2.friendRequests[0].pending).toBe(true);
      expect(user.friendRequests[0].pending).toBe(true);

      user2.friendRequests[0]._id = 'req1';
      user.friendRequests[0]._id = 'req2';

      // Reject
      const response = await controller.deleteFriend(req, user._id);

      expect(user2.friendRequests.length).toBe(0);
      expect(user.friendRequests.length).toBe(0);
    });
  });
});
