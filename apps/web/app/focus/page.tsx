'use client';

import React, { useState, useEffect } from 'react';
import { FocusTimerDisplay } from '@focus-ar/ui';
import { ARViewfinder } from '../../components/ARViewfinder';
import { Play, Pause, RotateCcw, AlertTriangle, ShieldCheck, Camera, Sparkles, MessageCircle, Bot } from 'lucide-react';
import Link from 'next/link';

export default function FocusPage() {
  const [secondsLeft, setSecondsLeft] = useState(120); // 2-Minute Rule (120s)
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted2Min, setIsCompleted2Min] = useState(false);
  const [sessionExtended, setSessionExtended] = useState(false);

  // Focus status from ARViewfinder
  const [arFocusState, setArFocusState] = useState<string>('FOCUSED');
  const [showIntervention, setShowIntervention] = useState(false);
  const [interventionMessage, setInterventionMessage] = useState('');

  // Timer Countdown Logic
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsCompleted2Min(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const handleStart2Min = () => {
    setIsRunning(true);
    setIsCompleted2Min(false);
  };

  const handleExtendSession = (mins: number) => {
    setSecondsLeft(mins * 60);
    setSessionExtended(true);
    setIsCompleted2Min(false);
    setIsRunning(true);
  };

  const handleARStatusChange = (status: string) => {
    setArFocusState(status);
    if (status === 'LOOKING_AWAY') {
      setInterventionMessage('Bạn đang quay mặt sang hướng khác. Hãy tập trung 2 phút vào màn hình nhé!');
      setShowIntervention(true);
    } else if (status === 'LOOKING_DOWN') {
      setInterventionMessage('Bạn đang cúi mặt xuống quá thấp. Hãy giữ tư thế ngồi thẳng lưng nào!');
      setShowIntervention(true);
    } else if (status === 'ABSENT') {
      setInterventionMessage('Không tìm thấy khuôn mặt trước webcam. Bạn đã rời bàn học?');
      setShowIntervention(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Top Banner / Privacy Status */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/80 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-sm font-bold text-zinc-200">
            Chế Độ 2 Phút Chống Trì Hoãn (2-Minute Rule)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/ar"
            className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>MediaPipe 468 AR Viewfinder</span>
            <Sparkles className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Focus Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Timer Controls */}
        <div className="space-y-6 text-center">
          <FocusTimerDisplay seconds={secondsLeft} isRunning={isRunning} />

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            {!isRunning ? (
              <button
                onClick={handleStart2Min}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-lg rounded-2xl shadow-xl shadow-emerald-500/25 transition-all flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-zinc-950" />
                Bắt Đầu 2 Phút
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(false)}
                className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-amber-600/25 transition-all flex items-center gap-2"
              >
                <Pause className="w-5 h-5" />
                Tạm Dừng
              </button>
            )}

            <button
              onClick={() => {
                setIsRunning(false);
                setSecondsLeft(120);
              }}
              className="p-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-white/5 rounded-2xl transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: MediaPipe 468 Landmarks AR Viewfinder Scanner */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-bold px-1">
            <span>MediaPipe 468 Landmarks Scanner</span>
            <span className="text-emerald-400">● Live Face Mesh</span>
          </div>

          <ARViewfinder
            onStatusChange={handleARStatusChange}
            className="w-full h-72"
          />
        </div>
      </div>

      {/* 2-Minute Completion Modal */}
      {isCompleted2Min && (
        <div className="p-6 rounded-3xl bg-emerald-950/80 border border-emerald-500/50 space-y-4 text-center animate-fadeIn">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Chúc Mừng! Bạn Đã Hoàn Thành 2 Phút Khởi Động 🎉</h2>
          <p className="text-zinc-300 text-sm max-w-md mx-auto">
            Não bộ của bạn đã vượt qua rào cản trì hoãn ban đầu. Bạn có muốn tiếp tục giữ luồng tập trung thêm 10 phút nữa không?
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleExtendSession(10)}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-sm"
            >
              Tiếp Tục 10 Phút
            </button>
            <button
              onClick={() => handleExtendSession(25)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm"
            >
              Vào Phiên Pomodoro 25 Phút
            </button>
          </div>
        </div>
      )}

      {/* Procrastination Intervention Dialog */}
      {showIntervention && (
        <div className="p-6 rounded-3xl bg-amber-950/60 border border-amber-500/40 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-amber-300">AR Guardian Nhắc Nhở Nhẹ Nhàng:</h3>
            <p className="text-sm text-zinc-200">{interventionMessage}</p>
            <div className="pt-2">
              <button
                onClick={() => setShowIntervention(false)}
                className="px-4 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-bold"
              >
                Đã Rõ, Tôi Quay Lại Học Ngay!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
