import { Test, TestingModule } from '@nestjs/testing';
import { TournamentMatchesService } from './tournament-matches.service';

describe('TournamentMatchesService', () => {
  let service: TournamentMatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TournamentMatchesService],
    }).compile();

    service = module.get<TournamentMatchesService>(TournamentMatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
