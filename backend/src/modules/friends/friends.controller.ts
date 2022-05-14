import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';
import { FriendsService } from './friends.service';

@Controller('friends')
@ApiTags('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post(':id')
  @ApiOperation({ description: 'Add friend to current user' })
  @ApiCreatedResponse({
    description: 'A new friend has been created',
    type: User,
  })
  async addFriend(@Param('id') id: string, @Res() response) {
    const newUser = await this.friendsService.addFriend(id);
    return response.status(HttpStatus.CREATED).json(newUser);
  }

  @Get()
  @ApiOperation({ description: 'Get all friends of current user' })
  @ApiOkResponse({ type: [User] })
  async findAll(@Res() response) {
    const friends = await this.friendsService.findAll();
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

  @Delete(':idFriend')
  @ApiOperation({ description: 'Delete a friend by id' })
  @ApiOkResponse({ type: User })
  async delete(@Res() response, @Param('idFriend') idFriend: string) {
    const deletedFriend = await this.friendsService.deleteFriend(idFriend);
    return response.status(HttpStatus.OK).json(deletedFriend);
  }
}
