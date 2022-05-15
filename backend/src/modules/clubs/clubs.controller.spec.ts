import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Club } from '../../schemas/club.schema';
import { ClubsController } from './clubs.controller';
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
      controllers: [ClubsController],
      providers: [ClubsService, {
        provide: getModelToken(Club.name),
        useValue: mockClubModel,
      }],
    }).compile();

    controller = module.get<ClubsController>(ClubsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
