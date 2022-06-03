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

describe('PostsController', () => {
  let controller: PostsController;

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
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
