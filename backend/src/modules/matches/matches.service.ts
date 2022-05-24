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
        return this.matchModel.find().exec();
    }
}
