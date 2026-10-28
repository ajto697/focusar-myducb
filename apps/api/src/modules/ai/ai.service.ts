import { Injectable } from '@nestjs/common';
import { FocusAIEngine } from '@focus-ar/ai';
import { ProcrastinationStyle } from '@focus-ar/types';

@Injectable()
export class AIService {
  private engine: FocusAIEngine;

  constructor() {
    this.engine = new FocusAIEngine(process.env.OPENAI_API_KEY);
  }

  async breakdownGoal(goalTitle: string, description?: string) {
    return this.engine.breakdownGoal(goalTitle, description);
  }

  async getCoachIntervention(reason: string, style?: ProcrastinationStyle, currentTaskTitle?: string) {
    return this.engine.getCoachIntervention(reason, style, currentTaskTitle);
  }
}
