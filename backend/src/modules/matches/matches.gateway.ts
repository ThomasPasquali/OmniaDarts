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

    matchesPlayers = {};

    async handleConnection(client: any): Promise<void> {
        await super.handleConnection(client);
        const matchID = client.handshake.query.matchID;
        if (matchID) {
            const room = MatchesGateway.getRoomID(matchID);
            const userID = client.user._id;

            if(!this.matchesPlayers[matchID]) this.matchesPlayers[matchID] = [];
            this.matchesPlayers[matchID].push(userID);

            for(const u of this.matchesPlayers[matchID]) {
                client.emit('player_joined', u);
                console.log("Emitting player_joined "+u);
            }

            client.join(room);
            this.server.to(room).emit('player_joined', userID);
        }
    }

    handleDisconnect(client) {
        super.handleDisconnect(client);

        const matchID = client.handshake.query.matchID;
        const userID = client.user._id;

        this.server.to(MatchesGateway.getRoomID(matchID)).emit('player_left', userID);
        this.matchesPlayers[matchID].splice(this.matchesPlayers[matchID].indexOf(userID), 1);

        console.log("Emitting player_left "+userID);
    }

    static getRoomID = id => 'lobby_' + id;

    async emitNewCompleteThrow(userID: string, matchID: string, newThrow: Throw): Promise<void> {
        console.log("Emitting complete throw", newThrow);
        this.server.to(MatchesGateway.getRoomID(matchID)).emit('new_complete_throw', { userID, newThrow });
    }

    async emitNewPartialThrow(userID: string, matchID: string, newThrow: Throw): Promise<void> {
        console.log("Emitting partial throw", newThrow);
        this.server.to(MatchesGateway.getRoomID(matchID)).emit('new_partial_throw', { userID, newThrow });
    }

    async emitLegWon(user: User, matchID: string, leg: Number, set: Number): Promise<void> {
        this.server.to(MatchesGateway.getRoomID(matchID)).emit('leg_won', { nickname: user.nickname, leg, set });
    }

    async emitMatchWon(user: User, matchID: string): Promise<void> {
        this.server.to(MatchesGateway.getRoomID(matchID)).emit('match_won', { nickname: user.nickname });
    }

}
