import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
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
import { Club } from '../../schemas/club.schema';
import ClubRequest from '../../classes/clubRequest';
import { Match } from '../../schemas/match.schema';
import Lobby from '../../classes/lobby';

@Controller('matches')
@ApiTags('matches')
export class MatchesController {

  @Post('lobby/new')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Create new online game lobby' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Lobby updated' })
  async newLobby(@Req() req, @Query('idUser') idUser: string) {
    const match = new Match();
    const lobby = new Lobby();

    match.lobby = lobby;

    /*const currUser = await this.usersService.findById(req.user._id);
        const clubToApply = await this.clubsService.getClubById(idClub);

        this.checkNull(clubToApply, 'Club not exits');

        clubRequest.club = clubToApply;
        clubToApply.players.push(currUser);

        currUser.clubRequest = clubRequest;
        await this.usersService.update(currUser._id, currUser);
        return await this.clubsService.update(clubToApply._id, clubToApply);*/
  }
}
