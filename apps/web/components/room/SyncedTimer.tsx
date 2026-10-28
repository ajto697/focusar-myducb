'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Sparkles, Flame, Coffee, ShieldCheck } from 'lucide-react';
import { useRoomStore } from '../../store/useRoomStore';

interface SyncedTimerProps {
  onToggleTimer?: () => void;
}

export default function SyncedTimer({ onToggleTimer }: SyncedTimerProps) {
  const { currentRoom, tickCurrentRoomTimer, toggleTimerRunning, resetTimer } = useRoomStore();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (currentRoom && currentRoom.isTimerRunning) {
      interval = setInterval(() => {
        tickCurrentRoomTimer();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentRoom?.isTimerRunning, tickCurrentRoomTimer]);

  if (!currentRoom) return null;

  const secondsLeft = currentRoom.secondsLeft;
  const initialSeconds = currentRoom.initialSeconds;
  const isRunning = currentRoom.isTimerRunning;
  const isFocus = currentRoom.status === 'FOCUS';

  // Format seconds -> MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Progress percentage
  const progressPercent = initialSeconds > 0 ? ((initialSeconds - secondsLeft) / initialSeconds) * 100 : 0;
  const strokeDashoffset = 439.82 - (439.82 * progressPercent) / 100;

  const handlePlayPause = () => {
    if (onToggleTimer) {
      onToggleTimer();
    } else {
      toggleTimerRunning();
    }
  };

  return (
    <div className="w-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 flex flex-col items-center shadow-xl">
      {/* Session Status Banner */}
      <div className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 mb-4 border ${
        isFocus
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      }`}>
        {isFocus ? <Flame className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <Coffee className="w-3.5 h-3.5 text-amber-400" />}
        <span>{isFocus ? 'Phiên Tập Trung 25 Phút' : 'Giờ Nghỉ Thư Giãn 5 Phút'}</span>
      </div>

      {/* Synced Timer Progress Circle */}
      <div className="relative flex items-center justify-center my-2">
        <svg className="w-52 h-52 -rotate-90 transform">
          <circle
            cx="50%"
            cy="50%"
            r="70"
            className="stroke-zinc-950"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50%"
            cy="50%"
            r="70"
            className={`transition-all duration-1000 ease-linear ${
              isFocus ? 'stroke-emerald-400' : 'stroke-amber-400'
            }`}
            strokeWidth="8"
            strokeDasharray="439.82"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Digital Clock */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-black font-mono tracking-tighter text-zinc-100 drop-shadow-md">
            {formatTime(secondsLeft)}
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 font-medium">
            {isRunning ? 'Đồng bộ thời gian' : 'Tạm dừng'}
          </p>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-3 mt-4 w-full">
        <button
          onClick={() => resetTimer(1500)}
          className="p-3 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-2xl border border-zinc-800 transition-all"
          title="Đặt lại 25 phút"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handlePlayPause}
          className={`flex-1 py-3 px-5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
            isRunning
              ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700'
              : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-zinc-100" /> Tạm Dừng Đồng Bộ
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-zinc-950" /> Đếm Ngược Cả Phòng
            </>
          )}
        </button>
      </div>
    </div>
  );
}
