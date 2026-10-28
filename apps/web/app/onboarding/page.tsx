'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  Zap,
  Target,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Heart,
  ShieldCheck
} from 'lucide-react';
import { useOnboardingStore, SchoolClass, Subject, Distraction } from '../../store/useOnboardingStore';

const SCHOOL_CLASSES: SchoolClass[] = [
  '10A1', '10A2', '10A3', '10A4', '10A5',
  '11B1', '11B2', '11B3', '11B4', '11B5',
  '12C1', '12C2', '12C3', '12C4', '12C5'
];

const SUBJECTS: Array<{ value: Subject; label: string; emoji: string; color: string }> = [
  { value: 'Toan', label: 'Toán', emoji: '📐', color: 'emerald' },
  { value: 'Ngu Van', label: 'Ngữ Văn', emoji: '📝', color: 'purple' },
  { value: 'Tieng Anh', label: 'Tiếng Anh', emoji: '🌍', color: 'sky' },
  { value: 'Vat Ly', label: 'Vật Lý', emoji: '⚡', color: 'yellow' },
  { value: 'Hoa Hoc', label: 'Hóa Học', emoji: '🧪', color: 'teal' },
  { value: 'Sinh Hoc', label: 'Sinh Học', emoji: '🌱', color: 'green' },
  { value: 'Lich Su', label: 'Lịch Sử', emoji: '📜', color: 'amber' },
  { value: 'Dia Ly', label: 'Địa Lý', emoji: '🗺️', color: 'orange' },
  { value: 'GDCD', label: 'GDCD', emoji: '🏛️', color: 'rose' },
];

const DISTRACTIONS: Array<{ value: Distraction; label: string; emoji: string }> = [
  { value: 'TikTok', label: 'TikTok', emoji: '📱' },
  { value: 'Lien Quan', label: 'Liên Quân Mobile', emoji: '⚔️' },
  { value: 'Free Fire', label: 'Free Fire', emoji: '🔥' },
  { value: 'Facebook', label: 'Facebook/Reels', emoji: '📘' },
  { value: 'YouTube', label: 'YouTube Shorts', emoji: '▶️' },
];

