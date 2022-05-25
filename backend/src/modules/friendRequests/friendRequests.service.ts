import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FriendRequest,
  FriendRequestDocument,
} from '../../schemas/friendRequest.schema';
import { User } from '../../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { NotificationsProvider } from '../../interfaces/notifications';
import Notification from '../../classes/notification';
import { NotificationState } from '../../enums/notifications';

@Injectable()
export class FriendRequestsService implements NotificationsProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    @InjectModel(FriendRequest.name)
    private readonly friendReqModel: Model<FriendRequestDocument>,
  ) {}

  async addFriend(currUser: User, idFriend: string): Promise<User> {
    const friend: User = await this.userService.findById(idFriend);
    this.checkFriendExist(friend);
    this.shouldBeFriend(currUser, friend, false);

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

  async deleteFriend(currUser: User, idFriend: string): Promise<User> {
    const friend: User = await this.userService.findById(idFriend);
    this.checkFriendExist(friend);
    this.shouldBeFriend(currUser, friend, true);

    // Find index request 1
    const indexReq1: number = friend.friendRequests.findIndex((f) => {
      return f.user._id.toString() == currUser._id.toString();
    });
    // Find index request 2
    const indexReq2: number = currUser.friendRequests.findIndex((f) => {
      return f.user._id.toString() == friend._id.toString();
    });

    // Delete request 1
    await this.friendReqModel.deleteOne(friend.friendRequests[indexReq1]._id);
    // Delete request 2
    await this.friendReqModel.deleteOne(currUser.friendRequests[indexReq2]._id);

    // Delete rif request 1
    friend.friendRequests.splice(indexReq1, 1);
    // Delete rif request 2
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
    const friend: User = await this.userService.findById(idFriend);
    this.checkFriendExist(friend);
    this.shouldBeFriend(currUser, friend, true);

    // Find index request 1
    const indexReq1: number = friend.friendRequests.findIndex((f) => {
      return f.user._id.toString() == currUser._id.toString();
    });
    // Find index request 2
    const indexReq2: number = currUser.friendRequests.findIndex((f) => {
      return f.user._id.toString() == friend._id.toString();
    });

    // Update request 1
    const reqFriend = friend.friendRequests[indexReq1];
    this.shouldBePending(reqFriend, true);
    reqFriend.pending = false;
    await this.update(reqFriend._id, reqFriend);

    // Update request 2
    const reqCurrUser = currUser.friendRequests[indexReq2];
    this.shouldBePending(reqCurrUser, true);
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

  private checkFriendExist(friend: User) {
    if (friend == null)
      this.throwHttpExc('The friend does not exist', HttpStatus.BAD_REQUEST);
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
      if (isFriend)
        this.throwHttpExc("It shouldn't be friend", HttpStatus.CONFLICT);
      else this.throwHttpExc('It shouldn be friend', HttpStatus.CONFLICT);
    }
  }

  private shouldBePending(friendReq: FriendRequest, shouldBePending: boolean) {
    if (friendReq.pending != shouldBePending)
      if (friendReq.pending)
        this.throwHttpExc(
          "The request shouldn't be pending",
          HttpStatus.CONFLICT,
        );
      else
        this.throwHttpExc('The request should be pending', HttpStatus.CONFLICT);
  }

  private throwHttpExc(message: string, code: HttpStatus) {
    throw new HttpException(
      {
        status: code,
        error: message,
      },
      code,
    );
  }

  async getNotifications(user: User): Promise<Notification[]> {
    const notifications: Notification[] = [];
    const u: User = await this.userService.findById(user._id);
    const requests = u.friendRequests;
    for (const r of requests) {
      if (r.pending == true && r.isSender == false)
        notifications.push(
          new Notification(
            'notification_friend_request',
            'notification_friend_request_message',
            NotificationState.NEW,
            null,
            r,
          ),
        );
    }
    return notifications;
  }
}
