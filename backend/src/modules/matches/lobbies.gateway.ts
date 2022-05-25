import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import {Req, UseGuards, UseInterceptors} from '@nestjs/common';
import { EventsGateway } from '../events/events.gateway';
import { Socket } from 'net';
import { Chat } from '../../schemas/chat.schema';
import { TextMessage } from '../../classes/textMessage';
import { User } from '../../schemas/user.schema';

@WebSocketGateway({
    namespace: 'lobbies',
    cors: {
        origin: '*',
    },
})
export class LobbyGateway extends EventsGateway {

    async handleConnection(client: any): Promise<void> {
        await super.handleConnection(client);
        const lobbyID = client.handshake.query.lobbyID;
        if(lobbyID) {
            client.join('lobby_'+lobbyID)
        }
    }

    @SubscribeMessage('lobby_request_new')
    async newNotification(
        @MessageBody() body: any,
        @ConnectedSocket() client: Socket,
    ): Promise<void> {
        /*const msg = client['body'];
        //const chat: Chat = await this.chatService.findById(msg.id);
        const message: TextMessage = new TextMessage();
        message.text = msg.text;
        message.user = { _id: client['user']._id } as User;
        message.dateTime = new Date().getTime();
        message.chatID = msg.chatID;
        //chat.messages.push(message);
        //await this.chatService.update(chat._id, chat);
        console.log(body)
        this.server.to('chat_'+body.data.chatID).emit('text_msg_room_new', message)*/
    }
}
