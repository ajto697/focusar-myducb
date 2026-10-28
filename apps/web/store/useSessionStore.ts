import { create } from 'zustand';

export interface MicroTask {
  id: number;
  title: string;
  duration: number; // in minutes
  completed?: boolean;
}

export interface InterventionOption {
  id: 'hard' | 'tired' | 'clueless' | 'tiktok';
  label: string;
  response: string;
  subAction?: string;
}

export const INTERVENTION_OPTIONS: Record<string, InterventionOption> = {
  hard: {
    id: 'hard',
    label: 'Bài khó quá',
    response: 'Thử chia nhỏ hơn nữa nhé. Chỉ cần làm đúng 1 câu duy nhất hoặc mở file ra trước đã!',
    subAction: 'Chia nhỏ task hơn nữa'
  },
  tired: {
    id: 'tired',
    label: 'Mệt rồi',
    response: 'Nghỉ ngơi 5 phút đi nào! Nhắm mắt thư giãn và tuyệt đối đừng cầm điện thoại nhé.',
    subAction: 'Nghỉ 5 phút'
  },
  clueless: {
    id: 'clueless',
    label: 'Không biết làm',
    response: 'Để tôi gợi ý cho bạn: Bắt đầu từ việc phác thảo 3 ý chính đơn giản nhất bằng bút chì.',
    subAction: 'Xem gợi ý dàn ý'
  },
  tiktok: {
    id: 'tiktok',
    label: 'Muốn lướt TikTok',
    response: 'Cố thêm đúng 2 phút nữa thôi! Sau đó bạn sẽ nhận được 5 phút giải trí hoàn toàn xứng đáng.',
    subAction: 'Bắt đầu đếm ngược 2 phút'
  }
};

interface SessionState {
  goalTitle: string;
  microTasks: MicroTask[];
  currentTaskIndex: number;
  secondsLeft: number;
  initialSeconds: number;
  isRunning: boolean;
  isSessionFinished: boolean;
  
  // Intervention state
  isInterventionOpen: boolean;
  activeInterventionKey: string | null;
  aiResponseBubble: string | null;

  // Actions
  setGoalAndTasks: (goalTitle: string, tasks: MicroTask[]) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  completeCurrentTask: () => void;
  setCurrentTaskIndex: (index: number) => void;
  
  // Intervention triggers
  openIntervention: (reasonKey?: string) => void;
  selectInterventionReason: (key: 'hard' | 'tired' | 'clueless' | 'tiktok') => void;
  closeIntervention: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  goalTitle: 'Viết bài luận về biến đổi khí hậu',
  microTasks: [
    { id: 1, title: 'Mở Google Docs và viết 1 câu mở bài', duration: 2, completed: false },
    { id: 2, title: 'Liệt kê 3 ý chính về nguyên nhân biến đổi khí hậu', duration: 5, completed: false },
    { id: 3, title: 'Tìm 1 nguồn tài liệu tham khảo chất lượng', duration: 10, completed: false }
  ],
  currentTaskIndex: 0,
  secondsLeft: 120, // 2 minutes focus session default
  initialSeconds: 120,
  isRunning: false,
  isSessionFinished: false,

  isInterventionOpen: false,
  activeInterventionKey: null,
  aiResponseBubble: null,

  setGoalAndTasks: (goalTitle, tasks) => {
    const firstTaskDuration = tasks.length > 0 ? Math.min(tasks[0].duration * 60, 120) : 120;
    set({
      goalTitle,
      microTasks: tasks,
      currentTaskIndex: 0,
      secondsLeft: firstTaskDuration,
      initialSeconds: firstTaskDuration,
      isRunning: false,
      isSessionFinished: false,
      isInterventionOpen: false,
      activeInterventionKey: null,
      aiResponseBubble: null
    });
  },

  startTimer: () => set({ isRunning: true }),
  
  pauseTimer: () => set({ isRunning: false }),

  resetTimer: () => {
    const { microTasks, currentTaskIndex } = get();
    const task = microTasks[currentTaskIndex];
    const duration = task ? Math.min(task.duration * 60, 120) : 120;
    set({
      secondsLeft: duration,
      initialSeconds: duration,
      isRunning: false
    });
  },

  tickTimer: () => {
    const { secondsLeft, isRunning } = get();
    if (!isRunning) return;

    if (secondsLeft > 1) {
      set({ secondsLeft: secondsLeft - 1 });
    } else {
      set({ secondsLeft: 0, isRunning: false });
      get().completeCurrentTask();
    }
  },

  completeCurrentTask: () => {
    const { microTasks, currentTaskIndex } = get();
    const updatedTasks = [...microTasks];
    if (updatedTasks[currentTaskIndex]) {
      updatedTasks[currentTaskIndex].completed = true;
    }

    const nextIndex = currentTaskIndex + 1;
    if (nextIndex < updatedTasks.length) {
      const nextDuration = Math.min(updatedTasks[nextIndex].duration * 60, 120);
      set({
        microTasks: updatedTasks,
        currentTaskIndex: nextIndex,
        secondsLeft: nextDuration,
        initialSeconds: nextDuration,
        isRunning: false
      });
    } else {
      set({
        microTasks: updatedTasks,
        isSessionFinished: true,
        isRunning: false
      });
    }
  },

  setCurrentTaskIndex: (index) => {
    const { microTasks } = get();
    if (index >= 0 && index < microTasks.length) {
      const taskDuration = Math.min(microTasks[index].duration * 60, 120);
      set({
        currentTaskIndex: index,
        secondsLeft: taskDuration,
        initialSeconds: taskDuration,
        isRunning: false
      });
    }
  },

  openIntervention: (reasonKey) => {
    set({
      isInterventionOpen: true,
      isRunning: false,
      activeInterventionKey: reasonKey || null,
      aiResponseBubble: reasonKey && INTERVENTION_OPTIONS[reasonKey] ? INTERVENTION_OPTIONS[reasonKey].response : null
    });
  },

  selectInterventionReason: (key) => {
    const option = INTERVENTION_OPTIONS[key];
    if (option) {
      set({
        activeInterventionKey: key,
        aiResponseBubble: option.response
      });
    }
  },

  closeIntervention: () => {
    set({
      isInterventionOpen: false,
      activeInterventionKey: null,
      aiResponseBubble: null
    });
  }
}));
