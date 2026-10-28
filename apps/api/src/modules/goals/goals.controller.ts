import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  async getGoals() {
    // For MVP, fetch demo user goals
    const demoUser = await this.getDemoUserId();
    return this.goalsService.getGoals(demoUser);
  }

  @Get(':id')
  async getGoalById(@Param('id') id: string) {
    return this.goalsService.getGoalById(id);
  }

  @Post()
  async createGoal(@Body() body: { title: string; description?: string; category?: string }) {
    const demoUser = await this.getDemoUserId();
    return this.goalsService.createGoal(demoUser, body);
  }

  @Delete(':id')
  async deleteGoal(@Param('id') id: string) {
    return this.goalsService.deleteGoal(id);
  }

  private async getDemoUserId(): Promise<string> {
    return 'demo-user-id';
  }
}
