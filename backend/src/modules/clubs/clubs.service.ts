import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club, ClubDocument } from 'src/schemas/club.schema';

@Injectable()
export class ClubsService {
  constructor(@InjectModel(Club.name) private clubModel: Model<ClubDocument>) {}

  async addClub(club: Club): Promise<Club> {
    const createdClub = new this.clubModel(club);
    return createdClub.save();
  }
}
