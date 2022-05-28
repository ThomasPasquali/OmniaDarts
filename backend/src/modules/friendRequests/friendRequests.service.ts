import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FriendRequest,
  FriendRequestDocument,
} from '../../schemas/friendRequest.schema';
import { User } from '../../schemas/user.schema';
import { NotificationState } from '../../enums/notifications';
import { UsersService } from '../users/users.service';
import Notification from '../../classes/notification';

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectModel(FriendRequest.name)
    private readonly friendReqModel: Model<FriendRequestDocument>,
    private readonly userService: UsersService,
  ) {}

  async createRequest(req: FriendRequest): Promise<FriendRequest> {
    return await this.friendReqModel.create(req);
  }

  async deleteRequest(id: string): Promise<FriendRequest> {
    return await this.friendReqModel.findByIdAndDelete(id).exec();
  }

  async updateRequest(
    id: string,
    friendRequest: FriendRequest,
  ): Promise<FriendRequest> {
    return await this.friendReqModel
      .findOneAndUpdate({ _id: id }, friendRequest, { new: true })
      .populate('user')
      .lean();
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
            r.user,
            r,
          ),
        );
    }
    return notifications;
  }
}
