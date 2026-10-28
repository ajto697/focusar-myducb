import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SchoolClass =
  | "10A1" | "10A2" | "10A3" | "10A4" | "10A5"
  | "11B1" | "11B2" | "11B3" | "11B4" | "11B5"
  | "12C1" | "12C2" | "12C3" | "12C4" | "12C5";

export type Subject = "Toan" | "Ngu Van" | "Tieng Anh" | "Vat Ly" | "Hoa Hoc" | "Sinh Hoc" | "Lich Su" | "Dia Ly" | "GDCD";

export type Distraction = "TikTok" | "Lien Quan" | "Free Fire" | "Facebook" | "YouTube";

export type PetStage = "EGG" | "BABY" | "TEEN" | "WARRIOR";

export interface PetState {
  stage: PetStage;
  xp: number;
  name: string;
  emoji: string;
  hasUniform: boolean;
}

export const PET_STAGES: Record<PetStage, { emoji: string; label: string; xpRequired: number }> = {
  EGG:     { emoji: "🥚", label: "Trung Than Ky",    xpRequired: 0   },
  BABY:    { emoji: "🐣", label: "Thu Con De Thuong",  xpRequired: 50  },
  TEEN:    { emoji: "🦊", label: "Cao Thieu Nien",    xpRequired: 200 },
  WARRIOR: { emoji: "🦁", label: "Chien Binh Hoc Duong", xpRequired: 500 }
};

export function calcPetStage(xp: number): PetStage {
  if (xp >= 500) return "WARRIOR";
  if (xp >= 200) return "TEEN";
  if (xp >= 50)  return "BABY";
  return "EGG";
}

interface OnboardingState {
  isOnboarded: boolean;
  studentName: string;
  schoolClass: SchoolClass | null;
  targetSubject: Subject | null;
  mainDistraction: Distraction | null;
  scoreGoal: string;
  isExamMode: boolean;
  pet: PetState;

  setStudentInfo: (name: string, schoolClass: SchoolClass) => void;
  setSubjectAndDistraction: (subject: Subject, distraction: Distraction) => void;
  setScoreGoal: (goal: string) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  toggleExamMode: () => void;
  addPetXP: (amount: number) => void;
}

const INITIAL_PET: PetState = {
  stage: "EGG",
  xp: 0,
  name: "Ban Dong Hanh",
  emoji: "🥚",
  hasUniform: false
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      isOnboarded: false,
      studentName: "",
      schoolClass: null,
      targetSubject: null,
      mainDistraction: null,
      scoreGoal: "",
      isExamMode: false,
      pet: INITIAL_PET,

      setStudentInfo: (name, schoolClass) => set({ studentName: name, schoolClass }),
      setSubjectAndDistraction: (subject, distraction) => set({ targetSubject: subject, mainDistraction: distraction }),
      setScoreGoal: (goal) => set({ scoreGoal: goal }),
      completeOnboarding: () => set({ isOnboarded: true }),

      resetOnboarding: () => set({
        isOnboarded: false,
        studentName: "",
        schoolClass: null,
        targetSubject: null,
        mainDistraction: null,
        scoreGoal: "",
        isExamMode: false,
        pet: INITIAL_PET
      }),

      toggleExamMode: () => set((state) => ({ isExamMode: !state.isExamMode })),

      addPetXP: (amount) => {
        const { pet } = get();
        const newXP = pet.xp + amount;
        const newStage = calcPetStage(newXP);
        const stageInfo = PET_STAGES[newStage];
        set({
          pet: {
            ...pet,
            xp: newXP,
            stage: newStage,
            emoji: stageInfo.emoji,
            hasUniform: newXP >= 200
          }
        });
      }
    }),
    { name: "focusar-myducb-onboarding" }
  )
);
