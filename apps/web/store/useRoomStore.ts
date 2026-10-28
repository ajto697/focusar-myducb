import { create } from 'zustand';

export interface RoomMember {
  id: string;
  name: string;
  avatar: string; // Cute animal or avatar URL
  isCameraOn: boolean;
  focusStatus: 'FOCUS' | 'BREAK' | 'AWAY';
  isHost?: boolean;
}

export interface StudyRoom {
  id: string;
  name: string;
  category: 'Học thuật' | 'Lập trình' | 'Ngoại ngữ' | 'Chill';
  memberCount: number;
  maxMembers: number;
  status: 'FOCUS' | 'BREAK';
  members: RoomMember[];
  secondsLeft: number;
  initialSeconds: number;
  isTimerRunning: boolean;
}

export interface NudgeEffect {
  id: string;
  senderName: string;
  emoji: string;
  xOffset: number; // percentage across screen (10% to 90%)
}

const MOCK_INITIAL_ROOMS: StudyRoom[] = [
  {
    id: 'room-1',
    name: 'Phòng Luyện Đề Toán 12A1 📐',
    category: 'Học thuật',
    memberCount: 6,
    maxMembers: 12,
    status: 'FOCUS',
    secondsLeft: 1250, // 20 phút 50 giây còn lại
    initialSeconds: 1500, // 25 phút
    isTimerRunning: true,
    members: [
      { id: 'u1', name: 'Minh Anh (12A1)', avatar: '🦁', isCameraOn: true, focusStatus: 'FOCUS', isHost: true },
      { id: 'u2', name: 'Đức Huy (12A1)', avatar: '🦊', isCameraOn: true, focusStatus: 'FOCUS' },
      { id: 'u3', name: 'Thảo Nhi (12A1)', avatar: '🐼', isCameraOn: false, focusStatus: 'FOCUS' },
      { id: 'u4', name: 'Bảo Nam (12A1)', avatar: '🐰', isCameraOn: true, focusStatus: 'FOCUS' },
      { id: 'u5', name: 'Hoàng Yến (12A1)', avatar: '🐻', isCameraOn: false, focusStatus: 'AWAY' },
      { id: 'u6', name: 'Em (Bạn)', avatar: '🌱', isCameraOn: true, focusStatus: 'FOCUS' }
    ]
  },
  {
    id: 'room-2',
    name: 'Phòng Luyện Anh Văn 11B2 🌍',
    category: 'Ngoại ngữ',
    memberCount: 8,
    maxMembers: 12,
    status: 'FOCUS',
    secondsLeft: 840,
    initialSeconds: 1500,
    isTimerRunning: true,
    members: [
      { id: 'u10', name: 'Tuấn Anh (11B2)', avatar: '🚀', isCameraOn: true, focusStatus: 'FOCUS', isHost: true },
      { id: 'u11', name: 'Thành Long (11B2)', avatar: '⚡', isCameraOn: true, focusStatus: 'FOCUS' },
      { id: 'u12', name: 'Phương Thảo (11B2)', avatar: '🐱', isCameraOn: false, focusStatus: 'FOCUS' },
      { id: 'u13', name: 'Gia Bảo (11B2)', avatar: '🦊', isCameraOn: true, focusStatus: 'FOCUS' }
    ]
  },
  {
    id: 'room-3',
    name: 'Phòng KHTN: Lý - Hóa - Sinh 🧪',
    category: 'Học thuật',
    memberCount: 5,
    maxMembers: 10,
    status: 'BREAK',
    secondsLeft: 180, // 3 phút nghỉ còn lại
    initialSeconds: 300, // 5 phút nghỉ
    isTimerRunning: true,
    members: [
      { id: 'u20', name: 'Quỳnh Trang (12C3)', avatar: '🦄', isCameraOn: true, focusStatus: 'BREAK', isHost: true },
      { id: 'u21', name: 'Nhật Minh (10A1)', avatar: '🐨', isCameraOn: false, focusStatus: 'BREAK' }
    ]
  },
  {
    id: 'room-4',
    name: 'Phòng Đọc Sách & Viết Văn 📝',
    category: 'Chill',
    memberCount: 3,
    maxMembers: 8,
    status: 'FOCUS',
    secondsLeft: 1100,
    initialSeconds: 1500,
    isTimerRunning: false,
    members: [
      { id: 'u30', name: 'Ánh Dương (11B1)', avatar: '🌻', isCameraOn: true, focusStatus: 'FOCUS', isHost: true },
      { id: 'u31', name: 'Quang Việt (12C2)', avatar: '☕', isCameraOn: true, focusStatus: 'FOCUS' }
    ]
  }
];

