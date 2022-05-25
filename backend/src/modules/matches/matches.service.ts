import { Injectable } from '@nestjs/common';
import {Club, ClubDocument} from "../../schemas/club.schema";
import {Match} from "../../schemas/match.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

@Injectable()
export class MatchesService {

    constructor(
        @InjectModel(Match.name) private readonly matchModel: Model<Match>,
    ) {}

    async newMatch(match: Match): Promise<Match> {
        return new this.matchModel(match).save();
    }

    async findAll(): Promise<Match[]> {
        return this.matchModel.find().lean();
    }

    async findAllActiveLobbies(): Promise<Match[]> {
        const matches = await this.findAll();
        return matches.filter(m => !m.done && m.lobby != null)
    }

    async find(matchID): Promise<Match> {
        return this.matchModel.findById(matchID).lean();
    }

    async updateMatch(match: Match): Promise<Match> {
        return this.matchModel.findByIdAndUpdate(match).lean();
    }

}
