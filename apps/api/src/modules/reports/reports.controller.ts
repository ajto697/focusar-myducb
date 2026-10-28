import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily')
  async getDailyReport(@Query('date') date?: string) {
    const demoUser = await this.getDemoUserId();
    return this.reportsService.getDailyReport(demoUser, date);
  }

  @Get('weekly')
  async getWeeklySummary() {
    const demoUser = await this.getDemoUserId();
    return this.reportsService.getWeeklySummary(demoUser);
  }

  private async getDemoUserId(): Promise<string> {
    const { prisma } = await import('@focus-ar/db');
    const u = await prisma.user.findFirst({ where: { email: 'demo@focusar.app' } });
    return u?.id || 'demo-user-id';
  }
}