interface RoomStoreState {
  rooms: StudyRoom[];
  currentRoom: StudyRoom | null;
  myCameraOn: boolean;
  nudges: NudgeEffect[];

  // Actions
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  toggleMyCamera: () => void;
  sendNudge: (senderName: string, emoji: string) => void;
  removeNudge: (id: string) => void;
  tickCurrentRoomTimer: () => void;
  toggleTimerRunning: () => void;
  resetTimer: (newDurationSeconds?: number) => void;
  createRoom: (name: string, category: 'Học thuật' | 'Lập trình' | 'Ngoại ngữ' | 'Chill', maxMembers: number) => void;
}

export const useRoomStore = create<RoomStoreState>((set, get) => ({
  rooms: MOCK_INITIAL_ROOMS,
  currentRoom: MOCK_INITIAL_ROOMS[0], // default room for easy dev preview
  myCameraOn: true,
  nudges: [],

  joinRoom: (roomId) => {
    const { rooms } = get();
    const targetRoom = rooms.find((r) => r.id === roomId) || rooms[0];
    set({ currentRoom: targetRoom });
  },

  leaveRoom: () => {
    set({ currentRoom: null });
  },

  toggleMyCamera: () => {
    const { myCameraOn, currentRoom } = get();
    const newCamState = !myCameraOn;
    
    if (currentRoom) {
      const updatedMembers = currentRoom.members.map((m) =>
        m.name.includes('Tôi') ? { ...m, isCameraOn: newCamState } : m
      );
      set({
        myCameraOn: newCamState,
        currentRoom: { ...currentRoom, members: updatedMembers }
      });
    } else {
      set({ myCameraOn: newCamState });
    }
  },

  sendNudge: (senderName, emoji) => {
    const newNudge: NudgeEffect = {
      id: Math.random().toString(36).substring(2, 9),
      senderName,
      emoji,
      xOffset: Math.floor(Math.random() * 70) + 15 // 15% to 85%
    };
    set((state) => ({ nudges: [...state.nudges, newNudge] }));
  },

  removeNudge: (id) => {
    set((state) => ({ nudges: state.nudges.filter((n) => n.id !== id) }));
  },

  tickCurrentRoomTimer: () => {
    const { currentRoom } = get();
    if (!currentRoom || !currentRoom.isTimerRunning) return;

    if (currentRoom.secondsLeft > 1) {
      set({
        currentRoom: {
          ...currentRoom,
          secondsLeft: currentRoom.secondsLeft - 1
        }
      });
    } else {
      // Swaps between FOCUS (25m) and BREAK (5m)
      const nextStatus = currentRoom.status === 'FOCUS' ? 'BREAK' : 'FOCUS';
      const nextDuration = nextStatus === 'FOCUS' ? 1500 : 300;
      set({
        currentRoom: {
          ...currentRoom,
          status: nextStatus,
          secondsLeft: nextDuration,
          initialSeconds: nextDuration,
          isTimerRunning: true
        }
      });
    }
  },

  toggleTimerRunning: () => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    set({
      currentRoom: {
        ...currentRoom,
        isTimerRunning: !currentRoom.isTimerRunning
      }
    });
  },

  resetTimer: (newDurationSeconds = 1500) => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    set({
      currentRoom: {
        ...currentRoom,
        secondsLeft: newDurationSeconds,
        initialSeconds: newDurationSeconds,
        isTimerRunning: false
      }
    });
  },

  createRoom: (name, category, maxMembers) => {
    const newRoom: StudyRoom = {
      id: `room-${Date.now()}`,
      name,
      category,
      memberCount: 1,
      maxMembers,
      status: 'FOCUS',
      secondsLeft: 1500,
      initialSeconds: 1500,
      isTimerRunning: false,
      members: [
        { id: 'me', name: 'Bạn (Chủ phòng)', avatar: '🌟', isCameraOn: true, focusStatus: 'FOCUS', isHost: true }
      ]
    };
    set((state) => ({
      rooms: [newRoom, ...state.rooms],
      currentRoom: newRoom
    }));
  }
}));
