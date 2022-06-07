import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Match, matchAddThrow } from '../../schemas/match.schema';
import { User } from '../../schemas/user.schema';
import Lobby from '../../classes/lobby';
import { UsersService } from '../users/users.service';
import { MatchesService } from './matches.service';
import { ChatsService } from '../chats/chats.service';
import { LobbiesService } from '../lobbies/lobbies.service';
import Throw from '../../classes/throw';
import PlayerThrows from '../../classes/playerThrows';

@Controller('matches')
@ApiTags('matches')
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly usersService: UsersService,
    private readonly chatService: ChatsService,
    private readonly lobbiesService: LobbiesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description:
      'Save new "offline" match (example: {"gamemode":{"name":"X01","settings":{"checkIn":"straight","checkOut":"double","startScore":40,"type":"X01"}},"playerThrows":{"-1":{},"0":{"0:0":[{"darts":[{"score":40,"doubleTriple":"D","sector":20},null,null]}],"1:0":[{"darts":[{"score":1,"doubleTriple":"","sector":1},{"score":9,"doubleTriple":"","sector":9},{"score":30,"doubleTriple":"D","sector":15}]}]}},"results":[{"score":0,"userID":"-1"},{"score":2,"userID":"0"},{"score":0,"userID":"-1"}],"winningMode":{"firstBest":"firstTo","goal":2,"setsLegs":"legs"}})',
  })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: ' Match created' })
  async newMatch(@Req() req, @Body() match: Match) {
    console.log(match);
    return await this.matchesService.newMatch(match);
  }

  @Post('lobby/new')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Create new online game lobby' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Lobby created' })
  async newLobby(@Req() req, @Body() match: Match) {
    const lobby = new Lobby(match.lobby);
    lobby.owner = req.user;
    const chat = await this.chatService.create(null, false, true);
    chat.playersIDs.push(req.user._id);
    await this.chatService.update(chat._id, chat);
    lobby.chatID = chat._id;

    match.lobby = lobby;
    match.players = [lobby.owner];
    match.playersThrows = {};
    match.playersThrows[lobby.owner._id] = new PlayerThrows(lobby.owner._id.toString());

    if (await this.matchesService.findUserActiveLobby(req.user))
      throw new BadRequestException(
        req.user,
        'User already has an active lobby',
      );

    await this.matchesService.newMatch(match);
  }

  @Post('lobby/joinRequest/:idMatch')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Submit join request for an active lobby' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Request created' })
  async newLobbyJoinRequest(@Req() req, @Param('idMatch') idMatch: string) {
    const match = await this.matchesService.findById(idMatch);
    const user = req.user;

    if (this.doesUserBelongToMatch(user, match))
      throw new BadRequestException(user, 'User already joined');
    if (this.hasUserJoinRequest(user, match))
      throw new BadRequestException(user, 'User already asked to join');

    match.lobby.joinRequests.push(req.user);
    await this.matchesService.updateMatchPlayersAndRequests(match);
    await this.lobbiesService.emitNewJoinRequest(user, match);
  }

  @Post('lobby/throw/:idMatch')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Submit throw' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Request created' })
  async newThrow(
    @Req() req,
    @Param('idMatch') idMatch: string,
    @Body() newThrow: Throw,
  ) {
    const match = await this.matchesService.findById(idMatch);
    const user = req.user;

    if (!this.doesUserBelongToMatch(user, match))
      throw new BadRequestException(user, 'User does not belong to the match');

    matchAddThrow(match, user, newThrow);
    await this.matchesService.updateMatchThrows(match);
    await this.matchesService.emitNewThrow(
      user._id.toString(),
      idMatch,
      newThrow,
    );
  }

  @Post('lobby/legWon/:idMatch')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Notify that user who sent this request has won the current match leg' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Ok' })
  async legWon(
      @Req() req,
      @Param('idMatch') idMatch: string,
      @Body() data,
  ) {
    //TODO db update
    //await this.matchesService.updateMatchThrows(match);
    const user = req.user;
    await this.matchesService.emitLegWon(
        user,
        idMatch,
        data.leg,
        data.set
    );
  }

  @Post('lobby/matchWon/:idMatch')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Notify that user who sent this request has won match' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Ok' })
  async matchWon(
      @Req() req,
      @Param('idMatch') idMatch: string,
  ) {
    //TODO db update
    //await this.matchesService.updateMatchThrows(match);
    const user = req.user;
    await this.matchesService.emitMatchWon(
        user,
        idMatch
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get all matches' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getAll(@Req() req) {
    return await this.matchesService.findAll();
  }

  @Get('lobbies')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get all active lobbies' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getAllActiveLobbies(@Req() req) {
    return await this.matchesService.findAllActiveLobbies();
  }

  @Get(':idMatch')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get a specific match' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getMatch(@Req() req, @Param('idMatch') matchID: string) {
    const match = await this.matchesService.findByIdFull(matchID);
    const user = req.user;

    // if (
    //   match &&
    //   ((match.lobby && match.lobby.isPublic) ||
    //     MatchesController.isUserLobbyOwner(user, match) ||
    //     this.doesUserBelongToMatch(user, match))
    // )
    return match;

    // if (this.hasUserJoinRequest(user, match))
    //   throw new ForbiddenException(user, 'User join request pending');
    // throw new ForbiddenException(user, 'User must send join request');
  }

  @Patch('lobby/joinRequest/:idUser')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Accept join request' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Request accepted' })
  @ApiBadRequestResponse({ description: 'Invalid request or id' })
  async acceptLobbyJoinRequest(@Req() req, @Param('idUser') idUser: string) {
    //TODO with Guards
    const match = await this.matchesService.findUserActiveLobby(req.user);

    if (!match)
      throw new BadRequestException(match, 'Player does not own a lobby');

    const reqI = this.getJoinRequestIndex(match, idUser);
    const userID = match.lobby.joinRequests[reqI]._id;
    match.lobby.joinRequests.splice(reqI, 1);
    match.players.push(await this.usersService.findById(idUser));
    await this.matchesService.updateMatchPlayersAndRequests(match);
    await this.lobbiesService.emitJoinRequestAccepted(userID, match);
  }

  @Delete('lobby/joinRequest/:idUser')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Reject join request' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Request rejected' })
  async rejectLobbyJoinRequest(@Req() req, @Param('idUser') idUser: string) {
    //TODO with Guards
    const match = await this.matchesService.findUserActiveLobby(req.user);

    if (!match)
      throw new BadRequestException(match, 'Player does not own a lobby');

    const reqI = this.getJoinRequestIndex(match, idUser);
    const userID = match.lobby.joinRequests[reqI]._id;
    match.lobby.joinRequests.splice(reqI, 1);
    await this.matchesService.updateMatchPlayersAndRequests(match);
    await this.lobbiesService.emitJoinRequestRejected(userID, match);
  }

  @Delete('lobby/player/:idUser')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Reject join request' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Request rejected' })
  async removeLobbyPlayer(@Req() req, @Param('idUser') idUser: string) {
    //TODO with Guards
    const match = await this.matchesService.findUserActiveLobby(req.user);

    if (!match)
      throw new BadRequestException(match, 'Player does not own a lobby');

    const playerIndex = this.getLobbyPlayerIndex(match, idUser);
    const userID = match.players[playerIndex]._id;
    match.players.splice(playerIndex, 1);
    await this.matchesService.updateMatchPlayersAndRequests(match);
    await this.lobbiesService.emitKick(userID, match);
  }

  @Delete(':idMatch')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Delete a specific match' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async deleteMatch(@Req() req, @Param('idMatch') matchID: string) {
    return await this.matchesService.deleteById(matchID);
  }

  private getLobbyPlayerIndex(match: Match, userID: string): number {
    const i = match.players.findIndex((u) => u._id.equals(userID));
    if (i < 0)
      throw new BadRequestException(userID, 'Player does not belong to match');
    return i;
  }

  private getJoinRequestIndex(match: Match, userID: string): number {
    if (!match.lobby)
      throw new BadRequestException(match, 'This match is not a lobby');

    const reqI = match.lobby.joinRequests.findIndex((u) =>
      u._id.equals(userID),
    );

    if (reqI < 0)
      throw new BadRequestException(userID, 'Request does not exist');

    return reqI;
  }

  private static isUserLobbyOwner(user: User, match: Match): boolean {
    return match.lobby && match.lobby.owner._id.equals(user._id);
  }

  private doesUserBelongToMatch(user: User, match: Match): boolean {
    return match.players.find((u) => (u._id || u).equals(user._id)) != null;
  }

  private hasUserJoinRequest(user: User, match: Match): boolean {
    return (
      match.lobby &&
      match.lobby.joinRequests.find((u) => (u._id || u).equals(user._id)) !=
        null
    );
  }
}
