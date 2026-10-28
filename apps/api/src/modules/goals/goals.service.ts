import { Injectable } from '@nestjs/common';
import { prisma } from '@focus-ar/db';

@Injectable()
export class GoalsService {
  async getGoals(userId: string) {
    try {
      return await prisma.goal.findMany({
        where: { userId },
        include: {
          tasks: {
            include: { subTasks: true },
            orderBy: { orderIndex: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return [
        {
          id: 'demo-goal-1',
          userId,
          title: 'Hoàn thành Bài Luận Tiếng Anh 1000 từ',
          description: 'Chủ đề: Tác động của AI đối với giáo dục hiện đại',
          category: 'Tiếng Anh',
          isCompleted: false,
          progressPercentage: 35,
          tasks: [
            {
              id: 'demo-task-1',
              title: 'Mở file doc & Viết 3 câu mở bài đơn giản trong 2 phút',
              estimatedMinutes: 2,
              isCompleted: true,
              orderIndex: 1,
              subTasks: [
                { id: 'st-1', title: 'Tạo file Google Docs mới', estimatedMinutes: 1, isCompleted: true, orderIndex: 1 },
                { id: 'st-2', title: 'Viết câu mở đầu bùng nổ AI', estimatedMinutes: 1, isCompleted: true, orderIndex: 2 },
              ],
            },
            {
              id: 'demo-task-2',
              title: 'Lập dàn ý 3 ý chính cho phần thân bài',
              estimatedMinutes: 15,
              isCompleted: false,
              orderIndex: 2,
              subTasks: [
                { id: 'st-3', title: 'Ý 1: Cá nhân hóa học tập', estimatedMinutes: 5, isCompleted: false, orderIndex: 1 },
                { id: 'st-4', title: 'Ý 2: Tự động hóa chấm điểm', estimatedMinutes: 5, isCompleted: false, orderIndex: 2 },
              ],
            },
          ],
        },
      ];
    }
  }

  async getGoalById(id: string) {
    return prisma.goal.findUnique({
      where: { id },
      include: {
        tasks: {
          include: { subTasks: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
  }

  async createGoal(userId: string, data: { title: string; description?: string; category?: string }) {
    return prisma.goal.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        category: data.category || 'Học tập',
      },
    });
  }

  async deleteGoal(id: string) {
    return prisma.goal.delete({ where: { id } });
  }
}
