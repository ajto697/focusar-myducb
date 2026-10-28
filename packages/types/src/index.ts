export type ProcrastinationStyle = 
  | 'TOO_DIFFICULT'    // Khó quá
  | 'TIRED'            // Mệt mỏi
  | 'FEAR_OF_FAILURE'  // Sợ sai / Sợ thất bại
  | 'NOT_KNOWING_HOW'  // Không biết bắt đầu từ đâu
  | 'RUSH_SEEKER';     // Thích cảm giác sát giờ mới làm

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  studyGoal?: string;
  dailyAvailableMinutes: number;
  procrastinationStyle: ProcrastinationStyle;
  distractorDomains: string[];
  createdAt: Date;
}

export interface GoalDTO {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category?: string;
  targetDate?: string;
  isCompleted: boolean;
  progressPercentage: number;
  tasksCount: number;
  createdAt: string;
}

export interface TaskDTO {
  id: string;
  goalId: string;
  title: string;
  estimatedMinutes: number;
  isCompleted: boolean;
  orderIndex: number;
  subTasks?: SubTaskDTO[];
}

export interface SubTaskDTO {
  id: string;
  taskId: string;
  title: string;
  estimatedMinutes: number;
  isCompleted: boolean;
  orderIndex: number;
}

export type SessionType = 'TWO_MINUTE' | 'POMODORO' | 'CUSTOM';
export type SessionStatus = 'INIT' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export interface FocusSessionDTO {
  id: string;
  userId: string;
  taskId?: string;
  sessionType: SessionType;
  durationSeconds: number;
  actualSeconds: number;
  status: SessionStatus;
  startedAt: string;
  endedAt?: string;
  extendedCount: number;
}

export interface TabEventPayload {
  userId: string;
  sessionId?: string;
  url: string;
  domain: string;
  title?: string;
  isDistractor: boolean;
  timestamp: string;
}

export interface PresenceEventPayload {
  userId: string;
  sessionId?: string;
  isPresent: boolean;
  lookingAway: boolean;
  phoneDetected: boolean;
  confidenceScore: number;
  timestamp: string;
}

export type InterventionReason = 
  | 'DISTRACTOR_TAB'
  | 'IDLE_TIMEOUT'
  | 'PHONE_DETECTED'
  | 'LOOKING_AWAY'
  | 'USER_STUCK';

export interface InterventionRequest {
  sessionId?: string;
  reason: InterventionReason;
  customNote?: string;
}

export interface InterventionResponse {
  id: string;
  reason: InterventionReason;
  coachMessage: string;
  suggestedAction: 'BREAK_DOWN_TASK' | 'TAKE_5_MIN_BREAK' | 'SWITCH_TASK' | 'MOTIVATION_QUOTE';
  microSteps?: string[];
}

export interface ARGuardianState {
  mascotMood: 'HAPPY' | 'FOCUSED' | 'WAVING' | 'DISAPPOINTED' | 'SLEEPY';
  treeGrowthLevel: number; // 0 to 100
  warningMessage?: string;
  isOverlayActive: boolean;
}

export interface StudyRoomDTO {
  id: string;
  name: string;
  description?: string;
  category: string;
  maxMembers: number;
  currentMembersCount: number;
  hostId: string;
  isPrivate: boolean;
}

export interface StudyRoomMemberDTO {
  roomId: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  currentTaskTitle?: string;
  status: 'FOCUSING' | 'IDLE' | 'ON_BREAK';
  joinedAt: string;
}

export interface DailyReportDTO {
  date: string;
  totalFocusMinutes: number;
  completedTasksCount: number;
  tabDistractionsCount: number;
  phoneDistractionsCount: number;
  aiReviewSummary: string;
  topDistractingDomains: { domain: string; count: number }[];
  streakDays: number;
  xpEarned: number;
}

export interface SocketEvents {
  'session:start': (session: FocusSessionDTO) => void;
  'session:tick': (payload: { elapsedSeconds: number; remainingSeconds: number }) => void;
  'session:extended': (session: FocusSessionDTO) => void;
  'session:ended': (session: FocusSessionDTO) => void;
  'event:tab_switched': (event: TabEventPayload) => void;
  'event:presence_updated': (event: PresenceEventPayload) => void;
  'ar:state_changed': (state: ARGuardianState) => void;
  'room:user_joined': (member: StudyRoomMemberDTO) => void;
  'room:user_left': (payload: { userId: string }) => void;
  'room:status_changed': (payload: { userId: string; status: string }) => void;
}
