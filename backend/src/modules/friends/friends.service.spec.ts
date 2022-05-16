import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Club } from '../../schemas/club.schema';
import { AppModule } from '../../app.module';
import { User } from '../../schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { FriendsService } from './friends.service';

describe('FriendsService', () => {
  let service: FriendsService;

  function mockUserModel(dto: any) {
    this.data = dto;
    this.save  = () => {
      return this.data;
    };
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AppModule],
      providers: [FriendsService,  UsersService, ConfigService, {
        provide: getModelToken(User.name),
        useValue: mockUserModel,}, { provide: getModelToken(Club.name), useValue: mockUserModel }],
    }).compile();

    service = module.get<FriendsService>(FriendsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
