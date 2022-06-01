import { BadRequestException, Injectable, UseFilters } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(user: User): Promise<User> {
    try {
      return await this.userModel.create(user);
    } catch {
      throw new BadRequestException({
        title: 'User_id_already_present',
        description: 'The_user_id_is_already_present_please_insert_another_one',
        message: 'User id already present',
        payload: user,
      });
    }
  }
  @UseFilters(new HttpExceptionFilter())
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

  async findById(id: string): Promise<User> {
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      return await this.userModel
        .findOne({ _id: id })
        .populate('club')
        .populate('friendRequests')
        .populate({
          path: 'friendRequests',
          populate: {
            path: 'user',
            model: 'User',
          },
        })
        .lean();
    } else {
      throw new BadRequestException({
        title: 'Invalid_id',

        description: 'The_user_id_is_invalid_please_check_it',
        message: 'User with id [' + id + '] not found',
      });
    }
  }

  async update(id, user: User): Promise<User> {
    return await this.userModel
      .findOneAndUpdate({ _id: id }, user, { new: true })
      .populate('club')
      .populate('friendRequests')
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
