import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Tournament,
  TournamentDocument,
} from '../../schemas/tournaments.schema';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectModel(Tournament.name)
    private tournamentModel: Model<TournamentDocument>,
  ) {}

  async addTournament(tournament: Tournament): Promise<Tournament> {
    const t = new this.tournamentModel(tournament);
    return t.save();
  }

  async findAll(): Promise<Tournament[]> {
    return this.tournamentModel.find().exec();
  }

  async getTournamentById(id: string): Promise<Tournament> {
    return await this.tournamentModel.findById(id).populate('players').lean();
  }

  async updateTournament(
    id: string,
    tournament: Tournament,
  ): Promise<Tournament> {
    return this.tournamentModel
      .findOneAndUpdate({ _id: id }, tournament, { new: true })
      .populate('players')
      .populate('matches')
      .populate('clubRef')
      .populate('creator')
      .lean();
  }

  async delete(id): Promise<Tournament> {
    return await this.tournamentModel.findByIdAndDelete(id).exec();
  }
}
