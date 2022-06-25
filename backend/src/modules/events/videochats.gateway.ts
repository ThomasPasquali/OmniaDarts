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
import { Logger } from '@nestjs/common';
//const os = require('os');

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

  private log(...args: Object[]) {
    var array = ['Message from server:'];
    array.push.apply(array, args);
    this.broadcast('log', array);
  }

  @SubscribeMessage('message')
  async newMessage(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ): Promise<void> {
    var to = body['to'];
    this.log('from:' + client.id + ' to:' + to, body);
    this.server.to(to).emit('message', body);
  }

  @SubscribeMessage('create or join')
  async newPartecipant(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ): Promise<void> {
    const room = body;

    this.log('Received request to create or join room ' + room);

    const clientsInRoom = client.adapter['rooms'].get(room);
    console.log(clientsInRoom);
    const numClients = clientsInRoom ? clientsInRoom.size : 0;
    this.log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 0) {
      client.join(room);
      this.log('Client ID ' + client.id + ' created room ' + room);
      client.emit('created', room, client.id);
    } else {
      this.log('Client ID ' + client.id + ' joined room ' + room);
      this.server.to(room).emit('join', room, client.id);
      client.join(room);
      client.emit('joined', room, client.id);
      this.server.to(room).emit('ready');
    }
  }

  @SubscribeMessage('ipaddr')
  async newIpAddr(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ): Promise<void> {
    var ifaces = null; //os.networkInterfaces();
    for (var dev in ifaces) {
      ifaces[dev].forEach(function (details) {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          client.emit('ipaddr', details.address);
        }
      });
    }
  }

  @SubscribeMessage('bye')
  async bye(
    @MessageBody() body: any,
    @ConnectedSocket() client: any,
  ): Promise<void> {
    console.log('received bye from ' + client.id);
  }
}
