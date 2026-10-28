import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from './rooms.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly roomsService: RoomsService) {}

  handleConnection(client: Socket) {
    console.log(`[Socket.io] Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[Socket.io] Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('room:join')
  async handleJoinRoom(client: Socket, payload: { roomId: string; userId: string; displayName: string }) {
    client.join(payload.roomId);
    await this.roomsService.joinRoom(payload.roomId, payload.userId);

    this.server.to(payload.roomId).emit('room:user_joined', {
      roomId: payload.roomId,
      userId: payload.userId,
      displayName: payload.displayName,
      joinedAt: new Date().toISOString(),
    });
  }

  @SubscribeMessage('room:leave')
  async handleLeaveRoom(client: Socket, payload: { roomId: string; userId: string }) {
    client.leave(payload.roomId);
    await this.roomsService.leaveRoom(payload.roomId, payload.userId);

    this.server.to(payload.roomId).emit('room:user_left', {
      userId: payload.userId,
    });
  }

  @SubscribeMessage('event:tab_distraction')
  handleTabDistraction(client: Socket, payload: { roomId: string; userId: string; domain: string }) {
    this.server.to(payload.roomId).emit('ar:warning', {
      userId: payload.userId,
      message: `Người cùng học vừa mở ${payload.domain}. Nhắc nhở quay lại học nào!`,
    });
  }
}
