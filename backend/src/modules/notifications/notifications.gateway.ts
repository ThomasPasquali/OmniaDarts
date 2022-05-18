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
  namespace: 'notifications',
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  clients=[];

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

  @SubscribeMessage('new')
  newNotification(@ConnectedSocket() client: Socket, @Req() req): void {
    console.log("New notification", req.handshake.auth);
    this.broadcast('new', new Notification(Math.floor(Math.random()*100),'Backend test'))
  }

  @SubscribeMessage('checked')
  checkNotification(@MessageBody() body: any, @ConnectedSocket() client: Socket, @Req() req): void {
    let n = new SocketIOBodyUnwrapper<Notification>(body).get()
    n.state = 'checked';
    console.log("Notification check", n);
    this.broadcast('checked', n)
  }

  afterInit(server: any): any { }

}