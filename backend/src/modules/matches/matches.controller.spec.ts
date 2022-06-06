import { User } from '../../schemas/user.schema';
import { Match } from '../../schemas/match.schema';
import SimpleTournament from '../../classes/SimpleTournament';
import { Tournament } from '../../schemas/tournaments.schema';
import { TournamentMatch } from '../../schemas/tournamentMatch.schema';
import { TournamentsController } from '../tournaments/tournaments.controller';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { TournamentsService } from '../tournaments/tournaments.service';
import { UsersService } from '../users/users.service';
import { MatchesService } from './matches.service';
import { TournamentMatchesService } from '../tournament-matches/tournament-matches.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ClubsService } from '../clubs/clubs.service';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { MatchesGateway } from './matches.gateway';
import { JwtService } from '@nestjs/jwt';
import { FriendRequestsService } from '../friendRequests/friendRequests.service';
import { ChatsService } from '../chats/chats.service';
import { getModelToken } from '@nestjs/mongoose';
import { Club } from '../../schemas/club.schema';
import { FriendRequest } from '../../schemas/friendRequest.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MatchesController } from './matches.controller';
import { LobbiesService } from '../lobbies/lobbies.service';
import { LobbiesGateway } from '../lobbies/lobbies.gateway';
import * as request from 'supertest';
import { Chat } from '../../schemas/chat.schema';

describe('TournamentsController', () => {
  const user = {
    nickname: 'test',
    _id: 'test',
    pwd: 'test',
    club: null,
    isAdmin: true,
    tournaments: [],
  } as User;

  const match = {
    _id: 'match',
  } as Match;

  const chat = {
    _id: 'chat',
    messages: [],
    playersIDs: [],
  } as Chat;

  let controller: MatchesController;
  let app: INestApplication;
  let service: MatchesService;
  let userService: UsersService;
  let matchService: MatchesService;
  let chatService: ChatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        MatchesService,
        ChatsService,
        MatchesGateway,
        UsersService,
        FriendRequestsService,
        ClubsService,
        JwtService,
        LobbiesService,
        LobbiesGateway,
        { provide: getModelToken(User.name), useValue: {} },
        { provide: getModelToken(Match.name), useValue: {} },
        { provide: getModelToken(Chat.name), useValue: {} },
        { provide: getModelToken(Club.name), useValue: {} },
        { provide: getModelToken(FriendRequest.name), useValue: {} },
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

    controller = module.get<MatchesController>(MatchesController);
    service = module.get<MatchesService>(MatchesService);
    chatService = module.get<ChatsService>(ChatsService);
    matchService = module.get<MatchesService>(MatchesService);

    app = module.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Creazione match', () => {
    it('should create a new match', async () => {
      jest
        .spyOn(matchService, 'newMatch')
        .mockImplementation(async (m) => match);
      jest
        .spyOn(matchService, 'findUserActiveLobby')
        .mockImplementation(async (m) => null);
      jest
        .spyOn(chatService, 'create')
        .mockImplementation(async (a, b, c) => chat);
      jest
        .spyOn(chatService, 'update')
        .mockImplementation(async (id, c: Chat) => c);

      const test = await request(app.getHttpServer())
        .post('/matches/lobby/new')
        .send(match)
        .expect(201);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
