import { forwardRef, Inject, Injectable } from '@nestjs/common';
import FriendRequest from '../../classes/friendsRequest';
import { User } from '../../schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class FriendsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async addFriend(currUser: User, idFriend: string): Promise<User> {
    const friend: User = await this.userService.findById(idFriend);

    let requestSender: FriendRequest = new FriendRequest();
    requestSender.isSender = true;
    requestSender.pending = true;
    requestSender.idUser = idFriend;
    currUser.friends.push(requestSender);

    let requestReceiver: FriendRequest = new FriendRequest();
    requestReceiver.isSender = false;
    requestReceiver.pending = true;
    requestReceiver.idUser = currUser._id;
    friend.friends.push(requestReceiver);

    await this.userService.update(friend._id, friend);

    return await this.userService.update(currUser._id, currUser);
  }

  async deleteFriend(currUser: User, idFriend: String): Promise<User> {
    const friend: User = await this.userService.findById(idFriend);
    friend.friends = friend.friends.filter((f) => {
      return f.idUser.toString() != currUser._id.toString();
    });

    await this.userService.update(friend._id, friend);
    currUser.friends = currUser.friends.filter((f) => {
      return f.idUser.toString() != friend._id.toString();
    });
    return await this.userService.update(currUser._id, currUser);
  }

  async acceptRequest(currUser: User, idFriend: string): Promise<User> {
    const friend: User = await this.userService.findById(idFriend);
    const index1 = friend.friends.findIndex(
      (u) => u.idUser.toString() == currUser._id.toString(),
    );
    currUser.friends[index1].pending = false;
    await this.userService.update(friend._id, friend);

    const index2 = currUser.friends.findIndex(
      (u) => u.idUser.toString() == friend._id.toString(),
    );
    friend.friends[index2].pending = false;
    return await this.userService.update(currUser._id, currUser);
  }

  async findUsers(currUser: User, nickname: string): Promise<User[]> {
    let users = await this.userService.findAll();
    users = users.filter((u) => u._id.toString() != currUser._id.toString());
    return users.filter((u) =>
      u.nickname.toLowerCase().includes(nickname.toLowerCase()),
    );
  }
}
