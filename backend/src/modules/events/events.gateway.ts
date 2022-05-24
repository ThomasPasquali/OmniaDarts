import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ClubsService } from '../clubs/clubs.service';
import { NotificationsProvider } from '../../interfaces/notifications';
import { User } from '../../schemas/user.schema';
import {ChatService} from "../chat/chat.service";

@WebSocketGateway()
export class EventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  protected notificationsProviders: NotificationsProvider[];
  private static servers: any = {};

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    protected readonly clubService: ClubsService,
    protected readonly chatService: ChatService
  ) {
    this.notificationsProviders = [clubService];
  }

  private static registerNamespaceServer(server): boolean {
    const namespace = server.name;
    if (EventsGateway.servers[namespace]) return false;
    EventsGateway.servers[namespace] = server;
    return true;
  }

  @WebSocketServer()
  private server: Server;
  protected clients = [];

  afterInit(server: any): any {
    EventsGateway.registerNamespaceServer(this);
  }

  async handleConnection(client: any) {
    this.clients.push(client);
    const payload = this.jwtService.decode(
      client.handshake.headers.authorization.split(' ')[1],
    );
    client.user = await this.usersService.findById(payload.sub);
    console.log(
      `IO: "${client.user.nickname}" connected to "${this.server['name']}"`,
    );
  }

  handleDisconnect(client) {
    for (let i = 0; i < this.clients.length; i++)
      if (this.clients[i] === client) {
        this.clients.splice(i, 1);
        console.log(
          `IO: "${client.user.nickname}" disconnected from "${this.server['name']}"`,
        );
        break;
      }
  }

  public broadcast(event: string, payload: any) {
    for (const c of this.clients) c.emit(event, payload);
  }

  public broadcastTo(namespace: string, event: string, payload: any) {
    const server = EventsGateway.servers[namespace];
    if (server) for (const c of server.clients) c.emit(event, payload);
  }

  public sentToUser(user: User, event: string, payload: any) {
    for (const c of this.clients) if(c.user._id == user._id) c.emit(event, payload);
  }

  public sentToClub(clubID: string, event: string, payload: any) {
    for (const c of this.clients) if(c.user.club._id == clubID) c.emit(event, payload);
  }

  public sentToClubAdmins(clubID: string, event: string, payload: any) {
    for (const c of this.clients) if(c.user.club._id == clubID && c.user.isAdmin) c.emit(event, payload);
  }

}
