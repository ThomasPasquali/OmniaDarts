import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { User } from '../../schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

describe('FriendsController', () => {
  function mockUserModel(dto: any) {
    this.data = dto;
    this.save = () => {
      return this.data;
    };
  }

  let controller: FriendsController;
  let service: FriendsService;
  let userService: UsersService;
  jest.setTimeout(120000);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule],
      controllers: [FriendsController],
      providers: [
        FriendsService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    controller = module.get<FriendsController>(FriendsController);
    service = module.get<FriendsService>(FriendsService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /* describe('createANewFriend', () => {
    it('should create a new friend to the currrent user', async () => {
      const user = { nickname: 'test', _id: 'test', pwd: 'test' };
      const friend = { nickname: 'test1', _id: 'test1', pwd: 'test1' };
      const userWithFriend = user && { friends: [friend] };
      const req = { user: user };

      const returnUserWithFriend = async (u, id) => userWithFriend as User;

      jest.spyOn(service, 'addFriend').mockImplementation(returnUserWithFriend);

      const response = await controller.addFriend(req, friend._id);

      expect(response.friends).toStrictEqual([friend]);
    });
  }); */
});