const SCORE_GOALS = [
  'Đạt 8+ điểm Toán giữa kỳ',
  'Vào top 10 lớp cuối kỳ',
  'Đậu vào đại học mơ ước',
  'Không bị điểm liệt môn nào',
  'Học đều tất cả các môn',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setStudentInfo, setSubjectAndDistraction, setScoreGoal, completeOnboarding } = useOnboardingStore();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedDistraction, setSelectedDistraction] = useState<Distraction | null>(null);
  const [goalInput, setGoalInput] = useState('');

  const totalSteps = 4;

  const handleNext = () => {
    if (step === 0 && (!name.trim() || !selectedClass)) return;
    if (step === 1 && !selectedSubject) return;
    if (step === 2 && !selectedDistraction) return;
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleFinish = () => {
    setStudentInfo(name, selectedClass!);
    setSubjectAndDistraction(selectedSubject!, selectedDistraction!);
    setScoreGoal(goalInput);
    completeOnboarding();
    router.push('/dashboard');
  };

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-lg mb-8 text-center z-10">
        <div className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-2 rounded-full text-xs font-bold mb-4">
          <GraduationCap className="w-4 h-4" />
          FocusAR - THPT Mỹ Đức B
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Chào mừng đến với{' '}
          <span className="text-emerald-400">Đội Học Mỹ Đức B</span>!
        </h1>
        <p className="text-zinc-400 text-sm mt-2">
          Anh/Chị sẽ giúp em chiến thắng sự trì hoãn và học đỉnh hơn mỗi ngày.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="w-full max-w-lg mb-6 z-10">
        <div className="flex items-center justify-between mb-2">
          {['Hồ sơ', 'Môn học', 'Kẻ địch', 'Mục tiêu'].map((label, i) => (
            <div key={i} className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${i <= step ? 'text-emerald-400' : 'text-zinc-600'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${
                i < step ? 'bg-emerald-500 border-emerald-400 text-zinc-950' :
                i === step ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400' :
                'bg-zinc-900 border-zinc-700 text-zinc-600'
              }`}>{i + 1}</div>
              <span className="hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content Card */}
      <div className="w-full max-w-lg z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* STEP 0: Profile - Name + Class */}
          {step === 0 && (
            <motion.div key="step0" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
              className="bg-zinc-900/50 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-100">Bước 1: Hồ Sơ Học Sinh</h2>
                  <p className="text-xs text-zinc-400">Anh/Chị cần biết em là ai để hỗ trợ tốt nhất!</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Tên của em</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Nguyễn Văn An"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Em đang học lớp nào?</label>
                  <div className="grid grid-cols-5 gap-2">
                    {SCHOOL_CLASSES.map((cls) => (
                      <button
                        key={cls}
                        onClick={() => setSelectedClass(cls)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          selectedClass === cls
                            ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={!name.trim() || !selectedClass}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-zinc-950 font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                Tiếp theo <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 1: Subject */}
          {step === 1 && (
            <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
              className="bg-zinc-900/50 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-100">Bước 2: Môn Học Mục Tiêu</h2>
                  <p className="text-xs text-zinc-400">Em muốn cải thiện môn nào nhất lúc này?</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {SUBJECTS.map((subj) => (
                  <button
                    key={subj.value}
                    onClick={() => setSelectedSubject(subj.value)}
                    className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border text-center transition-all ${
                      selectedSubject === subj.value
                        ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-2xl">{subj.emoji}</span>
                    <span className="text-xs font-semibold">{subj.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={handleBack} className="px-5 py-3 bg-zinc-900 text-zinc-300 rounded-2xl border border-zinc-800 flex items-center gap-1.5 text-sm">
                  <ChevronLeft className="w-4 h-4" /> Quay lại
                </button>
                <button onClick={handleNext} disabled={!selectedSubject} className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-zinc-950 font-bold py-3 rounded-2xl flex items-center justify-center gap-2">
                  Tiếp theo <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Distraction */}
          {step === 2 && (
            <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
              className="bg-zinc-900/50 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-100">Bước 3: Kẻ Địch Của Em</h2>
                  <p className="text-xs text-zinc-400">Tác nhân nào thường cuốn em đi nhất khi đang học?</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {DISTRACTIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDistraction(d.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      selectedDistraction === d.value
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-2xl">{d.emoji}</span>
                    <span className="font-semibold text-sm">{d.label}</span>
                    {selectedDistraction === d.value && (
                      <span className="ml-auto text-rose-400 text-xs font-bold">Kẻ địch số 1!</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={handleBack} className="px-5 py-3 bg-zinc-900 text-zinc-300 rounded-2xl border border-zinc-800 flex items-center gap-1.5 text-sm">
                  <ChevronLeft className="w-4 h-4" /> Quay lại
                </button>
                <button onClick={handleNext} disabled={!selectedDistraction} className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-zinc-950 font-bold py-3 rounded-2xl flex items-center justify-center gap-2">
                  Tiếp theo <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Score Goal */}
          {step === 3 && (
            <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
              className="bg-zinc-900/50 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-100">Bước 4: Mục Tiêu Của Em</h2>
                  <p className="text-xs text-zinc-400">Em muốn đạt được điều gì trong kỳ học này?</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {SCORE_GOALS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoalInput(g)}
                      className={`text-xs px-3.5 py-2 rounded-full border transition-all ${
                        goalInput === g
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  placeholder="Hoặc tự nhập mục tiêu của em..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Pet Preview */}
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-4xl">
                  🥚
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-400">Linh vật đồng hành của em đang chờ!</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Học càng nhiều, linh vật càng tiến hóa: Trứng → Thú Con → Chiến Binh 🦁
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={handleBack} className="px-5 py-3 bg-zinc-900 text-zinc-300 rounded-2xl border border-zinc-800 flex items-center gap-1.5 text-sm">
                  <ChevronLeft className="w-4 h-4" /> Quay lại
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-zinc-950 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  Bắt Đầu Chinh Phục!
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Trust Note */}
      <div className="mt-8 flex items-center gap-2 text-xs text-zinc-600 z-10">
        <ShieldCheck className="w-4 h-4 text-zinc-700" />
        <span>Thông tin của em được bảo mật hoàn toàn. Không chia sẻ với bên thứ ba.</span>
      </div>
    </div>
  );
}
