import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import {Req} from "@nestjs/common";
import {EventsGateway} from "../events/events.gateway";
import {Socket} from "net";

@WebSocketGateway({
    namespace: 'textchats',
    cors: {
        origin: '*',
    },
})
export class TextchatsGateway extends EventsGateway {

    @SubscribeMessage('newTextMessage')
    async newNotification(@MessageBody() body: any, @ConnectedSocket() client: Socket): Promise<void> {
        const msg = body.data
        msg.sender = client['user'].nickname;
        msg.sent = true;
        //console.log(msg)
        setTimeout(_ => this.broadcast('newTextMessage', { chatID: 'dev', message: msg }), 2000);
    }

}