import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {FriendRequest, FriendRequestDocument} from '../../schemas/friendRequest.schema';
import {User, UserDocument} from '../../schemas/user.schema';
import { UsersService } from '../users/users.service';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class FriendRequestsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    @InjectModel(FriendRequest.name) private readonly friendReqModel: Model<FriendRequestDocument>,
  ) {}

  async addFriend(currUser: User, idFriend: string): Promise<User> {
    const friend: User = await this.userService.findById(idFriend);

    const requestReceiver = {
      isSender: false,
      pending: true,
      user: currUser,
    } as FriendRequest;
    const req1 = await this.friendReqModel.create(requestReceiver);
    friend.friends.push(req1);
    await this.userService.update(friend._id, friend);

    const requestSender = {
      isSender: true,
      pending: true,
      user: friend,
    } as FriendRequest;
    const req2 = await this.friendReqModel.create(requestSender);
    currUser.friends.push(req2);
    const newCurrUser = await this.userService.update(currUser._id, currUser);

    console.log('ok2');
    return newCurrUser;
  }

  async deleteFriend(currUser: User, idFriend: String): Promise<User> {
    const friend: User = await this.userService.findById(idFriend);
    friend.friends = friend.friends.filter((f) => {
      return f.user != currUser;
    });

    await this.userService.update(friend._id, friend);
    currUser.friends = currUser.friends.filter((f) => {
      return f.user != friend;
    });
    return await this.userService.update(currUser._id, currUser);
  }

  async acceptRequest(currUser: User, idFriend: string): Promise<User> {
    const friend: User = await this.userService.findById(idFriend);
    const index1 = friend.friends.findIndex((u) => u.user == currUser);
    currUser.friends[index1].pending = false;
    await this.userService.update(friend._id, friend);

    const index2 = currUser.friends.findIndex((u) => u.user == friend);
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
