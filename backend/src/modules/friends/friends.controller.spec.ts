import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../schemas/user.schema';
import { AppModule } from '../../app.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

describe('FriendsController', () => {

  function mockUserModel(dto: any) {
    this.data = dto;
    this.save  = () => {
      return this.data;
    };
  }

  let controller: FriendsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule],
      controllers: [FriendsController],
      providers: [FriendsService, UsersService, ConfigService, {
        provide: getModelToken(User.name),
        useValue: mockUserModel,
      }],
    }).compile();

    controller = module.get<FriendsController>(FriendsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
