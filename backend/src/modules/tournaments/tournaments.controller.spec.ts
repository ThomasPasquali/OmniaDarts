import { Club } from '../../schemas/club.schema';
import { User } from '../../schemas/user.schema';
import { PostsController } from '../clubs/posts/posts.controller';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { ClubsService } from '../clubs/clubs.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { UsersService } from '../users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as request from 'supertest';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { Tournament } from '../../schemas/tournaments.schema';
import { MatchesService } from '../matches/matches.service';
import { TournamentMatchesService } from '../tournament-matches/tournament-matches.service';
import { TournamentMatch } from '../../schemas/tournamentMatch.schema';
import { Match } from '../../schemas/match.schema';

describe('TournamentsController', () => {
  const user = {
    nickname: 'test',
    _id: 'test',
    pwd: 'test',
    club: null,
    isAdmin: true,
  } as User;

  const user1 = {
    nickname: 'test1',
    _id: 'test1',
    pwd: 'test1',
    club: null,
    isAdmin: true,
  } as User;

  const user2 = {
    nickname: 'test2',
    _id: 'test2',
    pwd: 'test2',
    club: null,
    isAdmin: true,
  } as User;

  const user3 = {
    nickname: 'test3',
    _id: 'test3',
    pwd: 'test3',
    club: null,
    isAdmin: true,
  } as User;

  let controller: TournamentsController;
  let app: INestApplication;
  let service: TournamentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TournamentsController],
      providers: [
        TournamentMatchesService,
        TournamentsService,
        ConfigService,
          ClubsService,
        CaslAbilityFactory,
        UsersService,
        MatchesService,
        { provide: getModelToken(Tournament.name), useValue: {} },
        { provide: getModelToken(User.name), useValue: {} },
        { provide: getModelToken(TournamentMatch.name), useValue: {} },
        { provide: getModelToken(Match.name), useValue: {} },
        { provide: getModelToken(Club.name), useValue: {} },
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

    controller = module.get<TournamentsController>(TournamentsController);
    service = module.get<TournamentsService>(TournamentsService);

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Creazione torneo', () => {
    it('should create a new tournament', async () => {
      console.log('tournament');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
