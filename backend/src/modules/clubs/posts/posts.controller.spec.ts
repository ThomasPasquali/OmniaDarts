import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory';
import { ClubsService } from '../clubs.service';
import { getModelToken } from '@nestjs/mongoose';
import { FriendRequest } from '../../../schemas/friendRequest.schema';
import { Club } from '../../../schemas/club.schema';
import { UsersService } from '../../users/users.service';
import { User } from '../../../schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Post } from '../../../schemas/post.schema';
import ClubPost from '../../../classes/post';

describe('PostsController', () => {
  let newClub = {
    name: 'testClub',
    description: 'testClubDesc',
    players: [],
    posts: [],
  } as Club;

  const user = {
    nickname: 'test',
    _id: 'test',
    pwd: 'test',
    club: newClub,
    isAdmin: true,
  } as User;

  let controller: PostsController;
  let app: INestApplication;
  let service: ClubsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        ConfigService,
        ClubsService,
        CaslAbilityFactory,
        UsersService,
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

    controller = module.get<PostsController>(PostsController);
    service = module.get<ClubsService>(ClubsService);

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Creazione post', () => {
    it('should create a new post in my club', async () => {
      jest.mock('multer');

      jest
        .spyOn(service, 'getClubById')
        .mockImplementation(async (id: string) => newClub);

      jest
        .spyOn(service, 'update')
        .mockImplementation(async (id: string, club: Club) => {
          newClub = club;
          return club;
        });

      const testPost = {
        title: 'testClub',
        message: 'simple message',
      };

      const test = await request(app.getHttpServer())
        .post('/posts')
        .send(testPost)
        .expect(201);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
