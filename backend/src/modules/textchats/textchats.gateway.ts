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

@WebSocketGateway({
    namespace: 'textchats',
    cors: {
        origin: '*',
    },
})
export class TextchatsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server: Server;

    clients=[];

    afterInit(server: any): any { }

    handleConnection(client: any) {
        this.clients.push(client);
        console.log("New client");
    }

    handleDisconnect(client) {
        for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i] === client) {
                this.clients.splice(i, 1);
                console.log("Client left");
                break;
            }
        }
        //this.broadcast('disconnect',{});
    }

    private broadcast(event:string, payload: any) {
        for (let c of this.clients)
            c.emit(event, payload);
    }

    @SubscribeMessage('newMessage')
    newNotification(@MessageBody() body: any): void {
        console.log("New message", body);
        body.data.sender = 'Backend'
        setTimeout(_ => this.broadcast('newMessage', { chatID: 'dev', message: body.data }), 2000)
    }


}