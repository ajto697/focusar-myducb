'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  Zap, 
  Sparkles, 
  Flame, 
  ArrowRight,
  ShieldAlert,
  PartyPopper
} from 'lucide-react';
import { useSessionStore } from '../../store/useSessionStore';
import InterventionModal from '../../components/InterventionModal';

export default function SessionPage() {
  const router = useRouter();
  const {
    goalTitle,
    microTasks,
    currentTaskIndex,
    secondsLeft,
    initialSeconds,
    isRunning,
    isSessionFinished,
    startTimer,
    pauseTimer,
    resetTimer,
    tickTimer,
    completeCurrentTask,
    openIntervention
  } = useSessionStore();

  // Timer interval hook
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tickTimer]);

  const currentTask = microTasks[currentTaskIndex] || {
    id: 1,
    title: 'Mở Google Docs và viết 1 câu mở bài',
    duration: 2
  };

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Circular progress calculation
  const progressPercent = initialSeconds > 0 ? ((initialSeconds - secondsLeft) / initialSeconds) * 100 : 0;
  const strokeDashoffset = 565.48 - (565.48 * progressPercent) / 100;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-6 md:p-10 relative overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[150px] pointer-events-none transition-colors duration-1000 ${
        isRunning ? 'bg-emerald-500/10' : 'bg-teal-500/5'
      }`} />

      {/* Top Header */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between z-10">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-xs md:text-sm text-zinc-400 hover:text-zinc-100 transition-colors bg-zinc-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800"
        >
          <ChevronLeft className="w-4 h-4" /> Về Dashboard
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openIntervention()}
            className="flex items-center gap-2 text-xs bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 px-3.5 py-1.5 rounded-full font-medium transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Giả lập xao nhãng
          </button>
        </div>
      </div>

      {/* Main Focus Area */}
      <div className="w-full max-w-2xl mx-auto my-auto flex flex-col items-center justify-center text-center z-10 py-6">
        
        {/* Goal Badge */}
        <div className="inline-flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-4 py-1.5 rounded-full text-xs text-zinc-400 mb-6">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span className="truncate max-w-md">{goalTitle}</span>
        </div>

        {/* Current Micro-task Banner */}
        <motion.div
          key={currentTaskIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-5 mb-8 text-center shadow-lg"
        >
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Bước {currentTaskIndex + 1} / {microTasks.length} ({currentTask.duration} phút)
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-zinc-100 leading-snug">
            "{currentTask.title}"
          </h2>
        </motion.div>

        {/* Giant Timer Display */}
        {isSessionFinished ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center py-8"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
              <PartyPopper className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-extrabold text-zinc-100 mb-2">Chúc mừng bạn!</h3>
            <p className="text-zinc-400 text-sm max-w-sm mb-6">
              Bạn đã hoàn thành tất cả các bước nhỏ của mục tiêu này mà không bị trì hoãn!
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-500/20"
            >
              Quay về Dashboard
            </button>
          </motion.div>
        ) : (
          <div className="relative flex items-center justify-center my-4">
            {/* SVG Progress Circle */}
            <svg className="w-64 h-64 md:w-80 md:h-80 -rotate-90 transform">
              {/* Background Track */}
              <circle
                cx="50%"
                cy="50%"
                r="90"
                className="stroke-zinc-900"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Progress Bar */}
              <circle
                cx="50%"
                cy="50%"
                r="90"
                className="stroke-emerald-400 transition-all duration-1000 ease-linear"
                strokeWidth="10"
                strokeDasharray="565.48"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Central Time Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl md:text-7xl font-black font-mono tracking-tighter text-zinc-100 drop-shadow-md">
                {formatTime(secondsLeft)}
              </div>
              <p className="text-xs text-zinc-500 mt-2 font-medium uppercase tracking-widest">
                {isRunning ? 'Đang tập trung' : 'Tạm dừng'}
              </p>
            </div>
          </div>
        )}

        {/* Timer Control Buttons */}
        {!isSessionFinished && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={resetTimer}
              className="p-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-2xl border border-zinc-800 transition-all"
              title="Đặt lại đồng hồ"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={isRunning ? pauseTimer : startTimer}
              className={`px-8 py-4 rounded-2xl font-bold text-base transition-all flex items-center gap-3 shadow-xl ${
                isRunning
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-zinc-100" /> Tạm Dừng
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-zinc-950" /> Bắt Đầu 2 Phút
                </>
              )}
            </button>

            <button
              onClick={completeCurrentTask}
              className="p-3.5 bg-zinc-900 hover:bg-emerald-950/40 text-zinc-400 hover:text-emerald-400 rounded-2xl border border-zinc-800 hover:border-emerald-500/30 transition-all"
              title="Xong bước này"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>

      {/* Bottom Action Footer */}
      {!isSessionFinished && (
        <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-3 z-10 pb-4">
          <button
            onClick={() => openIntervention()}
            className="w-full sm:w-auto bg-zinc-900/80 hover:bg-zinc-800/90 text-zinc-300 hover:text-emerald-400 border border-zinc-800 hover:border-zinc-700 px-6 py-3.5 rounded-2xl text-sm font-medium transition-all backdrop-blur-md flex items-center justify-center gap-2 shadow-lg"
          >
            <AlertCircle className="w-4 h-4 text-emerald-400" />
            <span>Tôi đang bị kẹt (Cần trợ giúp)</span>
          </button>
        </div>
      )}

      {/* Procrastination Intervention Modal Component */}
      <InterventionModal />
    </div>
  );
}
