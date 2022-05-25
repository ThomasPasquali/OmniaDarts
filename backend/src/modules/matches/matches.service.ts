import { Injectable } from '@nestjs/common';
import {Club, ClubDocument} from "../../schemas/club.schema";
import {Match} from "../../schemas/match.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {NotificationsProvider} from "../../interfaces/notifications";
import {User} from "../../schemas/user.schema";
import Notification from "../../classes/notification";
import {NotificationState} from "../../enums/notifications";

@Injectable()
export class MatchesService implements NotificationsProvider {

    constructor(
        @InjectModel(Match.name) private readonly matchModel: Model<Match>,
    ) {}

    async findUserActiveLobby(user: User) {
        const matches = await this.findAllActiveLobbies();
        const res = matches.filter(m => m.lobby.owner._id.equals(user._id));
        return res ? res[0] : null;
    }

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

    async updateMatchJoinRequests(match: Match): Promise<Match> {
        return this.matchModel.findByIdAndUpdate(
            match._id, {
                $set: { 'lobby.joinRequests': match.lobby.joinRequests }
            });
    }

    async getNotifications(user: User): Promise<Notification[]> {
        const notifications: Notification[] = [];
        return notifications;
    }
}
