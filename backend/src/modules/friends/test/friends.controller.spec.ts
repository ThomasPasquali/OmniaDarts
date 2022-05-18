import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserDocument, UserSchema } from '../../../schemas/user.schema';
import { UsersModule } from '../../users/users.module';
import mongoose, { Model } from 'mongoose';
import { FriendsController } from '../friends.controller';
import { UserModel } from './user.model';
import { FriendsService } from '../friends.service';
import { UsersService } from '../../users/users.service';

describe('FriendsController', () => {
  let userService = { findAll: () => ['test'] };

  const mockUser = { nickname: 'test', pwd: 'test', _id: 'test' };
  const mockClub = { name: 'Robotics', description: 'only for test purpose' };

  let controller: FriendsController;
  let spyModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendsController],
      providers: [
        UsersService,
        FriendsService,
        {
          provide: getModelToken(User.name),
          useValue: UserModel,
        },
      ],
    }).compile();

    controller = module.get<FriendsController>(FriendsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
