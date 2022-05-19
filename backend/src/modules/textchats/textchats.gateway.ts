import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit
} from '@nestjs/websockets';
import Notification from "../../classes/notification";
import { Server } from 'socket.io';
import { Socket } from "net";
import { Req } from "@nestjs/common";
import { SocketIOBodyUnwrapper } from "../../utils/utils";
import SocketIOServer from "../../utils/socketio.server";

@WebSocketGateway({
    namespace: 'textchats',
    cors: {
        origin: '*',
    },
})
export class TextchatsGateway extends SocketIOServer {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('newMessage')
    async newNotification(@MessageBody() body: any): Promise<void> {
        console.log("New message", body);
        body.data.sender = 'Backend'

        setTimeout(_ => this.broadcast('newMessage', { chatID: 'dev', message: body.data }), 2000)
    }

}