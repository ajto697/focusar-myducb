'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Bot, Sparkles, Shield, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface MainHeroProps {
  onReplayIntro?: () => void;
}

export const MainHero: React.FC<MainHeroProps> = ({ onReplayIntro }) => {
  const [secondsLeft, setSecondsLeft] = useState(120); // 2 minutes (120s)
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer countdown logic
  useEffect(() => {
    let timer: any = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsCompleted(true);
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const toggleTimer = () => {
    if (isCompleted) {
      setSecondsLeft(120);
      setIsCompleted(false);
    }
    setIsRunning(!isRunning);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const progressPercent = ((120 - secondsLeft) / 120) * 100;

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-8 select-none overflow-hidden">
      {/* Background Ambient Radial Glow */}
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Top Replay Intro & Quick Actions */}
      <div className="absolute top-0 right-0 p-4">
        {onReplayIntro && (
          <button
            onClick={onReplayIntro}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-emerald-400 text-xs font-semibold transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Xem Intro</span>
          </button>
        )}
      </div>

      {/* Direct Emotional Headline */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-3 max-w-xl z-10"
      >
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Hôm nay, bạn muốn <br />
          <span className="neon-text-glow text-emerald-400">bắt đầu chứ?</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium">
          Không cần hoàn hảo. Chỉ cần <span className="text-emerald-400 font-bold">2 phút</span> nhún chân.
        </p>
      </motion.div>

      {/* Giant 2-Minute Action Circle (CTA Centerpiece) */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="my-12 relative flex items-center justify-center z-10"
      >
        {/* Breathing Pulse Ring outer animation */}
        <motion.div
          animate={
            isRunning
              ? { scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }
              : { scale: [1, 1.04, 1], opacity: [0.2, 0.4, 0.2] }
          }
          transition={{ duration: isRunning ? 2 : 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] rounded-full bg-emerald-500/20 blur-xl pointer-events-none"
        />

        {/* Circular Progress Bar overlay */}
        <svg className="w-[230px] h-[230px] sm:w-[290px] sm:h-[290px] transform -rotate-90 pointer-events-none">
          <circle
            cx="50%"
            cy="50%"
            r="42%"
            stroke="currentColor"
            strokeWidth="6"
            className="text-slate-900"
            fill="transparent"
          />
          <circle
            cx="50%"
            cy="50%"
            r="42%"
            stroke="currentColor"
            strokeWidth="6"
            className="text-emerald-400 transition-all duration-300"
            fill="transparent"
            strokeDasharray={700}
            strokeDashoffset={700 - (700 * progressPercent) / 100}
            strokeLinecap="round"
          />
        </svg>

        {/* Main Giant Interactive Button */}
        <button
          onClick={toggleTimer}
          className="absolute w-[180px] h-[180px] sm:w-[230px] sm:h-[230px] rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-slate-950 font-black flex flex-col items-center justify-center gap-1 shadow-[0_0_60px_rgba(16,185,129,0.35)] hover:shadow-[0_0_80px_rgba(16,185,129,0.5)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-4 border-emerald-300/30"
        >
          {isRunning ? (
            <>
              <span className="text-4xl sm:text-5xl font-mono tracking-tight font-black">{formattedTime}</span>
              <span className="text-[11px] uppercase tracking-widest font-extrabold text-slate-900 opacity-90">
                Đang tập trung...
              </span>
            </>
          ) : isCompleted ? (
            <>
              <Sparkles className="w-10 h-10 text-slate-950" />
              <span className="text-sm font-extrabold tracking-wider">Xong 2 Phút!</span>
              <span className="text-[10px] text-slate-900 opacity-80">Bấm để học tiếp</span>
            </>
          ) : (
            <>
              <Play className="w-12 h-12 text-slate-950 fill-slate-950 translate-x-1" />
              <span className="text-lg font-black tracking-wider uppercase">BẮT ĐẦU 2m</span>
            </>
          )}
        </button>
      </motion.div>

      {/* Minimalist 3-Icon Feature Toolbar with Tooltips */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex items-center justify-center gap-6 z-10"
      >
        {/* Tool 1: AI Breakdown */}
        <Link href="/goals" className="group relative p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900 transition-all">
          <Bot className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 px-2.5 py-1 bg-slate-900 border border-slate-800 text-[11px] font-semibold text-emerald-300 rounded-lg whitespace-nowrap shadow-xl pointer-events-none">
            AI chia nhỏ
          </span>
        </Link>

        {/* Tool 2: AR Guardian */}
        <Link href="/focus" className="group relative p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900 transition-all">
          <Sparkles className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 px-2.5 py-1 bg-slate-900 border border-slate-800 text-[11px] font-semibold text-emerald-300 rounded-lg whitespace-nowrap shadow-xl pointer-events-none">
            AR bảo vệ
          </span>
        </Link>

        {/* Tool 3: Tab Shield */}
        <Link href="/settings" className="group relative p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900 transition-all">
          <Shield className="w-6 h-6 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 px-2.5 py-1 bg-slate-900 border border-slate-800 text-[11px] font-semibold text-emerald-300 rounded-lg whitespace-nowrap shadow-xl pointer-events-none">
            Chặn xao nhãng
          </span>
        </Link>
      </motion.div>
    </div>
  );
};
