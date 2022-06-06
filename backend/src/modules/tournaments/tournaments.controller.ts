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
import { Match } from 'src/schemas/match.schema';
import { TournamentMatch } from 'src/schemas/tournamentMatch.schema';
import MatchResult from '../../classes/matchResult';
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
      players: [{ _id: currUser._id } as User],
      matches: [],
      creation_date: new Date(),
      finished: false,
      creator: { _id: currUser._id } as User,
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
      tournament.players.push({ _id: player._id } as User);
    }

    let newTournament = await this.tournamentService.addTournament(tournament);

    // Tournament setup
    const tournamentWithMatches: Tournament = await this.setupTournament(
      newTournament,
    );

    const finalTournament = await this.tournamentService.updateTournament(
      tournamentWithMatches._id,
      tournamentWithMatches,
    );
    // Add references
    if (club != null) {
      club.tournaments.push(tournament);
      await this.clubService.update(club._id, club);
    }
    for (const p of finalTournament.players) {
      const player = await this.usersService.findById(p._id);
      player.tournaments.push({ _id: finalTournament._id } as Tournament);
      await this.usersService.update(player._id, player);
    }

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

  @Get('tournamentMatch/:idMatch')
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

    // First round
    let tournamentMatches: TournamentMatch[] = await this.generateMatches(
      tournament,
      rounds[0],
      rounds[1],
      round++,
      players,
    );
    // Next rounds
    do {
      rounds = this.chooseNumberGroups(numRounds);
      numRounds = rounds[0] + rounds[1];
      tournamentMatches.push(
        ...(await this.generateMatches(
          tournament,
          rounds[0],
          rounds[1],
          round++,
        )),
      );
    } while (numRounds > 1);

    // Add matches to tournament
    let newMatches = [];
    for (const m of tournamentMatches) {
      let match: TournamentMatch =
        await this.tournamentMatchesService.addTournamentMatch(m);
      newMatches.push(match);
      tournament.matches.push({
        _id: match._id,
      } as TournamentMatch);
    }

    // Link matches
    this.linkMatches(newMatches, round);

    // Update matches
    for (const m of newMatches) {
      await this.tournamentMatchesService.update(m._id, m);
    }

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

  private async linkMatches(matches: TournamentMatch[], numRounds: number) {
    while (numRounds-- > 0) {
      let currMatches = matches.filter((m) => m.round == numRounds);
      let prevMatches = matches.filter((m) => m.round == numRounds - 1);
      currMatches.sort((a, b) =>
        a.group > b.group ? 1 : b.group > a.group ? -1 : 0,
      );
      prevMatches.sort((a, b) =>
        a.group > b.group ? 1 : b.group > a.group ? -1 : 0,
      );
      currMatches.forEach((m) => {
        let tmpMatches = prevMatches.splice(0, m.numPlayers);
        tmpMatches.forEach((t) => {
          t.nextTournamentMatch = { _id: m._id } as TournamentMatch;
          m.previousTournamentMatches.push({ _id: t._id } as TournamentMatch);
        });
      });
    }
  }

  private async generateMatches(
    tournament: Tournament,
    numPairs: number,
    numTriplets: number,
    round: number,
    players: User[] = null,
  ): Promise<TournamentMatch[]> {
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
              userID: p._id.toString(),
              score: 0,
            } as MatchResult;
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
      tournamentRef: { _id: tournament._id } as Tournament,
      round: round,
      group: group,
      numPlayers: numPlayers,
      match: newMatch,
      nextTournamentMatch: null,
      previousTournamentMatches: [],
    } as TournamentMatch;
    return tournamentMatch;
  }
}
