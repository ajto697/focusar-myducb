import { Controller, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import { TabEventPayload, PresenceEventPayload } from '@focus-ar/types';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('tab')
  async recordTabEvent(@Body() payload: TabEventPayload) {
    if (!payload.userId) {
      payload.userId = await this.getDemoUserId();
    }
    return this.eventsService.handleTabEvent(payload);
  }

  @Post('presence')
  async recordPresenceEvent(@Body() payload: PresenceEventPayload) {
    if (!payload.userId) {
      payload.userId = await this.getDemoUserId();
    }
    return this.eventsService.handlePresenceEvent(payload);
  }

  private async getDemoUserId(): Promise<string> {
    const { prisma } = await import('@focus-ar/db');
    const u = await prisma.user.findFirst({ where: { email: 'demo@focusar.app' } });
    return u?.id || 'demo-user-id';
  }
}
