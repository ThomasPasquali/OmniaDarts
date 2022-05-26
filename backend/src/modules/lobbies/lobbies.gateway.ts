import {
    WebSocketGateway,
} from '@nestjs/websockets';
import {EventsGateway} from '../events/events.gateway'
import {User} from '../../schemas/user.schema';
import {Match} from "../../schemas/match.schema";

@WebSocketGateway({
    namespace: 'lobbies',
    cors: {
        origin: '*',
    },
})
export class LobbiesGateway extends EventsGateway {

    async handleConnection(client: any): Promise<void> {
        await super.handleConnection(client);
        const lobbyID = client.handshake.query.lobbyID;
        if (lobbyID) {
            client.join(LobbiesGateway.getRoomID(lobbyID))
            const match = await this.matchesService.findUserActiveLobby(client.user)
            if (match && match.lobby)
                for (const req of match.lobby.joinRequests)
                    client.emit('lobby_new_join_request', req)
        }
    }

    static getRoomID = id => 'lobby_' + id;

    async emitNewJoinRequest(user: User, match: Match): Promise<void> {
        this.sentToUser(match.lobby.owner, 'lobby_new_join_request', user)
    }

    async emitKick(userID: string, match: Match): Promise<void> {
        this.server.to(LobbiesGateway.getRoomID(match._id)).emit('lobby_kick', userID)
    }

    async emitJoinRequestAccepted(userID: string, match: Match): Promise<void> {
        this.server.to(LobbiesGateway.getRoomID(match._id)).emit('lobby_join_request_accepted', userID)
    }

    async emitJoinRequestRejected(userID: string, match: Match): Promise<void> {
        this.server.to(LobbiesGateway.getRoomID(match._id)).emit('lobby_join_request_rejected', userID)
    }

}
