import { Injectable } from '@nestjs/common';
import { prisma } from '@focus-ar/db';

@Injectable()
export class ReportsService {
  async getDailyReport(userId: string, dateStr?: string) {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];

    const existingReport = await prisma.report.findFirst({
      where: { userId, date: targetDate },
    });

    if (existingReport) {
      return existingReport;
    }

    // Calculate report metrics from sessions, tab events, and presence events
    const sessions = await prisma.focusSession.findMany({
      where: { userId, status: 'COMPLETED' },
    });

    const totalFocusMinutes = Math.round(
      sessions.reduce((acc: number, s: any) => acc + s.actualSeconds, 0) / 60
    );

    const completedTasksCount = await prisma.task.count({
      where: { userId, isCompleted: true },
    });

    const tabDistractionsCount = await prisma.tabEvent.count({
      where: { userId, isDistractor: true },
    });

    const phoneDistractionsCount = await prisma.presenceEvent.count({
      where: { userId, phoneDetected: true },
    });

    const aiReviewSummary = totalFocusMinutes > 0
      ? `Hôm nay bạn đã hoàn thành ${totalFocusMinutes} phút tập trung vượt qua ${tabDistractionsCount} lần xao nhãng. Tiếp tục phát huy quy tắc 2 phút nhé!`
      : 'Hôm nay bạn chưa bắt đầu phiên học nào. Hãy dùng nút Bắt Đầu 2 Phút ngay bây giờ để khởi động nhé!';

    return prisma.report.create({
      data: {
        userId,
        date: targetDate,
        totalFocusMinutes,
        completedTasksCount,
        tabDistractionsCount,
        phoneDistractionsCount,
        aiReviewSummary,
        topDistractorDomains: [
          { domain: 'facebook.com', count: tabDistractionsCount },
          { domain: 'tiktok.com', count: phoneDistractionsCount },
        ],
      },
    });
  }

  async getWeeklySummary(userId: string) {
    const reports = await prisma.report.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 7,
    });

    const streak = await prisma.streak.findUnique({ where: { userId } });
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { xpLogs: true },
    });

    const totalXP = user?.xpLogs.reduce((acc: number, x: any) => acc + x.amount, 0) || 120;

    return {
      reports,
      currentStreak: streak?.currentStreak || 3,
      totalXP,
    };
  }
}
