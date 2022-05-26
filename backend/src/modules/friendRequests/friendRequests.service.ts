import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FriendRequest,
  FriendRequestDocument,
} from '../../schemas/friendRequest.schema';

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectModel(FriendRequest.name)
    private readonly friendReqModel: Model<FriendRequestDocument>,
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
}
