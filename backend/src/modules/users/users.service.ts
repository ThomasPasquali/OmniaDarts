import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.userModel.create(user);
    return createdUser;
  }

  async findByNickName(nickname: string): Promise<User> {
    return await this.userModel
      .findOne({ nickname: nickname })
      .populate('club')
      .lean();
  }

  async findAllWithSame(nickname: string): Promise<User[]> {
    return await this.userModel.find({ nickname: nickname }).lean();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().populate('club').lean();
  }

  async findById(id): Promise<User> {
    return await this.userModel
      .findOne({ _id: id })
      .populate('club')
      .populate({
        path: 'club',
        populate: {
          path: 'admin',
          model: 'User',
        },
      })
      .populate('friends')
      .populate({
        path: 'friends',
        populate: {
          path: 'user',
          model: 'User',
        },
      })
      .lean();
  }

  async update(id, user: User): Promise<User> {
    return await this.userModel
      .findOneAndUpdate({ _id: id }, user, { new: true })
      .populate('club')
      // .populate('friends')
      .lean();
  }

  async findByGoogleToken(token: string): Promise<User> {
    return await this.userModel
      .findOne({ googleToken: token })
      .populate('club')
      .lean();
  }

  async delete(id): Promise<any> {
    return await this.userModel.findByIdAndRemove(id);
  }

  async getByIdPopulating(id: string): Promise<User> {
    return await this.userModel.findOne({ _id: id }).populate('club').lean();
  }

  async getFriends(id): Promise<User> {
    return await this.userModel.findOne({ _id: id }).populate('friends').exec();
  }
}
