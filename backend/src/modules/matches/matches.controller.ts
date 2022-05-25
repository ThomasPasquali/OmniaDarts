import {
  BadRequestException,
  Body,
  Controller, ForbiddenException, Get,
  HttpCode,
  HttpStatus, Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Match } from '../../schemas/match.schema';
import { User } from '../../schemas/user.schema';
import Lobby from '../../classes/lobby';
import {UsersService} from "../users/users.service";
import {MatchesService} from "./matches.service";
import {ChatService} from "../chat/chat.service";

@Controller('matches')
@ApiTags('matches')
export class MatchesController {

  constructor(
      private readonly matchesService: MatchesService,
      private readonly usersService: UsersService,
      private readonly chatService: ChatService,
  ) {}

  @Post('lobby/new')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Create new online game lobby' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Lobby created' })
  async newLobby(@Req() req, @Body() match: Match) {
    const lobby = new Lobby(match.lobby);
    lobby.owner = req.user;
    lobby.chatID = (await this.chatService.create())._id;

    match.lobby = lobby;

    //console.log(match)

    await this.matchesService.newMatch(match)
  }

  @Post('lobby/joinRequest/:idMatch')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Submit join request for an active lobby' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Request created' })
  async newLobbyJoinRequest(@Req() req, @Param('idMatch') idMatch: string) {
    const match = await this.matchesService.find(idMatch);
    const user = req.user;

    if(this.doesUserBelongToMatch(user, match))
      throw new BadRequestException(user, 'User already joined');
    if(this.hasUserJoinRequest(user, match))
      throw new BadRequestException(user, 'User asked to join');

    match.lobby.joinRequests.push(req.user);
    await this.matchesService.updateMatch(match)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get all matches' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getAll(@Req() req) {
    return this.matchesService.findAll();
  }

  @Get('lobbies')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get all active lobbies' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getAllActiveLobbies(@Req() req) {
    return this.matchesService.findAllActiveLobbies();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get all matches' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getMatch(@Req() req, @Param('id') matchID) {
    const match = await this.matchesService.find(matchID);
    const user = req.user;

    if((match.lobby && match.lobby.isPublic) || this.doesUserBelongToMatch(user, match))
      return match;

    if(this.hasUserJoinRequest(user, match))
      throw new ForbiddenException(user, 'User join request pending');

    throw new ForbiddenException(user, 'User must send join request');
  }

  doesUserBelongToMatch(user: User, match: Match): boolean {
    return match.players.find(u => u._id === user._id) != null
  }

  hasUserJoinRequest(user: User, match: Match): boolean {
    return match.lobby && match.lobby.joinRequests.find(u => u._id === user._id) != null
  }

}
