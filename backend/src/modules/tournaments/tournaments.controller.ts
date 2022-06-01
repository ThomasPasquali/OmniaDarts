import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
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
import { checkNull } from 'src/utils/utils';
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
  @ApiOperation({
    description:
      'Create a new tournament given the id list of the OTHER players',
  })
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
    let club: Club;

    // Add club
    if (simpleTournament.idClub != null) {
      club = await this.clubService.getClubById(simpleTournament.idClub);
      checkNull(club, 'The club does not exist');
      this.checkIsAdminClub(club, currUser._id);
      this.checkPlayersClubComponents(club, simpleTournament.idPlayers);
      tournament.clubRef = club;
    } else tournament.clubRef = null;

    // Add players
    if (simpleTournament.idPlayers.includes(currUser._id.toString()))
      throw new ConflictException(
        'Do not insert the id of the user creating the tournament inside the list of players',
      );
    for (const idPlayer of simpleTournament.idPlayers) {
      const player: User = await this.usersService.findById(idPlayer);
      checkNull(player, 'One player id does not exist');
      tournament.players.push(player);
    }

    // Tournament setup
    // tournament = setupTournament(tournament);
    // Add references
    /* if (club != null) {
      club.tournaments.push(tournament);
      await this.clubService.update(club._id, club);
    }
    tournament.players.forEach(async (p) => {
      p.tournaments.push(tournament);
      await this.usersService.update(p._id, p);
    }); */

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

  private checkIsAdminClub(club: Club, idAdmin: string) {
    if (club.players.findIndex((u) => u._id == idAdmin && u.isAdmin) == -1)
      throw new BadRequestException('You are not the admin of the club');
  }

  private checkPlayersClubComponents(club: Club, idPlayers: string[]) {
    idPlayers.forEach((id) => {
      if (club.players.findIndex((u) => u._id == id) == -1)
        throw new BadRequestException(
          'One or more players are not part of the club',
        );
    });
  }
}
