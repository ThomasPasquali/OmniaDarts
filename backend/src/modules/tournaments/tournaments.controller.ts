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
import { TournamentPlayer } from 'src/classes/tournamentPlayer';
import { Match } from 'src/schemas/match.schema';
import { TournamentMatch } from 'src/schemas/tournamentMatch.schema';
import SimpleTournament from '../../classes/SimpleTournament';
import { Club } from '../../schemas/club.schema';
import { Tournament } from '../../schemas/tournaments.schema';
import { User } from '../../schemas/user.schema';
import { checkNull, shuffleArray } from '../../utils/utilFunctions';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClubsService } from '../clubs/clubs.service';
import { MatchesService } from '../matches/matches.service';
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
    private readonly matchService: MatchesService,
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
    const currUser: User = await this.usersService.findById(req.user._id);
    let tournament = {
      name: simpleTournament.name,
      randomOrder: simpleTournament.randomOrder,
      type: simpleTournament.type,
      gamemode: simpleTournament.gamemode,
      winningMode: simpleTournament.winningMode,
      players: [currUser],
      matches: [],
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
    let newTournament = await this.tournamentService.addTournament(tournament);
    // Tournament setup
    const tournamentWithMatches: Tournament = await this.setupTournament(
      newTournament,
    );
    tournamentWithMatches.name = 'BergoglioGay';
    console.log(tournamentWithMatches);
    const finalTournament = await this.tournamentService.updateTournament(
      tournamentWithMatches._id,
      tournamentWithMatches,
    );
    console.log(finalTournament);
    // Add references
    /* if (club != null) {
      club.tournaments.push(tournament);
      await this.clubService.update(club._id, club);
    }
    tournament.players.forEach(async (p) => {
      p.tournaments.push(tournament);
      await this.usersService.update(p._id, p);
    }); */

    return finalTournament;
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

  private async setupTournament(tournament: Tournament) {
    const players = [...tournament.players];

    let rounds = this.chooseNumberGroups(players.length);
    let numRounds = rounds[0] + rounds[1];
    let round = 1;
    if (tournament.randomOrder) shuffleArray(players);

    console.log('Setupping tournament');
    // First round
    let tournamentMatches = await this.generateMatches(
      tournament,
      rounds[0],
      rounds[1],
      round++,
      players,
    );
    // console.log(tournamentMatches);
    for (const m of tournamentMatches) {
      let match: TournamentMatch =
        await this.tournamentMatchesService.addTournamentMatch(m);
      // console.log(match);
      delete match['tournamentRef'];
      // tournament.matches.push(match);
      tournament.matches.push({
        _id: match._id,
      } as TournamentMatch);
    }
    // tournament.matches = tournamentMatches;
    // console.log(tournament);
    // console.log(tournament.matches);
    /* const newTournament = await this.tournamentService.update(
      tournament._id,
      tournament,
    ); */
    // Next rounds
    /* do {
      rounds = this.chooseNumberGroups(numRounds);
      console.log(rounds);
      numRounds = rounds[0] + rounds[1];
      this.generateRounds(tournament, rounds[0], rounds[1], round++);
    } while (numRounds > 1); */
    return tournament;
  }

  private chooseNumberGroups(numPlayers: number): [number, number] {
    let numPairs = 0;
    let numTriplets = 0;
    if (numPlayers % 3 == 0) {
      numTriplets = numPlayers / 3;
    } else if ((numPlayers + 1) % 3 == 0) {
      numPairs = 1;
      numTriplets = (numPlayers - 2) / 3;
    } else {
      numPairs = 2;
      numTriplets = (numPlayers - 4) / 3;
    }
    return [numPairs, numTriplets];
  }

  private async generateMatches(
    tournament: Tournament,
    numPairs: number,
    numTriplets: number,
    round: number,
    players: User[] = null,
  ) {
    let group = 1;
    let matches = [];
    for (let i = 0; i < numTriplets; i++) {
      const match = await this.createTournamentMatch(
        tournament,
        round,
        group++,
        3,
        players != null ? players.splice(0, 3) : null,
      );
      matches.push(match);
    }
    for (let i = 0; i < numPairs; i++) {
      const match = await this.createTournamentMatch(
        tournament,
        round,
        group++,
        2,
        players != null ? players.splice(0, 2) : null,
      );
      matches.push(match);
    }
    return matches;
  }
  private async createTournamentMatch(
    tournament: Tournament,
    round: number,
    group: number,
    numPlayers: number,
    players: User[] = null,
  ): Promise<TournamentMatch> {
    const results =
      players != null
        ? players.map((p) => {
            return {
              userId: p._id.toString(),
              result: 0,
            } as TournamentPlayer;
          })
        : null;

    const match = {
      dateTime: new Date(),
      players: players,
      done: false,
      results: results,
      // gamemode: tournament.gamemode,
      // winningMode: tournament.winningMode,
    } as Match;
    const newMatch: Match = await this.matchService.newMatch(match);

    const tournamentMatch = {
      tournamentRef: tournament,
      round: round,
      group: group,
      numPlayers: numPlayers,
      match: newMatch,
      nextTournamentMatch: null,
    } as TournamentMatch;
    return tournamentMatch;
  }
}
