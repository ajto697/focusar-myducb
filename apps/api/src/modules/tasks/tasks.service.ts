import { Injectable } from '@nestjs/common';
import { prisma } from '@focus-ar/db';

@Injectable()
export class TasksService {
  async toggleTaskCompletion(id: string) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return null;

    const updated = await prisma.task.update({
      where: { id },
      data: { isCompleted: !task.isCompleted },
    });

    // Check if goal percentage should update
    const allTasks = await prisma.task.findMany({ where: { goalId: task.goalId } });
    const completedCount = allTasks.filter((t: any) => t.isCompleted).length;
    const progressPercentage = Math.round((completedCount / allTasks.length) * 100);

    await prisma.goal.update({
      where: { id: task.goalId },
      data: { progressPercentage, isCompleted: progressPercentage === 100 },
    });

    return updated;
  }

  async toggleSubTaskCompletion(id: string) {
    const subTask = await prisma.subTask.findUnique({ where: { id } });
    if (!subTask) return null;

    return prisma.subTask.update({
      where: { id },
      data: { isCompleted: !subTask.isCompleted },
    });
  }

  async addSubTask(taskId: string, title: string, estimatedMinutes: number = 5) {
    return prisma.subTask.create({
      data: {
        taskId,
        title,
        estimatedMinutes,
      },
    });
  }
}
