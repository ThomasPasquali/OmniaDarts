import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {Club, ClubDocument} from "../../schemas/club.schema";
import {Match} from "../../schemas/match.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {NotificationsProvider} from "../../interfaces/notifications";
import {User} from "../../schemas/user.schema";
import Notification from "../../classes/notification";
import {NotificationState} from "../../enums/notifications";
import Throw from "../../classes/throw";
import {MatchesGateway} from "./matches.gateway";

@Injectable()
export class MatchesService implements NotificationsProvider {

    constructor(
        @InjectModel(Match.name) private readonly matchModel: Model<Match>,
        @Inject(forwardRef(() => MatchesGateway))
        private readonly matchesGateway: MatchesGateway
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

    async findById(matchID): Promise<Match> {
        return this.matchModel.findById(matchID).lean();
    }

    async findByIdFull(matchID): Promise<Match> {
        return this.matchModel.findById(matchID).populate('players').lean();
    }

    async deleteById(matchID): Promise<Match> {
        return this.matchModel.findByIdAndDelete(matchID).lean();
    }

    async updateMatchPlayersAndRequests(match: Match): Promise<Match> {
        return this.matchModel.findByIdAndUpdate(
            match._id, {
                $set: {
                    players: match.players,
                    'lobby.joinRequests': match.lobby.joinRequests
                }
            });
    }

    async updateMatchThrows(match: Match): Promise<Match> {
        return this.matchModel.findByIdAndUpdate(
            match._id, {
                $set: { playersThrows: match.playersThrows }
            });
    }

    async emitNewThrow(userID: string, matchID: string, newThrow: Throw) {
        await this.matchesGateway.emitNewThrow(userID, matchID, newThrow);
    }

    async emitLegWon(user: User, matchID: string, leg: Number, set: Number) {
        await this.matchesGateway.emitLegWon(user, matchID, leg, set);
    }

    async emitMatchWon(user: User, matchID: string) {
        await this.matchesGateway.emitMatchWon(user, matchID);
    }

    async getNotifications(user: User): Promise<Notification[]> {
        const notifications: Notification[] = [];
        return notifications;
    }
}
