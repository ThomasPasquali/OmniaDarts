import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import Notification from '../../classes/notification';
import { Socket } from 'net';
import { SocketIOBodyUnwrapper } from '../../utils/utils';
import { EventsGateway } from '../events/events.gateway';
import { NotificationState } from '../../enums/notifications';

@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway extends EventsGateway {
  async handleConnection(client: any): Promise<any> {
    await super.handleConnection(client);
    for (const provider of this.notificationsProviders)
      for (const c of this.clients)
        for (const n of await provider.getNotifications(c.user))
          c.emit('newNotification', n);
  }

  @SubscribeMessage('checkedNotification')
  checkNotification(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ): void {
    const n = new SocketIOBodyUnwrapper<Notification>(body).get();
    n.state = NotificationState.ACCEPTED;
    console.log('Notification check ', n);
    this.broadcast('newNotification', n);
  }
}
