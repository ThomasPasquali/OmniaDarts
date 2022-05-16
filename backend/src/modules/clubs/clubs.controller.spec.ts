import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { User } from '../../schemas/user.schema';
import { Club } from '../../schemas/club.schema';
import { CaslModule } from '../casl/casl.module';
import { UsersModule } from '../users/users.module';
import { ClubsController } from './clubs.controller';
import { ClubsModule } from './clubs.module';
import { ClubsService } from './clubs.service';

describe('ClubsController', () => {

  function mockClubModel(dto: any) {
    this.data = dto;
    this.save  = () => {
      return this.data;
  }};

  let controller: ClubsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CaslModule, UsersModule],
      controllers: [ClubsController],
      providers: [
        ClubsService, { provide: getModelToken(Club.name), useValue: mockClubModel },
        { provide: getModelToken(User.name), useValue: mockClubModel }],
    }).compile();

    controller = module.get<ClubsController>(ClubsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
