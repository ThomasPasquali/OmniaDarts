import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
var os = require('os');
import { EventsGateway } from './events.gateway';
import { Socket } from 'net';
import { Chat } from '../../schemas/chat.schema';
import { TextMessage } from '../../classes/textMessage';
import { User } from '../../schemas/user.schema';
import console from 'console';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'videochats',
  cors: {
    origin: '*',
  },
})
export class VideoChatsGateway extends EventsGateway {
  private PREFIX_ROOM_CHAT = 'videochat_';

  async handleConnection(client: any): Promise<void> {
    await super.handleConnection(client);
    const videochatID = client.handshake.query.videochatID;
    //if (videochatID) {
    // console.log('Someone enter in a video chat');
    /*const chat: Chat = await this.chatService.findById(chatID);

      // TODO Remove to enable permissions
      //if (await this.checkPermissions(chats, client['user']._id)) {
      const roomName = this.PREFIX_ROOM_CHAT + chatID;
      client.join(roomName);
      console.log(client.user.nickname, 'is connecting to', roomName);

      this.server.to(roomName).emit('text_msg_room_new', chat.messages);*/
    //} else client.disconnect();
    //}
  }

  @SubscribeMessage('message')
  async newMessage(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    Logger.debug(body);
    const roomId = this.getRoomID(body);
    Logger.debug('Client said: ', roomId);

    this.server.to(roomId).emit('message', this.getMessage(body));
  }

  @SubscribeMessage('discover')
  async discoverOthersInTheRoom(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ): Promise<void> {
    const room = this.getRoomID(body);
    for (let other of this.clients[room]) {
      Logger.debug(other.handshake.address);
      if (other.id !== client.id)
        client.emit('discovered', other.handshake.address);
    }
  }

  @SubscribeMessage('create or join')
  async newPartecipant(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ): Promise<void> {
    const msg = JSON.parse(body);
    const room = msg.roomId;

    // Add client to the list
    this.clients[room] = this.clients[room] == null ? [] : this.clients[room];
    this.clients[room].push(client);

    Logger.debug(
      'Received request to join room ' +
        room +
        ' with ' +
        this.clients[room].length +
        ' people',
    );
    Logger.debug('Client ID ' + client.id + ' joined room ' + room);

    this.server.to(room).emit('join', room);
    client.join(room);
    client.emit('joined', room, client.id);
    this.server.to(room).emit('ready');
  }

  @SubscribeMessage('ipaddr')
  async newIpAddr(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ): Promise<void> {
    const room = this.getRoomID(body);

    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function (details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          Logger.debug('Sending ip: ' + details.address);
          client.to(room).emit('ipaddr', details.address);
        }
      });
    }
  }

  private getRoomID(body: any) {
    const msg = JSON.parse(body);
    return msg.roomId;
  }

  private getMessage(body: any) {
    const msg = JSON.parse(body);
    return msg.message;
  }
}
