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
import {NotificationAction, NotificationState} from '../../enums/notifications';

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
          c.emit('notification_new', n);
  }

  @SubscribeMessage('notification_update')
  updateNotification(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ): void {
    //console.log(body)
    //const n = new SocketIOBodyUnwrapper<Notification>(body).get();
    const n = body.data.notification;
    switch (body.data.action) {
      case NotificationAction.ACCEPT:
        n.state = NotificationState.ACCEPTED;
        break;
      case NotificationAction.REJECT:
        n.state = NotificationState.REJECTED;
        break;
    }

    //console.log('Notification check ', n);
    this.broadcast('notification_update', n);
  }
}
