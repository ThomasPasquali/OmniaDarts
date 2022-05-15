import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { Club } from '../../schemas/club.schema';
import { ClubsModule } from './clubs.module';
import { ClubsService } from './clubs.service';

describe('ClubsService', () => {

  function mockClubModel(dto: any) {
    this.data = dto;
    this.save  = () => {
      return this.data;
  }};

  let service: ClubsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ClubsModule],
      providers: [ClubsService, ConfigService, {
        provide: getModelToken(Club.name),
        useValue: mockClubModel,
      }],
    }).compile();

    service = module.get<ClubsService>(ClubsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});

