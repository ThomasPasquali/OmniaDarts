import {
  Controller, Get,
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
import Lobby from '../../classes/lobby';
import {UsersService} from "../users/users.service";
import {MatchesService} from "./matches.service";
import {ChatsService} from "../chats/chats.service";

@Controller('matches')
@ApiTags('matches')
export class MatchesController {

  constructor(
      private readonly matchesService: MatchesService,
      private readonly usersService: UsersService,
      private readonly chatService: ChatsService,
  ) {}

  @Post('lobby/new')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Create new online game lobby' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Lobby created' })
  async newLobby(@Req() req) {
    const lobby = new Lobby();
    const match = {
      lobby
    } as Match
    lobby.owner = req.user;
    const chat = await this.chatService.create(
        null,
        false,
        true
    );
    chat.playersIDs.push(req.user._id);
    await this.chatService.update(chat._id, chat);
    lobby.chatID = chat._id;
    await this.matchesService.newMatch(match);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get all matches' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getAll(@Req() req) {
    return this.matchesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get all matches' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getMatch(@Req() req, @Param('id') matchID) {
    return await this.matchesService.find(matchID);
  }

}
