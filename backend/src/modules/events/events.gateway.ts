import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import {EventsService} from './events.service';
import {Server} from "socket.io";
import {JwtService} from "@nestjs/jwt";
import {UsersService} from "../users/users.service";

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit{

  constructor(
    private readonly eventsService: EventsService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  private static servers: any = {};

  private static registerNamespaceServer(server): boolean {
    let namespace = server.name
    if(EventsGateway.servers[namespace]) return false;
    EventsGateway.servers[namespace] = server;
    return true;
  }

  @WebSocketServer()
  private server: Server;
  private clients=[];

  afterInit(server: any): any {
    EventsGateway.registerNamespaceServer(server);
  }

  async handleConnection(client: any) {
    this.clients.push(client);
    const payload = this.jwtService.decode(client.handshake.headers.authorization.split(' ')[1]);
    client.user = await this.usersService.findById(payload.sub)
    console.log(`IO: "${client.user.nickname}" connected to "${this.server['name']}"`);
  }

  handleDisconnect(client) {
    for (let i = 0; i < this.clients.length; i++)
      if (this.clients[i] === client) {
        this.clients.splice(i, 1);
        console.log(`IO: "${client.user.nickname}" disconnected from "${this.server['name']}"`);
        break;
      }
  }

  public broadcast(event:string, payload: any) {
    for (let c of this.clients)
      c.emit(event, payload);
  }
}
