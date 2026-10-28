import { Controller, Patch, Post, Param, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Patch(':id/toggle')
  async toggleTask(@Param('id') id: string) {
    return this.tasksService.toggleTaskCompletion(id);
  }

  @Patch('subtasks/:id/toggle')
  async toggleSubTask(@Param('id') id: string) {
    return this.tasksService.toggleSubTaskCompletion(id);
  }

  @Post(':id/subtasks')
  async addSubTask(
    @Param('id') taskId: string,
    @Body() body: { title: string; estimatedMinutes?: number }
  ) {
    return this.tasksService.addSubTask(taskId, body.title, body.estimatedMinutes);
  }
}
