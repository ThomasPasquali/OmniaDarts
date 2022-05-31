import {
  Controller,
  Delete,
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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { checkNull, throwHttpExc } from 'src/utils/utils';
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
    private readonly userService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':idFriend')
  @ApiOperation({ description: 'Create request to add a friend' })
  @ApiCreatedResponse({
    description: 'A new request friend has been created',
    type: User,
  })
  @HttpCode(HttpStatus.CREATED)
  async addFriend(@Req() req, @Param('idFriend') idFriend: string) {
    const currUser = await this.userService.findById(req.user._id);
    const friend: User = await this.userService.findById(idFriend);

    checkNull(friend, 'The friend does not exist');
    this.shouldBeFriend(currUser, friend, false);

    this.addRequest(friend, currUser, false);
    return this.addRequest(currUser, friend, true);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':idFriend')
  @ApiOperation({ description: 'Delete or reject a friend by id' })
  @ApiOkResponse({
    description: 'The user has been deleted',
    type: User,
  })
  @HttpCode(HttpStatus.OK)
  async deleteFriend(@Req() req, @Param('idFriend') idFriend: string) {
    const currUser: User = await this.userService.findById(req.user._id);
    const friend: User = await this.userService.findById(idFriend);
    checkNull(friend, 'The friend does not exist');
    this.shouldBeFriend(currUser, friend, true);

    this.deleteRequest(friend, currUser);
    return this.deleteRequest(currUser, friend);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':idFriend')
  @ApiOperation({ description: 'Accept a friend request' })
  @ApiOkResponse({
    description: 'A friend request has been accepted',
    type: FriendRequest,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  async acceptFriend(@Req() req, @Param('idFriend') idFriend: string) {
    const currUser: User = await this.userService.findById(req.user._id);
    const friend: User = await this.userService.findById(idFriend);
    checkNull(friend, 'The friend does not exist');
    this.shouldBeFriend(currUser, friend, true);

    this.acceptRequest(friend, currUser);
    return this.acceptRequest(currUser, friend);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({
    description:
      'Get the list of friendsRequests (pending and not) without the user sending the request',
  })
  @ApiOkResponse({
    description: 'The list of friend (pending and not)',
    type: [FriendRequest],
  })
  @HttpCode(HttpStatus.OK)
  async getRequests(@Req() req) {
    const user = await this.userService.findById(req.user._id);
    return user.friendRequests;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':nickname')
  @ApiOperation({
    description:
      "Get the list of users that contain the nickname inside their's",
  })
  @ApiOkResponse({
    description: "The list of users that contain the nickname inside their's",
    type: [User],
  })
  @HttpCode(HttpStatus.OK)
  async getByNickname(@Req() req, @Param('nickname') nickname: string) {
    let users = await this.userService.findAll();
    users = users.filter((u) => u._id.toString() != req.user._id.toString());
    return users.filter((u) =>
      u.nickname.toLowerCase().includes(nickname.toLowerCase()),
    );
  }

  private shouldBeFriend(
    currUser: User,
    friend: User,
    shouldBeFriend: boolean,
  ) {
    let isFriend = false;
    currUser.friendRequests.forEach((fr) => {
      if (fr.user._id.toString() == friend._id.toString()) isFriend = true;
    });
    if (isFriend != shouldBeFriend) {
      if (isFriend) throwHttpExc('Already a friend', HttpStatus.CONFLICT);
      else throwHttpExc('Not a friend yet', HttpStatus.CONFLICT);
    }
  }

  private shouldBePending(friendReq: FriendRequest, shouldBePending: boolean) {
    if (friendReq.pending != shouldBePending)
      if (friendReq.pending)
        throwHttpExc("The request shouldn't be pending", HttpStatus.CONFLICT);
      else throwHttpExc('The request should be pending', HttpStatus.CONFLICT);
  }

  private async addRequest(
    user1: User,
    user2: User,
    isSender: boolean,
  ): Promise<User> {
    const requestReceiver = {
      isSender: isSender,
      pending: true,
      user: user2,
    } as FriendRequest;
    const reqSender = await this.friendsService.createRequest(requestReceiver);
    user1.friendRequests.push(reqSender);
    return await this.userService.update(user1._id, user1);
  }

  private async deleteRequest(user1: User, user2: User): Promise<User> {
    // Find index request
    const indexReq: number = user1.friendRequests.findIndex((f) => {
      return f.user._id.toString() == user2._id.toString();
    });

    // Delete request
    await this.friendsService.deleteRequest(user1.friendRequests[indexReq]._id);

    // Delete rif request
    user1.friendRequests.splice(indexReq, 1);

    // Update user
    return await this.userService.update(user1._id, user1);
  }

  private async acceptRequest(
    user1: User,
    user2: User,
  ): Promise<FriendRequest> {
    // Find index request
    const indexReq: number = user1.friendRequests.findIndex((f) => {
      return f.user._id.toString() == user2._id.toString();
    });

    // Update request
    let req = user1.friendRequests[indexReq];
    this.shouldBePending(req, true);
    req.pending = false;
    return await this.friendsService.updateRequest(req._id, req);
  }
}
