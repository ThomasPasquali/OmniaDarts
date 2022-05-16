import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class FriendsService {
  constructor(private readonly userService: UsersService) {}

  async addFriend(currUser: User, idFriend: String): Promise<User> {
    currUser.friends.push(await this.userService.findById(idFriend));
    return await this.userService.update(currUser._id, currUser);
  }

  async findAll(currUser: User): Promise<User[]> {
    return (await this.userService.getFriends(currUser._id)).friends;
  }

  async deleteFriend(currUser: User, idFriend: String): Promise<User> {
    currUser.friends = currUser.friends.filter(
      (u) => u._id.toHexString() != idFriend,
    );
    return await this.userService.update(currUser._id, currUser);
  }

  async findByName(nameFriend: string): Promise<User[]> {
    const users = await this.userService.findAll();
    return users.filter((u) => u.nickname.includes(nameFriend));
  }
}
