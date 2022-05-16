import { Injectable } from '@nestjs/common';
import {
  Tournament,
  TournamentDocument,
} from '../../schemas/tournaments.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectModel(Tournament.name)
    private tournamentModel: Model<TournamentDocument>,
  ) {}

  async create(tournament: Tournament): Promise<Tournament> {
    const t = new this.tournamentModel(tournament);
    return t.save();
  }
}
