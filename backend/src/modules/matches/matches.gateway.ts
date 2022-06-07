import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'net';
import {EventsGateway} from '../events/events.gateway'
import Throw from "../../classes/throw";
import {User} from "../../schemas/user.schema";

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
    
	/*@SubscribeMessage('new_throw')
	async newNotification(@MessageBody() body: any, @ConnectedSocket() client: Socket): Promise<void> {
		const msg = body.data;
		console.log(body);
	}*/

    async emitNewThrow(userID: string, matchID: string, newThrow: Throw): Promise<void> {
        this.server.to(MatchesGateway.getRoomID(matchID)).emit('new_throw', { userID, newThrow });
    }

    async emitLegWon(user: User, matchID: string, leg: Number, set: Number): Promise<void> {
        this.server.to(MatchesGateway.getRoomID(matchID)).emit('leg_won', { nickname: user.nickname, leg, set });
    }

    async emitMatchWon(user: User, matchID: string): Promise<void> {
        this.server.to(MatchesGateway.getRoomID(matchID)).emit('match_won', { nickname: user.nickname });
    }

}
