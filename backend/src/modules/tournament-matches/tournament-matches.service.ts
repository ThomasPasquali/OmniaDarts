import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TournamentMatch,
  TournamentMatchDocument,
} from '../../schemas/tournamentMatch.schema';

@Injectable()
export class TournamentMatchesService {
  constructor(
    @InjectModel(TournamentMatch.name)
    private readonly tournamentMatchModel: Model<TournamentMatchDocument>,
  ) {}

  async addTournamentMatch(
    tournamentMatch: TournamentMatch,
  ): Promise<TournamentMatch> {
    const createdTournamentMatch = new this.tournamentMatchModel(
      tournamentMatch,
    );
    return createdTournamentMatch.save();
  }

  async findAll(): Promise<TournamentMatch[]> {
    return this.tournamentMatchModel.find().exec();
  }

  async getTournamentMatchById(id: string): Promise<TournamentMatch> {
    return this.tournamentMatchModel
      .findById(id)
      .populate('tournamentRef')
      .lean();
  }

  async update(
    id: string,
    tournamentMatch: TournamentMatch,
  ): Promise<TournamentMatch> {
    return this.tournamentMatchModel
      .findByIdAndUpdate(id, tournamentMatch, { new: true })
      .populate('tournamentRef')
      .lean();
  }

  async delete(id: string): Promise<TournamentMatch> {
    return await this.tournamentMatchModel.findByIdAndDelete(id).exec();
  }
}
