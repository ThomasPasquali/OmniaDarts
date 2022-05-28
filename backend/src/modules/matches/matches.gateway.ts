import {
    WebSocketGateway,
} from '@nestjs/websockets';
import {EventsGateway} from '../events/events.gateway'
import Throw from "../../classes/throw";

@WebSocketGateway({
    namespace: 'matches',
    cors: {
        origin: '*',
    },
})
export class MatchesGateway extends EventsGateway {

    async handleConnection(client: any): Promise<void> {
        await super.handleConnection(client);
        const matchID = client.handshake.query.matchID;
        if (matchID) {
            client.join(MatchesGateway.getRoomID(matchID))
            this.broadcast('player_joined', client.user)
        }
    }

    handleDisconnect(client) {
        super.handleDisconnect(client);
        this.broadcast('player_left', client.user)
    }

    static getRoomID = id => 'lobby_' + id;

    async emitNewThrow(userID: string, matchID: string, newThrow: Throw): Promise<void> {
        this.server.to(MatchesGateway.getRoomID(matchID)).emit('new_throw', { userID, newThrow });
    }

}
