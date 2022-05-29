import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TournamentMatch } from '../../schemas/tournamentMatch.schema';
import { Tournament } from '../../schemas/tournaments.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TournamentMatchesService } from './tournament-matches.service';

@Controller('tournament-matches')
@ApiTags('tournament-matches')
export class TournamentMatchesController {
  tournamentService: any;
  constructor(
    private readonly tournamentMatchesService: TournamentMatchesService,
  ) {}

  @Post(':idTournament')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Create a tournament match' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'A new club has been created',
    type: TournamentMatch,
  })
  async create(
    @Body() tournamentMatch: TournamentMatch,
    @Param('idTournament') idTournament: string,
  ) {
    const newTournamentMatch =
      await this.tournamentMatchesService.addTournamentMatch(tournamentMatch);
    const tournament: Tournament = await this.tournamentService.findById(
      idTournament,
    );
    newTournamentMatch.tournamentRef = tournament;
    return newTournamentMatch;
  }
}
