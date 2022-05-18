import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { Club, ClubDocument } from '../../schemas/club.schema';

@Injectable()
export class ClubsService {
  constructor(
    @InjectModel(Club.name) private clubModel: Model<ClubDocument>,
    @InjectModel(User.name) private userModel: Model<ClubDocument>,
  ) {}

  async addClub(club: Club): Promise<Club> {
    const createdClub = new this.clubModel(club);
    return createdClub.save();
  }

  async findAll(): Promise<Club[]> {
    return this.clubModel.find().exec();
  }

  async getClubById(id: string): Promise<Club> {
    return await this.clubModel.findById(id).populate('players').exec();
  }

  async update(id, club: Club): Promise<Club> {
    return await this.clubModel
      .findByIdAndUpdate(id, club, { new: true })
      .populate('players')
      .lean();
  }

  async delete(id): Promise<Club> {
    return await this.clubModel.findByIdAndDelete(id).exec();
  }
}
