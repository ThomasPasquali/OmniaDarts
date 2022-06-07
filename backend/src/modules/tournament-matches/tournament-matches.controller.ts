import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import ModResponse from 'src/classes/modResponse';
import { Match } from 'src/schemas/match.schema';
import { TournamentMatch } from 'src/schemas/tournamentMatch.schema';
import { User } from 'src/schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MatchesService } from '../matches/matches.service';
import { UsersService } from '../users/users.service';
import { TournamentMatchesService } from './tournament-matches.service';

@Controller('tournament-matches')
@ApiTags('tournament-matches')
export class TournamentMatchesController {
  tournamentService: any;
  constructor(
    private readonly tournamentMatchesService: TournamentMatchesService,
    private readonly matchService: MatchesService,
    private readonly userService: UsersService,
  ) {}
  @Get(':idMatch')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Get tournament match by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The tournament match selected',
    type: TournamentMatch,
  })
  @ApiResponse({ description: 'Error response structure', type: ModResponse })
  async getTournamentMatch(
    @Param('idMatch') idMatch: string,
  ): Promise<TournamentMatch> {
    return await this.tournamentMatchesService.getTournamentMatchById(idMatch);
  }

  @Patch(':idMatch')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Move winner player to next match/shout-out winner',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'id of the next match/shout-out winner message',
  })
  async moveWinner(@Param('idMatch') idMatch: string) {
    const currTournamentMatch: TournamentMatch =
      await this.tournamentMatchesService.getTournamentMatchById(idMatch);
    const match: Match = await this.matchService.findById(
      currTournamentMatch.match._id,
    );
    // if (!match.done) throw new ConflictException(match, 'Match has to be done');
    match.results.sort((a, b) =>
      a.score > b.score ? -1 : b.score > a.score ? -1 : 0,
    );
    const idWinner: string = match.results[0].userID.toString();
    const winner: User = await this.userService.getByIdPopulating(idWinner);
    const idNextTournamentMatch =
      currTournamentMatch.nextTournamentMatch._id.toString();
    if (idNextTournamentMatch == null)
      return 'The winner is user ' + winner.nickname;
    let nextTournamentMatch: TournamentMatch =
      await this.tournamentMatchesService.getTournamentMatchById(
        currTournamentMatch.nextTournamentMatch._id.toString(),
      );
    nextTournamentMatch.match.players.push(winner);
    nextTournamentMatch = await this.tournamentMatchesService.update(
      nextTournamentMatch._id,
      nextTournamentMatch,
    );
    return nextTournamentMatch._id;
  }
}
