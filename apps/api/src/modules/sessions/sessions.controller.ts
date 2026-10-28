import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionType } from '@focus-ar/types';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('start')
  async startSession(
    @Body() body: { taskId?: string; sessionType?: SessionType; durationSeconds?: number }
  ) {
    const demoUser = await this.getDemoUserId();
    return this.sessionsService.startSession(demoUser, body);
  }

  @Patch(':id/extend')
  async extendSession(
    @Param('id') id: string,
    @Body() body: { additionalSeconds?: number }
  ) {
    return this.sessionsService.extendSession(id, body.additionalSeconds);
  }

  @Patch(':id/end')
  async endSession(
    @Param('id') id: string,
    @Body() body: { actualSeconds: number }
  ) {
    return this.sessionsService.endSession(id, body.actualSeconds);
  }

  @Get('active')
  async getActiveSession() {
    const demoUser = await this.getDemoUserId();
    return this.sessionsService.getActiveSession(demoUser);
  }

  private async getDemoUserId(): Promise<string> {
    const { prisma } = await import('@focus-ar/db');
    const u = await prisma.user.findFirst({ where: { email: 'demo@focusar.app' } });
    return u?.id || 'demo-user-id';
  }
}
