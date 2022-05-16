import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FriendsService } from './friends.service';

@Controller('friends')
@ApiTags('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id')
  @ApiOperation({ description: 'Add friend to current user' })
  @ApiCreatedResponse({
    description: 'A new friend has been created',
    type: User,
  })
  async addFriend(@Req() req, @Param('id') id: string, @Res() response) {
    const newUser = await this.friendsService.addFriend(req.user, id);
    return response.status(HttpStatus.CREATED).json(newUser);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ description: 'Get all friends of current user' })
  @ApiOkResponse({ type: [User] })
  async findAll(@Req() req, @Res() response) {
    console.log(req.user);
    const friends = await this.friendsService.findAll(req.user);
    return response.status(HttpStatus.OK).json(friends);
  }

  @Get(':nickname')
  @ApiOperation({
    description: 'Get all users that contains the nickname in some position',
  })
  @ApiOkResponse({ type: [User] })
  async findFriends(@Param('nickname') nickname: string, @Res() response) {
    const friends = await this.friendsService.findByName(nickname);
    return response.status(HttpStatus.OK).json(friends);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':idFriend')
  @ApiOperation({ description: 'Delete a friend by id' })
  @ApiOkResponse({ type: User })
  async delete(
    @Req() req,
    @Res() response,
    @Param('idFriend') idFriend: string,
  ) {
    const deletedFriend = await this.friendsService.deleteFriend(
      req.user,
      idFriend,
    );
    return response.status(HttpStatus.OK).json(deletedFriend);
  }
}
