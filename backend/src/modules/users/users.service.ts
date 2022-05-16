import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club, ClubDocument } from '../../schemas/club.schema';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class UsersService {
  
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
              @InjectModel(Club.name) private clubModel: Model<ClubDocument>) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  async findByNickName(nickname : string): Promise<User> {
      return await this.userModel.findOne({nickname: nickname})
      .populate('club', '', this.clubModel)
      .lean();
  }

  async findAll(): Promise<User[]> {
      return await this.userModel.find()
      .populate('club', '', this.clubModel)
      .lean();
  }
  
  async findById(id): Promise<User> {
    return await this.userModel.findOne({ _id: id })
    .populate('club')
    .populate({ 
      path: 'club',
      populate: {
        path: 'admin',
        model: 'User'
      } 
    })
    .lean();
  }

  async update(id, user: User): Promise<User> {
    return await this.userModel
      .findOneAndUpdate({ _id: id }, user)
      .populate('club', '', this.clubModel)
      .lean();;
  }

  async findByGoogleToken(token : string): Promise<User> {
      return await this.userModel.findOne({googleToken : token})
      .populate('club', '', this.clubModel)
      .lean();;
  }

  async delete(id): Promise<any> {
    return await this.userModel.findByIdAndRemove(id);
  }

  async getByIdPopulating(id : string) : Promise<User>{
    return await this.userModel
      .findOne({ _id: id })
      .populate('club', '', this.clubModel)
      .lean();
  }

  async getFriends(id): Promise<User> {
    return await this.userModel
      .findOne({ _id: id })
      .populate('friends', '', this.userModel)
      .exec();
  }
}
