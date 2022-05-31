import { Test, TestingModule } from '@nestjs/testing';
import { TournamentMatchesController } from './tournament-matches.controller';
import { TournamentMatchesService } from './tournament-matches.service';

describe('TournamentMatchesController', () => {
  let controller: TournamentMatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TournamentMatchesController],
      providers: [TournamentMatchesService],
    }).compile();

    controller = module.get<TournamentMatchesController>(TournamentMatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
