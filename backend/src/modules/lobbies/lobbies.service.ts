import {Injectable} from "@nestjs/common";
import {User} from "../../schemas/user.schema";
import {Match} from "../../schemas/match.schema";
import {LobbiesGateway} from "./lobbies.gateway";

@Injectable()
export class LobbiesService {
    constructor(
        private readonly lobbiesGateway: LobbiesGateway,
    ) {
    }

    async emitNewJoinRequest(user: User, match: Match) {
        if(user && match && match.lobby)
            await this.lobbiesGateway.emitNewJoinRequest(user, match)
    }
}