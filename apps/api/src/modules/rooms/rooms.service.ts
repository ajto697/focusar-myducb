import { Injectable } from '@nestjs/common';
import { prisma } from '@focus-ar/db';

@Injectable()
export class RoomsService {
  async getRooms() {
    return prisma.studyRoom.findMany({
      include: {
        host: { select: { id: true, profile: { select: { displayName: true, avatarUrl: true } } } },
        members: {
          include: {
            user: { select: { id: true, profile: { select: { displayName: true, avatarUrl: true } } } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRoomById(id: string) {
    return prisma.studyRoom.findUnique({
      where: { id },
      include: {
        host: { select: { id: true, profile: { select: { displayName: true, avatarUrl: true } } } },
        members: {
          include: {
            user: { select: { id: true, profile: { select: { displayName: true, avatarUrl: true } } } },
          },
        },
      },
    });
  }

  async createRoom(hostId: string, data: { name: string; description?: string; category?: string; maxMembers?: number }) {
    return prisma.studyRoom.create({
      data: {
        hostId,
        name: data.name,
        description: data.description,
        category: data.category || 'Chung',
        maxMembers: data.maxMembers || 8,
        members: {
          create: {
            userId: hostId,
            status: 'FOCUSING',
          },
        },
      },
    });
  }

  async joinRoom(roomId: string, userId: string) {
    return prisma.studyRoomMember.upsert({
      where: { roomId_userId: { roomId, userId } },
      update: { status: 'FOCUSING' },
      create: { roomId, userId, status: 'FOCUSING' },
    });
  }

  async leaveRoom(roomId: string, userId: string) {
    return prisma.studyRoomMember.deleteMany({
      where: { roomId, userId },
    });
  }
}
