import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { Club } from '../../schemas/club.schema';
import { User } from '../../schemas/user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  function mockUserModel(dto: any) {
    this.data = dto;
    this.save  = () => {
      return this.data;
    };
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        UsersService, { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Club.name), useValue: mockUserModel }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
