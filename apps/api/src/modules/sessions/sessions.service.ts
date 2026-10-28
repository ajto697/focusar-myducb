import { Injectable } from '@nestjs/common';
import { prisma } from '@focus-ar/db';
import { SessionType, SessionStatus } from '@focus-ar/types';

@Injectable()
export class SessionsService {
  async startSession(
    userId: string,
    data: { taskId?: string; sessionType?: SessionType; durationSeconds?: number }
  ) {
    const sessionType = data.sessionType || 'TWO_MINUTE';
    const durationSeconds = data.durationSeconds || (sessionType === 'TWO_MINUTE' ? 120 : 1500);

    return prisma.focusSession.create({
      data: {
        userId,
        taskId: data.taskId,
        sessionType,
        durationSeconds,
        status: 'RUNNING',
        startedAt: new Date(),
      },
    });
  }

  async extendSession(id: string, additionalSeconds: number = 600) {
    const session = await prisma.focusSession.findUnique({ where: { id } });
    if (!session) return null;

    return prisma.focusSession.update({
      where: { id },
      data: {
        durationSeconds: session.durationSeconds + additionalSeconds,
        extendedCount: session.extendedCount + 1,
        status: 'RUNNING',
      },
    });
  }

  async endSession(id: string, actualSeconds: number) {
    const session = await prisma.focusSession.findUnique({ where: { id } });
    if (!session) return null;

    const updated = await prisma.focusSession.update({
      where: { id },
      data: {
        actualSeconds,
        status: 'COMPLETED',
        endedAt: new Date(),
      },
    });

    // Award XP and update streak
    await prisma.xPLog.create({
      data: {
        userId: session.userId,
        amount: Math.round(actualSeconds / 60) * 5 + 20,
        reason: 'Hoàn thành phiên tập trung chống trì hoãn',
      },
    });

    return updated;
  }

  async getActiveSession(userId: string) {
    return prisma.focusSession.findFirst({
      where: { userId, status: 'RUNNING' },
      orderBy: { startedAt: 'desc' },
    });
  }
}
