// @ts-ignore
import OpenAI from 'openai';
import type * as Types from '@focus-ar/types';

export interface TaskBreakdownResult {
  goalTitle: string;
  tasks: Array<{
    title: string;
    estimatedMinutes: number;
    subTasks: Array<{
      title: string;
      estimatedMinutes: number;
    }>;
  }>;
}

export interface CoachAdviceResult {
  coachMessage: string;
  suggestedAction: 'BREAK_DOWN_TASK' | 'TAKE_5_MIN_BREAK' | 'SWITCH_TASK' | 'MOTIVATION_QUOTE';
  microSteps: string[];
}

export class FocusAIEngine {
  private openai: OpenAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey && !apiKey.includes('mock')) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  /**
   * AI Task Breakdown: Chia nhỏ mục tiêu lớn thành các bước 5-25 phút
   */
  async breakdownGoal(goalTitle: string, description?: string): Promise<TaskBreakdownResult> {
    if (!this.openai) {
      // Mock Fallback nếu không có OpenAI API Key hợp lệ
      return {
        goalTitle,
        tasks: [
          {
            title: `Bắt đầu bước 2 phút: Mở tài liệu & Viết 1 dòng về ${goalTitle}`,
            estimatedMinutes: 2,
            subTasks: [
              { title: 'Tạo file làm việc mới và viết tiêu đề', estimatedMinutes: 1 },
              { title: 'Liệt kê 2 ý tưởng chính đầu tiên', estimatedMinutes: 1 },
            ],
          },
          {
            title: `Chuẩn bị tài liệu & Dàn ý cho ${goalTitle}`,
            estimatedMinutes: 15,
            subTasks: [
              { title: 'Tìm kiếm 2 tài liệu tham khảo chính', estimatedMinutes: 7 },
              { title: 'Phác thảo các mục lớn cần hoàn thành', estimatedMinutes: 8 },
            ],
          },
          {
            title: `Thực hiện nội dung cốt lõi phần 1`,
            estimatedMinutes: 20,
            subTasks: [
              { title: 'Viết nháp nội dung ý tưởng thứ nhất', estimatedMinutes: 10 },
              { title: 'Rà soát và tinh chỉnh đoạn 1', estimatedMinutes: 10 },
            ],
          },
        ],
      };
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Bạn là Chuyên gia Tâm lý Học tập & Chống Trì Hoãn FocusAR. 
Nhiệm vụ của bạn là nhận một Mục Tiêu Lớn và chia nhỏ nó thành 2-4 Task cụ thể.
Đặc biệt: Task ĐẦU TIÊN phải áp dụng Quy Tắc 2 Phút (chỉ mất 2 phút, cực kỳ dễ thực hiện để giảm ma sát).
Các Task tiếp theo dài từ 10-25 phút.
Mỗi Task có 2-3 Subtask nhỏ hơn.
Trả về định dạng JSON thuần túy theo schema:
{
  "goalTitle": string,
  "tasks": [
    {
      "title": string,
      "estimatedMinutes": number,
      "subTasks": [
        { "title": string, "estimatedMinutes": number }
      ]
    }
  ]
}`,
          },
          {
            role: 'user',
            content: `Mục tiêu của tôi: "${goalTitle}". Mô tả thêm: "${description || 'Không có'}". Hãy giúp tôi chia nhỏ!`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return JSON.parse(content) as TaskBreakdownResult;
      }
    } catch (err) {
      console.warn('OpenAI API call failed, fallback to mock engine:', err);
    }

    return this.breakdownGoal(goalTitle, description);
  }

  /**
   * Procrastination Coach: Can thiệp khi người dùng gặp khó khăn / xao nhãng
   */
  async getCoachIntervention(
    reason: string,
    style: Types.ProcrastinationStyle = 'NOT_KNOWING_HOW',
    currentTaskTitle?: string
  ): Promise<CoachAdviceResult> {
    const defaultAdvice: Record<Types.ProcrastinationStyle, CoachAdviceResult> = {
      TOO_DIFFICULT: {
        coachMessage: 'Bài này có vẻ hơi rối đúng không? Đừng lo, mình không cần làm xong ngay đâu, chỉ cần nhìn vào 1 câu duy nhất thôi.',
        suggestedAction: 'BREAK_DOWN_TASK',
        microSteps: [
          'Đọc lại đề bài hoặc tiêu đề duy nhất 1 lần.',
          'Viết ra nháp 1 từ khóa duy nhất bạn hiểu.',
          'Hỏi AI hoặc bạn học bước tiếp theo.',
        ],
      },
      TIRED: {
        coachMessage: 'Cơ thể bạn đang báo hiệu cần nạp lại năng lượng đấy. Hãy hít thở sâu và vươn vai 5 phút nhé!',
        suggestedAction: 'TAKE_5_MIN_BREAK',
        microSteps: [
          'Rời mắt khỏi màn hình 1 phút.',
          'Uống 1 ngụm nước ấm.',
          'Hít vào 4 giây, giữ 4 giây, thở ra 6 giây.',
        ],
      },
      FEAR_OF_FAILURE: {
        coachMessage: 'Bản nháp đầu tiên luôn dở tệ, và điều đó hoàn toàn BÌNH THƯỜNG! Làm dở còn hơn không làm gì.',
        suggestedAction: 'MOTIVATION_QUOTE',
        microSteps: [
          'Gõ đại vài từ xuống trang giấy.',
          'Cho phép bản thân viết sai.',
          'Chỉ tập trung vào 2 phút hiện tại.',
        ],
      },
      NOT_KNOWING_HOW: {
        coachMessage: 'Khi không biết bắt đầu từ đâu, hãy làm việc DỄ NHẤT có thể: Mở tài liệu ra trước đã!',
        suggestedAction: 'BREAK_DOWN_TASK',
        microSteps: [
          'Mở tab hoặc cuốn sách cần học.',
          'Đọc 3 dòng đầu tiên.',
          'Viết 1 nốt nhỏ đánh dấu vị trí.',
        ],
      },
      RUSH_SEEKER: {
        coachMessage: 'Đừng đợi đến 11h đêm mới cuống cuồng! Dành 2 phút làm ngay bây giờ sẽ giúp bạn đỡ stress hơn nhiều.',
        suggestedAction: 'BREAK_DOWN_TASK',
        microSteps: [
          'Bật đồng hồ đếm ngược 2 phút.',
          'Làm nhanh 1 mục nhỏ.',
          'Tự thưởng cho mình sau 2 phút.',
        ],
      },
    };

    return defaultAdvice[style] || defaultAdvice.NOT_KNOWING_HOW;
  }
}
