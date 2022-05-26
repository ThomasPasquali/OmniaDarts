import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import SimpleTournament from 'src/classes/SimpleTournament';
import { Club } from 'src/schemas/club.schema';
import { User } from 'src/schemas/user.schema';
import { Tournament } from '../../schemas/tournaments.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClubsService } from '../clubs/clubs.service';
import { TournamentMatchesService } from '../tournament-matches/tournament-matches.service';
import { UsersService } from '../users/users.service';
import { TournamentsService } from './tournaments.service';

@Controller('tournaments')
@ApiTags('tournaments')
export class TournamentsController {
  constructor(
    private readonly tournamentMatchesService: TournamentMatchesService,
    private readonly tournamentService: TournamentsService,
    private readonly usersService: UsersService,
    private readonly clubService: ClubsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create a new tournament' })
  @ApiCreatedResponse({
    description: 'A new tournament has been created',
    type: Tournament,
  })
  @ApiBadRequestResponse({ description: 'Invalid payload' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({
    description: 'Simple tournament',
    type: SimpleTournament,
  })
  async addTournament(@Body() simpleTournament: SimpleTournament, @Req() req) {
    // Check if admin of a club -> Frontend

    const currUser: User = await this.usersService.findById(req.user._id);

    let tournament = {
      name: simpleTournament.name,
      randomOrder: simpleTournament.randomOrder,
      type: simpleTournament.type,
      gamemode: simpleTournament.gamemode,
      winningMode: simpleTournament.winningMode,
      players: [currUser],
      creation_date: new Date(),
      finished: false,
      creator: currUser,
    } as Tournament;

    // Add friends
    simpleTournament.idPlayers.forEach(async (idPlayer) => {
      const player: User = await this.usersService.findById(idPlayer);
      tournament.players.push(player);
    });
    console.log(tournament.players);
    tournament.players.push();

    // Add club
    if (simpleTournament.idClub != null) {
      const club: Club = await this.clubService.getClubById(
        simpleTournament.idClub,
      );
      tournament.clubRef = club;
    } else tournament.clubRef = null;

    // --- Tournament setup ---
    // Test tournament match
    // const tournamentMatch = new TournamentMatch();
    // tournament.matches.push(
    //   await this.tournamentMatchesService.addTournamentMatch(tournamentMatch),
    // );

    return await this.tournamentService.addTournament(tournament);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Get all available tournaments (finished and not)',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The list of all tournaments (finished and not)',
    type: [Tournament],
  })
  async getAllTournamentsAvailable(): Promise<Tournament[]> {
    const tournaments = await this.tournamentService.findAll();
    tournaments.sort(
      (a, b) => a.creation_date.getTime() - b.creation_date.getTime(),
    );
    return tournaments;
  }

  @Get(':idTournament')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Get tournament by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The tournament selected',
    type: Tournament,
  })
  async getTournament(
    @Param('idTournament') idTournament: string,
  ): Promise<Tournament> {
    return await this.tournamentService.getTournamentById(idTournament);
  }

  private throwHttpExc(message: string, code) {
    throw new HttpException(
      {
        status: code,
        error: message,
      },
      code,
    );
  }
}
