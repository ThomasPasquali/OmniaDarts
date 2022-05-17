import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { use } from 'passport';
import { User } from 'src/schemas/user.schema';
import { Club } from '../../schemas/club.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Action } from '../casl/actions';
import { AppAbility } from '../casl/casl-ability.factory';
import { CheckPolicies, PoliciesGuard } from '../casl/policies-guard.service';
import { UsersService } from '../users/users.service';
import { ClubsService } from './clubs.service';

@Controller('clubs')
@ApiTags('clubs')
export class ClubsController {
  
  constructor(private readonly clubsService: ClubsService,
              private readonly usersService: UsersService) {}
  
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
    const newClub : Club = await this.clubsService.addClub(club);
    let user : User = await this.usersService.findById(req.user._id);
    newClub.admin.push(user as User);
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
  @ApiCreatedResponse({
    description: 'All clubs',
    type: Club,
  })
  async getAllClubsAvailable() : Promise<Club[]>{
    return await this.clubsService.findAll();
  }

  /**
   * Club admin routes
   */

  @Post('players/:idPlayer')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(
    (ability: AppAbility) => ability.can(Action.AddRemoveComponents, Club))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Add a user to a club' })
  @ApiCreatedResponse({
    description: 'A new player has just been added to a the club',
    type: Club,
  })
  async addUserToAClub(@Param('idPlayer') idPlayer : string,
                        @Req() req){
    let club : Club = await this.clubsService.getClubById(req.user.club._id);
    const playerToAdd : User = await this.usersService.findById(idPlayer);
    club.players.push(playerToAdd);
    playerToAdd.club = club;
    await this.usersService.update(playerToAdd._id, playerToAdd);
    return await this.clubsService.update(club._id, club);
  }

  @Delete('players/:idPlayer')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(
    (ability: AppAbility) => ability.can(Action.AddRemoveComponents, Club))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Remove a user from a club' })
  @ApiCreatedResponse({
    description: 'A player has just been removed from the club',
    type: Club,
  })
  async removeUserFromAClub(@Param('idPlayer') idPlayer : string,
                            @Req() req){
    let club : Club = await this.clubsService.getClubById(req.user.club._id);
    const playerToRemove : User = await this.usersService.findById(idPlayer);
    // Remove the player also from admin if it is one of them
    club.admin = club.admin.filter( user => user._id !== playerToRemove);
    club.players = club.players.filter( user => user._id !== playerToRemove);
    playerToRemove.club = null
    await this.usersService.update(playerToRemove._id, playerToRemove);
    return await this.clubsService.update(club._id, club);
  }

  @Post('adminPrivileges/:idPlayer')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(
    (ability: AppAbility) => ability.can(Action.AddRemoveComponents, Club))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Grab' })
  @ApiCreatedResponse({
    description: 'A new player has just been added to a the club',
    type: Club,
  })
  async grantPrivileges(@Param('idPlayer') idPlayer : string,
                        @Req() req){
    let club : Club = await this.clubsService.getClubById(req.user.club._id);
    const playerToAdd : User = await this.usersService.findById(idPlayer);
    club.admin.push(playerToAdd);
    return await this.clubsService.update(club._id, club);
  }

  @Delete('adminPrivileges/:idPlayer')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies(
    (ability: AppAbility) => ability.can(Action.AddRemoveComponents, Club))
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Revoke privileges to a user' })
  async revokePrivileges(@Param('idPlayer') idPlayer : string,
                           @Req() req){
    let club : Club = await this.clubsService.getClubById(req.user.club._id);
    const playerToRemove : User = await this.usersService.findById(idPlayer);
    club.admin = club.admin.filter( user => user._id !== playerToRemove._id);
    await this.clubsService.update(club._id, club);
    return playerToRemove.id;
  }

  @Delete('clubEmergencyExit')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ description: '' })
  async exitFromMyOwnClub(@Req() req){
    let club : Club = await this.clubsService.getClubById(req.user.club._id);
    const playerToRemove : User = 
        await this.usersService.findById(req.user._id);
    club.admin = club.admin
          .filter( user => user._id !== playerToRemove._id);
    club.players = club.players
          .filter(user => user._id !== playerToRemove._id);
    if(club.players.length == 0) await this.clubsService.delete(club._id);
    else await this.clubsService.update(club._id, club);
    playerToRemove.club = null;
    await this.usersService.update(playerToRemove._id, playerToRemove);
    return playerToRemove.id;
  }

}
