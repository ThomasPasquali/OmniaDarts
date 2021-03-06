import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { EventsGateway } from './events.gateway';
import { Socket } from 'net';
import { Chat } from '../../schemas/chat.schema';
import { TextMessage } from '../../classes/textMessage';
import { User } from '../../schemas/user.schema';

@WebSocketGateway({
  namespace: 'textchats',
  cors: {
    origin: '*',
  },
})
export class ChatsGateway extends EventsGateway {
  private PREFIX_ROOM_CHAT = 'chat_';

  async handleConnection(client: any): Promise<void> {
    await super.handleConnection(client);
    console.log(client.handshake.query);
    const chatID = client.handshake.query.matchID;
    if (chatID) {
      //const chat: Chat = await this.chatService.findById(chatID);

      // TODO Remove to enable permissions
      //if (await this.checkPermissions(chats, client['user']._id)) {
      const roomName = this.PREFIX_ROOM_CHAT + chatID;
      client.join(roomName);
      console.log(client.user.nickname, 'is connecting to', roomName);

      //this.server.to(roomName).emit('text_msg_room_new', chat.messages);
    } else client.disconnect();
    //}
  }

  @SubscribeMessage('text_msg_new')
  async newNotification(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ): Promise<void> {
    const msg = body;
    console.log(msg);
    console.log(client.handshake.query.chatID);
    const chatID = client.handshake.query.matchID;
    const chat: Chat = await this.chatService.findById(chatID);
    const message: TextMessage = JSON.parse(body);
    console.log(message.text);
    message.user = {
      _id: client['user']._id,
      nickname: client['user'].nickname,
      imageUrl: client['user'].imageUrl,
    } as User;
    message.dateTime = new Date().getTime();
    //message.chatID = chat._id;
    //chat.messages.push(message);
    //await this.chatService.update(chat._id, chat);
    console.log('Sending message to: ' + this.PREFIX_ROOM_CHAT + chatID);
    this.server
      .to(this.PREFIX_ROOM_CHAT + chatID)
      .emit('text_msg_room_new', [message]);
  }

  private async checkPermissions(chat: Chat, user: User): Promise<boolean> {
    if (chat.club != null)
      return (
        (await this.clubService.getClubById(chat.club._id)).players.findIndex(
          (u) => u._id == user._id,
        ) != -1
      );
    else return chat.playersIDs.findIndex((id) => id == user._id) != -1;
  }
}
