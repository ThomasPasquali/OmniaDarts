import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { Club, ClubDocument } from '../../schemas/club.schema';

@Injectable()
export class ClubsService {
  constructor(@InjectModel(Club.name) private clubModel: Model<ClubDocument>,
              @InjectModel(User.name) private userModel: Model<ClubDocument>) {}

  async addClub(club: Club): Promise<Club> {
    const createdClub = new this.clubModel(club);
    return createdClub.save();
  }

  async findAll(): Promise<Club[]> {
    return this.clubModel.find().exec();
  }

  async getClubById(id : string): Promise<Club> {
    const club = this.clubModel.findById(id);
    return club;
  }

  async update(id, club: Club): Promise<Club> {
    return await this.clubModel
            .findByIdAndUpdate(id, club, {new: true})
            .populate('admin', '', this.userModel)
            .populate('players', '', this.userModel)
            .lean();
  }

}
