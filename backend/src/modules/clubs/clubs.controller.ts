import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param, Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { checkNotNull, checkNull, throwHttpExc } from 'src/utils/utils';
import ClubRequest from '../../classes/clubRequest';
import { Club } from '../../schemas/club.schema';
import { User } from '../../schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Action } from '../casl/actions';
import { AppAbility } from '../casl/casl-ability.factory';
import { CheckPolicies, PoliciesGuard } from '../casl/policies-guard.service';
import { UsersService } from '../users/users.service';
import { ClubsService } from './clubs.service';

@Controller('clubs')
@ApiTags('clubs')
export class ClubsController {
  constructor(
    private readonly clubsService: ClubsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('joinRequest')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Send request to join a club' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Club updated', type: Club })
  async sendRequest(
    @Req() req,
    @Query('message') message: string,
    @Query('idClub') idClub: string,
  ) {
    const clubRequest = new ClubRequest();
    clubRequest.message = message;

    const currUser = await this.usersService.findById(req.user._id);
    const clubToApply = await this.clubsService.getClubById(idClub);

    checkNull(clubToApply, 'Club not exits');

    clubRequest.club = {
      _id: clubToApply._id,
      name: clubToApply.name,
    } as Club;
    clubToApply.players.push({
      _id: currUser._id,
    } as User);

    currUser.clubRequest = clubRequest;
    console.log('hei');
    await this.usersService.update(
      currUser._id,
      JSON.parse(JSON.stringify(currUser)),
    );
    console.log('ciao');
    return await this.clubsService.update(clubToApply._id, clubToApply);
  }

  @Get('myClub')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get my club' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'My club', type: Club })
  async getMyClub(@Req() req): Promise<Club> {
    checkNull(req.user.club, "You don't belong to a club");
    const club = await this.clubsService.getClubById(req.user.club._id);
    checkNull(club, "You don't belong to a club");
    return club;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Create a club' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'A new club has been created',
    type: Club,
  })
  async addClub(@Body() club: Club, @Req() req) {
    checkNotNull(
      req.user.club,
      'You must exit your current club, before creating a new one',
    );
    const newClub: Club = await this.clubsService.addClub(club);
    const user: User = await this.usersService.findById(
      req.user._id.toString(),
    );
    user.isAdmin = true;
    newClub.players.push(user);
    const clubUpdated = await this.clubsService.update(newClub._id, newClub);
    user.club = clubUpdated;
    await this.usersService.update(user._id, user);
    return clubUpdated;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get all available clubs' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'All clubs', type: [Club] })
  async getAllClubsAvailable(
    @Req() req,
    @Param('query') query: string,
  ): Promise<Club[]> {
    const allClubs = await this.clubsService.findAll();
    allClubs.filter(
      (c) => c.name.includes(query) && c._id != req.user.club._id,
    );
    return allClubs;
  }

  /**
   * Club admin routes
   */

  @Post('players/:idPlayer')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.AddRemoveComponents, Club),
  )
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Add a user to a club' })
  @ApiCreatedResponse({
    description: 'A new player has just been added to a the club',
    type: Club,
  })
  async addUserToAClub(@Param('idPlayer') idPlayer: string, @Req() req) {
    const club: Club = await this.clubsService.getClubById(req.user.club._id);
    this.checkPlayerAlreadyPresent(
      club,
      idPlayer,
      'The player is already present',
    );
    const playerToAdd: User = await this.usersService.findById(idPlayer);
    club.players.push(playerToAdd);
    playerToAdd.club = club;
    await this.usersService.update(playerToAdd._id, playerToAdd);
    return await this.clubsService.update(club._id, club);
  }

  @Delete('players/:idPlayer')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.AddRemoveComponents, Club),
  )
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Remove a user from a club' })
  @ApiOkResponse({
    description: 'A player has just been removed from the club',
    type: Club,
  })
  async removeUserFromAClub(@Param('idPlayer') idPlayer: string, @Req() req) {
    const club: Club = await this.clubsService.getClubById(req.user.club._id);
    this.checkPlayerNotAlreadyPresent(
      club,
      idPlayer,
      'The player does not belong to you club',
    );
    const playerToRemove: User = await this.usersService.findById(idPlayer);
    playerToRemove.isAdmin = false;
    club.players = club.players.filter(
      (u) => u._id.toString() != playerToRemove._id.toString(),
    );
    playerToRemove.club = null;
    await this.usersService.update(playerToRemove._id, playerToRemove);
    return await this.clubsService.update(club._id, club);
  }

  @Post('adminPrivileges/:idPlayer')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.AddRemovePrivileges, Club),
  )
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Grant admin privileges' })
  @ApiCreatedResponse({
    description: 'Player whom privileges are changed',
    type: User,
  })
  async grantPrivileges(@Param('idPlayer') idPlayer: string, @Req() req) {
    const club: Club = await this.clubsService.getClubById(req.user.club._id);
    this.checkPlayerNotAlreadyPresent(
      club,
      idPlayer,
      'The player does not belong to you club',
    );
    const playerToAdd: User = await this.usersService.findById(idPlayer);
    playerToAdd.isAdmin = true;
    return await this.usersService.update(playerToAdd._id, playerToAdd);
  }

  @Delete('adminPrivileges/:idPlayer')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.AddRemovePrivileges, Club),
  )
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Revoke privileges to a user' })
  @ApiOkResponse({
    description: 'The privileges has been removed',
    type: String,
  })
  async revokePrivileges(@Param('idPlayer') idPlayer: string, @Req() req) {
    const club: Club = await this.clubsService.getClubById(req.user.club._id);
    this.checkPlayerNotAlreadyPresent(
      club,
      idPlayer,
      'The player does not belong to your club',
    );
    const playerToRemove: User = await this.usersService.findById(idPlayer);
    playerToRemove.isAdmin = false;
    await this.usersService.update(playerToRemove._id, playerToRemove);
    return playerToRemove._id;
  }

  @Delete('emergencyExit')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Delete the current club' })
  @ApiOkResponse({
    description: 'The club has been deleted',
    type: Club,
  })
  async exitFromMyOwnClub(@Req() req) {
    const club: Club = req.user.club;
    checkNull(club, "You don't belong to a club");
    const playerToRemove: User = await this.usersService.findById(req.user._id);
    playerToRemove.isAdmin = false;
    club.players = club.players.filter(
      (user) => user._id.toString() !== playerToRemove._id.toString(),
    );
    if (club.players.length == 0) await this.clubsService.delete(club._id);
    else await this.clubsService.update(club._id, club);
    playerToRemove.club = null;
    await this.usersService.update(playerToRemove._id, playerToRemove);
    return playerToRemove.id;
  }

  @Patch('joinRequest/:idPlayer')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.AcceptRejectRequests, Club),
  )
  @ApiOperation({ description: 'Accept join request send by {idPlayer}' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'id of the player if all went good',
    type: String,
  })
  async acceptJoin(@Req() req, @Param('idPlayer') idPlayer: string) {
    const sender = await this.usersService.findById(idPlayer);
    const club = await this.clubsService.getClubById(req.user.club._id);
    this.checkPlayerNotAlreadyPresent(
      club,
      idPlayer,
      'The player does not belong to your club',
    );
    sender.club = club;
    sender.clubRequest = null;
    await this.usersService.update(sender._id, sender);
    return sender._id;
  }

  @Delete('joinRequest/:idPlayer')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.AcceptRejectRequests, Club),
  )
  @ApiOperation({ description: 'Reject join request send by {idPlayer}' })
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'club updated', type: Club })
  async rejectJoin(@Req() req, @Param('idPlayer') idPlayer: string) {
    const club = await this.clubsService.getClubById(req.user.club._id);
    this.checkPlayerNotAlreadyPresent(
      club,
      idPlayer,
      'The player does not belong to your club',
    );
    const sender = await this.usersService.findById(idPlayer);
    sender.clubRequest = null;
    club.players = club.players.filter((p) => p._id != idPlayer);
    await this.usersService.update(sender._id, sender);
    return await this.clubsService.update(club._id, club);
  }

  private checkPlayerAlreadyPresent(
    club: Club,
    idPlayer: string,
    message: string,
  ) {
    if (club.players.findIndex((u) => u._id == idPlayer) != -1)
      throwHttpExc(message, HttpStatus.BAD_REQUEST);
  }

  private checkPlayerNotAlreadyPresent(
    club: Club,
    idPlayer: string,
    message: string,
  ) {
    if (club.players.findIndex((u) => u._id == idPlayer) == -1)
      throwHttpExc(message, HttpStatus.BAD_REQUEST);
  }
}

/**
 * palo palo si registra ok
 * "_id": "6283f287262b2e6a8a48ddfd",
 * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBhbG8iLCJzdWIiOiI2MjgzZjI4NzI2MmIyZTZhOGE0OGRkZmQiLCJpYXQiOjE2NTI4MTQ0NzEsImV4cCI6MTY1NDA0ODA3MX0.QvGJoYFs8HD86s5MAEp3hSc1ZwI60eQAgn8dA1W5lyk
 * sebe sebe si registra ok
 * "_id": "6283f29f262b2e6a8a48ddff",
 * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNlYmUiLCJzdWIiOiI2MjgzZjI5ZjI2MmIyZTZhOGE0OGRkZmYiLCJpYXQiOjE2NTI4MTQ0OTUsImV4cCI6MTY1NDA0ODA5NX0.KzkJKGPqEzn6PdZ9pZeZonACB8gEoSrUOYrXBmvYHiA
 *
 * palo palo crea il club Robotics ok
 *
 * sebe sebe chiede di entrare ok
 * palo palo vede la richiesta ok
 * palo palo accetta la richiesta ok
 * sebe sebe esce ok
 * palo palo lo rimette dentro ok
 * palo palo subito lo esclude ok
 */
