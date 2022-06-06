import { Controller } from '@nestjs/common';
import { TournamentMatchesService } from './tournament-matches.service';

@Controller('tournament-matches')
// @ApiTags('tournament-matches')
export class TournamentMatchesController {
  tournamentService: any;
  constructor(
    private readonly tournamentMatchesService: TournamentMatchesService,
  ) {}
}
