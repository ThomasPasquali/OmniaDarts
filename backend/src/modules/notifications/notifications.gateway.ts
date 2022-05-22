import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
} from '@nestjs/websockets';
import Notification from '../../classes/notification';
import { Socket } from 'net';
import { Req } from '@nestjs/common';
import { SocketIOBodyUnwrapper } from '../../utils/utils';
import {EventsGateway} from "../events/events.gateway";

@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway extends EventsGateway {

  @SubscribeMessage('newNotification')
  newNotification(@ConnectedSocket() client: Socket, @Req() req): void {
    console.log('New notification', req.handshake.auth, client['culo']);
    this.broadcast(
      'new',
      new Notification(Math.floor(Math.random() * 100), 'Backend test'),
    );
  }

  @SubscribeMessage('checkedNotification')
  checkNotification(@MessageBody() body: any, @ConnectedSocket() client: Socket): void {
    const n = new SocketIOBodyUnwrapper<Notification>(body).get();
    n.state = 'checked';
    console.log('Notification check ', n);
    //this.broadcast('checked', n);
  }

}
