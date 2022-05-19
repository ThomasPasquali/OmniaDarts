import {OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit} from "@nestjs/websockets";

export default class SocketIOServer implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

    private static servers: any = {};

    private static registerNamespaceServer(server): boolean {
        let namespace = server.name
        if(SocketIOServer.servers[namespace]) return false;
        SocketIOServer.servers[namespace] = server;
        return true;
    }

    private clients=[];

    afterInit(server: any): any {
        SocketIOServer.registerNamespaceServer(server);
    }

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

    public broadcast(event:string, payload: any) {
        for (let c of this.clients)
            c.emit(event, payload);
    }

}