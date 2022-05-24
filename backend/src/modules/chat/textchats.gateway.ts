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
import {BodyGuard} from './body.guard';

@WebSocketGateway({
  namespace: 'textchats',

  cors: {
    origin: '*',
  },
})
export class TextchatsGateway extends EventsGateway {
  async handleConnection(client: any): Promise<void> {
    await super.handleConnection(client);
    //console.log(client)
  }

  @UseGuards(BodyGuard)
  @SubscribeMessage('newTextMessage')
  async newNotification(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const msg = client['body'];
    console.log();
    const chat: Chat = await this.chatService.findById(msg.id);

    const message: TextMessage = new TextMessage();
    message.text = msg.text;
    message.user = { _id: client['user']._id } as User;
    message.dateTime = new Date().getTime();
    chat.messages.push(message);
    await this.chatService.update(chat._id, chat);
    // TODO send broadcast
  }
}
