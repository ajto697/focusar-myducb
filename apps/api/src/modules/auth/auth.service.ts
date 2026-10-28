import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma } from '@focus-ar/db';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async loginDemoUser() {
    let user = await prisma.user.findUnique({
      where: { email: 'demo@focusar.app' },
      include: { profile: true, settings: true, streaks: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'demo@focusar.app',
          profile: {
            create: {
              displayName: 'Học Viên FocusAR Demo',
              studyGoal: 'Thắng Trì Hoãn 2 Phút',
              dailyAvailableMinutes: 60,
            },
          },
          settings: {
            create: { webcamEnabled: true, arOverlayEnabled: true },
          },
          streaks: {
            create: { currentStreak: 3, longestStreak: 7 },
          },
        },
        include: { profile: true, settings: true, streaks: true },
      });
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user,
    };
  }

  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return prisma.user.findUnique({
        where: { id: decoded.sub },
        include: { profile: true, settings: true },
      });
    } catch {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }
}
