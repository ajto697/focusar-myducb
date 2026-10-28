import { Injectable } from '@nestjs/common';
import { prisma } from '@focus-ar/db';
import { TabEventPayload, PresenceEventPayload } from '@focus-ar/types';

@Injectable()
export class EventsService {
  async handleTabEvent(payload: TabEventPayload) {
    console.log('[EventsService] Received tab event:', payload.domain, 'Distractor:', payload.isDistractor);

    return prisma.tabEvent.create({
      data: {
        userId: payload.userId,
        sessionId: payload.sessionId,
        url: payload.url,
        domain: payload.domain,
        title: payload.title,
        isDistractor: payload.isDistractor,
        timestamp: new Date(payload.timestamp || Date.now()),
      },
    });
  }

  async handlePresenceEvent(payload: PresenceEventPayload) {
    return prisma.presenceEvent.create({
      data: {
        userId: payload.userId,
        sessionId: payload.sessionId,
        isPresent: payload.isPresent,
        lookingAway: payload.lookingAway,
        phoneDetected: payload.phoneDetected,
        confidenceScore: payload.confidenceScore,
        timestamp: new Date(payload.timestamp || Date.now()),
      },
    });
  }
}
