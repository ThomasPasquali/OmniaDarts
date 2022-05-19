import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../../schemas/user.schema';
import { UsersService } from '../../users/users.service';
import { FriendsRequestsController } from '../friendRequests.controller';
import { FriendRequestsService } from '../friendRequests.service';
import { UserModel } from './user.model';

describe('FriendsController', () => {
  let userService = { findAll: () => ['test'] };

  const mockUser = { nickname: 'test', pwd: 'test', _id: 'test' };
  const mockClub = { name: 'Robotics', description: 'only for test purpose' };

  let controller: FriendsRequestsController;
  let spyModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendsRequestsController],
      providers: [
        UsersService,
        FriendRequestsService,
        {
          provide: getModelToken(User.name),
          useValue: UserModel,
        },
      ],
    }).compile();

    controller = module.get<FriendsRequestsController>(
      FriendsRequestsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
