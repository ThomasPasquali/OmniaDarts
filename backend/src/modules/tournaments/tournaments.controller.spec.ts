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
import { MatchesGateway } from '../matches/matches.gateway';
import { JwtService } from '@nestjs/jwt';
import { FriendRequestsService } from '../friendRequests/friendRequests.service';
import { ChatsService } from '../chats/chats.service';
import { FriendRequest } from '../../schemas/friendRequest.schema';
import { Chat } from '../../schemas/chat.schema';
import SimpleTournament from '../../classes/SimpleTournament';

describe('TournamentsController', () => {
  const user = {
    nickname: 'test',
    _id: 'test',
    pwd: 'test',
    club: null,
    isAdmin: true,
    tournaments: []
  } as User;

  const user1 = {
    nickname: 'test1',
    _id: 'test1',
    pwd: 'test1',
    club: null,
    isAdmin: true,
    tournaments: []
  } as User;

  const user2 = {
    nickname: 'test2',
    _id: 'test2',
    pwd: 'test2',
    club: null,
    isAdmin: true,
    tournaments: []
  } as User;

  const user3 = {
    nickname: 'test3',
    _id: 'test3',
    pwd: 'test3',
    club: null,
    isAdmin: true,
    tournaments: []
  } as User;

  const match = {
    _id: 'match',
  } as Match;

  const users = [user, user1, user2, user3];
  const tournamentSimple = {
    name: 'torneo',
    idPlayers: [users[1]._id, users[2]._id, users[3]._id],
  } as SimpleTournament;

  const tournament = {
    _id: 'torneo',
    name: 'torneo',
    randomOrder: true,
    players: users,
    matches: [],
    creation_date: new Date(),
    finished: false,
    creator: { _id: user._id } as User,
  } as Tournament;

  const tourMatch = {
    tournamentRef: { _id: tournament._id } as Tournament,
  } as TournamentMatch;

  let controller: TournamentsController;
  let app: INestApplication;
  let service: TournamentsService;
  let userService: UsersService;
  let matchService: MatchesService;
  let tournMatchService: TournamentMatchesService;
  let tournService: TournamentsService;

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
        MatchesGateway,
        JwtService,
        FriendRequestsService,
        ChatsService,
        MatchesService,
        { provide: getModelToken(Tournament.name), useValue: {} },
        { provide: getModelToken(User.name), useValue: {} },
        { provide: getModelToken(TournamentMatch.name), useValue: {} },
        { provide: getModelToken(Match.name), useValue: {} },
        { provide: getModelToken(Club.name), useValue: {} },
        { provide: getModelToken(FriendRequest.name), useValue: {} },
        { provide: getModelToken(Chat.name), useValue: {} },
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
    userService = module.get<UsersService>(UsersService);
    matchService = module.get<MatchesService>(MatchesService);
    tournMatchService = module.get<TournamentMatchesService>(
      TournamentMatchesService,
    );
    tournService = module.get<TournamentsService>(TournamentsService);

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Creazione torneo', () => {
    it('should create a new tournament', async () => {
      jest
        .spyOn(userService, 'findById')
        .mockImplementation(async (id) => users.filter((u) => u._id == id)[0]);
      jest.spyOn(userService, 'update').mockImplementation(async (id, u) => {
        const index = users.findIndex((us) => us._id == id);
        users[index] = u;
        return u;
      });
      jest
        .spyOn(matchService, 'newMatch')
        .mockImplementation(async (m) => match);
      jest
        .spyOn(tournMatchService, 'addTournamentMatch')
        .mockImplementation(async (m) => tourMatch);
      jest
        .spyOn(tournMatchService, 'update')
        .mockImplementation(async (id, m) => m);
      jest
        .spyOn(tournService, 'addTournament')
        .mockImplementation(async (m) => tournament);
      jest
        .spyOn(tournService, 'updateTournament')
        .mockImplementation(async (id, t) => t);

      const test = await request(app.getHttpServer())
        .post('/tournaments')
        .send(tournamentSimple)
        .expect(201);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
