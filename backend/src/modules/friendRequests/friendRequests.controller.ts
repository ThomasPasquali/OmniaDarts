import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { FriendRequest } from '../../schemas/friendRequest.schema';
import { User } from '../../schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { FriendRequestsService } from './friendRequests.service';

@Controller('friends')
@ApiTags('friends')
export class FriendRequestsController {
  constructor(
    private readonly friendsService: FriendRequestsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id')
  @ApiOperation({ description: 'Create request to add a friend' })
  @ApiCreatedResponse({
    description: 'A new request friend has been created',
    type: User,
  })
  @HttpCode(HttpStatus.CREATED)
  async addFriend(@Req() req, @Param('id') id: string) {
    const currUser = await this.usersService.findById(req.user._id);
    const newUser = await this.friendsService.addFriend(currUser, id);
    // console.log(newUser);
    return newUser;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':idFriend')
  @ApiOperation({ description: 'Delete or reject a friend by id' })
  @ApiOkResponse({ type: User })
  @HttpCode(HttpStatus.OK)
  async deleteFriend(@Req() req, @Param('idFriend') idFriend: string) {
    return await this.friendsService.deleteFriend(req.user, idFriend);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':idFriend')
  @ApiOperation({ description: 'Accept a friend request' })
  @ApiOkResponse({ type: User })
  @HttpCode(HttpStatus.ACCEPTED)
  async acceptRequest(@Req() req, @Param('idFriend') idFriend: string) {
    return await this.friendsService.acceptRequest(req.user, idFriend);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ description: 'Get the list of friends' })
  @ApiOkResponse({ type: [FriendRequest] })
  @HttpCode(HttpStatus.OK)
  async fetchAll(@Req() req) {
    const friends = req.user.friends;
    return friends;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':nickname')
  @ApiOperation({
    description: 'Get the list of friends that contain the nickname',
  })
  @ApiOkResponse({ type: [User] })
  @HttpCode(HttpStatus.OK)
  async getByNickname(@Req() req, @Param('nickname') nickname: string) {
    return await this.friendsService.findUsers(req.user, nickname);
  }
}
