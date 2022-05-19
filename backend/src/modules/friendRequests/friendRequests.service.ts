import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FriendRequest,
  FriendRequestDocument,
} from '../../schemas/friendRequest.schema';
import { User } from '../../schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class FriendRequestsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    @InjectModel(FriendRequest.name)
    private readonly friendReqModel: Model<FriendRequestDocument>,
  ) {}

  async addFriend(currUser: User, idFriend: string): Promise<User> {
    const friend: User = await this.userService.findById(idFriend);

    const requestReceiver = {
      isSender: false,
      pending: true,
      user: currUser,
    } as FriendRequest;
    const req1 = await this.friendReqModel.create(requestReceiver);
    friend.friendRequests.push(req1);
    await this.userService.update(friend._id, friend);

    const requestSender = {
      isSender: true,
      pending: true,
      user: friend,
    } as FriendRequest;
    const req2 = await this.friendReqModel.create(requestSender);
    currUser.friendRequests.push(req2);
    const newCurrUser = await this.userService.update(currUser._id, currUser);

    return newCurrUser;
  }

  async deleteFriend(currUser: User, idFriend: String): Promise<User> {
    const friend: User = await this.userService.findById(idFriend);

    // Find request request 1
    const indexReq1: number = friend.friendRequests.findIndex((f) => {
      return f.user._id.toString() == currUser._id.toString();
    });
    // Find request request 2
    const indexReq2: number = currUser.friendRequests.findIndex((f) => {
      return f.user._id.toString() == friend._id.toString();
    });

    // Delete request 1
    await this.friendReqModel.deleteOne(friend.friendRequests[indexReq1]._id);
    // Delete request 2
    await this.friendReqModel.deleteOne(currUser.friendRequests[indexReq2]._id);

    // Delete rif 1
    friend.friendRequests.splice(indexReq1, 1);
    // Delete rif 2
    currUser.friendRequests.splice(indexReq2, 1);

    // Update friend
    await this.userService.update(friend._id, friend);
    // Update currUser
    return await this.userService.update(currUser._id, currUser);
  }

  async acceptRequest(
    currUser: User,
    idFriend: string,
  ): Promise<FriendRequest> {
    let friend: User = await this.userService.findById(idFriend);

    const index1 = friend.friendRequests.findIndex(
      (u) => u.user._id.toString() == currUser._id.toString(),
    );
    let reqFriend = friend.friendRequests[index1];
    reqFriend.pending = false;
    await this.update(reqFriend._id, reqFriend);

    const index2 = currUser.friendRequests.findIndex(
      (u) => u.user._id.toString() == friend._id.toString(),
    );
    let reqCurrUser = friend.friendRequests[index2];
    reqCurrUser.pending = false;
    return await this.update(reqCurrUser._id, reqCurrUser);
  }

  async findUsers(currUser: User, nickname: string): Promise<User[]> {
    let users = await this.userService.findAll();
    users = users.filter((u) => u._id.toString() != currUser._id.toString());
    return users.filter((u) =>
      u.nickname.toLowerCase().includes(nickname.toLowerCase()),
    );
  }
  async update(
    id: string,
    friendRequest: FriendRequest,
  ): Promise<FriendRequest> {
    return await this.friendReqModel
      .findOneAndUpdate({ _id: id }, friendRequest, { new: true })
      .populate('user')
      .lean();
  }
}
