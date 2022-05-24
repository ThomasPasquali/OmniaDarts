import {
  Controller, Get,
  HttpCode,
  HttpStatus,
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

@Controller('matches')
@ApiTags('matches')
export class MatchesController {

  constructor(
      private readonly matchesService: MatchesService,
      private readonly usersService: UsersService,
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
    lobby.owner = req.user
    await this.matchesService.newMatch(match)
    /*const currUser = await this.usersService.findById(req.user._id);
        const clubToApply = await this.clubsService.getClubById(idClub);

        this.checkNull(clubToApply, 'Club not exits');

        clubRequest.club = clubToApply;
        clubToApply.players.push(currUser);

        currUser.clubRequest = clubRequest;
        await this.usersService.update(currUser._id, currUser);
        return await this.clubsService.update(clubToApply._id, clubToApply);*/
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get all matches' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getAll(@Req() req) {
    return this.matchesService.findAll();
  }

}
