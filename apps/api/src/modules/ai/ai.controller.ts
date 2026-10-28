import { Controller, Post, Body } from '@nestjs/common';
import { AIService } from './ai.service';
import { ProcrastinationStyle } from '@focus-ar/types';

@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post('breakdown')
  async breakdown(@Body() body: { goalTitle: string; description?: string }) {
    return this.aiService.breakdownGoal(body.goalTitle, body.description);
  }

  @Post('coach')
  async getCoachAdvice(
    @Body() body: { reason: string; style?: ProcrastinationStyle; currentTaskTitle?: string }
  ) {
    return this.aiService.getCoachIntervention(body.reason, body.style, body.currentTaskTitle);
  }
}
