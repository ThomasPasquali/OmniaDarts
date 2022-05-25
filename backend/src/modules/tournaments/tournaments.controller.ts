import {
  Body,
  Controller,
  Delete,
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
import { Tournament } from '../../schemas/tournaments.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClubsService } from '../clubs/clubs.service';
import { UsersService } from '../users/users.service';
import { TournamentsService } from './tournaments.service';

@Controller('tournaments')
@ApiTags('tournaments')
export class TournamentsController {
  constructor(
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
    schema: {},
  })
  async addTournament(
    // @Body() randomOrder: boolean,
    // @Body() type: string,
    // @Body() gamemode: string,
    // @Body() winningMode: WinningMode,
    // @Body() idPlayers: [string],
    // @Body() name: string = '',
    // @Body() idClub: string = null,
    @Body() simpleTournament: SimpleTournament,
    @Req() req,
  ) {
    // Check if admin of a club -> Frontend

    let tournament = {
      name: simpleTournament.name,
      randomOrder: simpleTournament.randomOrder,
      type: simpleTournament.type,
      gamemode: simpleTournament.gamemode,
      winningMode: simpleTournament.winningMode,
    } as Tournament;

    // Add friends
    simpleTournament.idPlayers.forEach(async (idPlayer) => {
      const player: User = await this.usersService.findById(idPlayer);
      tournament.players.push(player);
    });
    tournament.players.push(await this.usersService.findById(req.user._id));

    // Add club
    if (simpleTournament.idClub != null) {
      const club: Club = await this.clubService.getClubById(
        simpleTournament.idClub,
      );
      tournament.clubRef = club;
    } else tournament.clubRef = null;

    tournament.timestamp = new Date();
    tournament.finished = false;

    // --- Tournament setup ---

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
    tournaments.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
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

  @Delete('idTournament')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Delete tournament by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The tournament has been deleted',
    type: Tournament,
  })
  async deleteTournament(@Param('idTournament') idTournament: string) {
    const tournament: Tournament = await this.tournamentService.getTournamentById(
      idTournament,
    );
    tournament.matches.forEach((m) => {
      await this.
    })
    return 
  }


}
