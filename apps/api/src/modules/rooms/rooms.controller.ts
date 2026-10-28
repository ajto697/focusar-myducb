import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  async getRooms() {
    return this.roomsService.getRooms();
  }

  @Get(':id')
  async getRoomById(@Param('id') id: string) {
    return this.roomsService.getRoomById(id);
  }

  @Post()
  async createRoom(@Body() body: { name: string; description?: string; category?: string; maxMembers?: number }) {
    const demoUser = await this.getDemoUserId();
    return this.roomsService.createRoom(demoUser, body);
  }

  private async getDemoUserId(): Promise<string> {
    const { prisma } = await import('@focus-ar/db');
    const u = await prisma.user.findFirst({ where: { email: 'demo@focusar.app' } });
    return u?.id || 'demo-user-id';
  }
}
