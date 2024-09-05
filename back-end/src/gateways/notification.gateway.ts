import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin:
      'http://share--publi-e28o0aiccghh-1447109741.ap-southeast-1.elb.amazonaws.com/',
  },
  namespace: '/',
  path: '/backend/socket.io',
})
@Injectable()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendVideoNotification(videoTitle: string, email: string) {
    this.server.emit('videoShared', {
      title: videoTitle,
      user: email,
    });
  }
}
