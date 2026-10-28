'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Camera, 
  CameraOff, 
  LogOut, 
  Play, 
  Pause, 
  Users, 
  Sparkles, 
  ChevronLeft, 
  ShieldCheck, 
  VolumeX,
  MicOff,
  Flame,
  Radio
} from 'lucide-react';
import { useRoomStore } from '../../../store/useRoomStore';
import { useSocket } from '../../../hooks/useSocket';
import VideoGrid from '../../../components/room/VideoGrid';
import SyncedTimer from '../../../components/room/SyncedTimer';
import NudgeButton from '../../../components/room/NudgeButton';

export default function RoomDetailPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = (params?.id as string) || 'room-1';

  const { 
    currentRoom, 
    joinRoom, 
    leaveRoom, 
    myCameraOn, 
    toggleMyCamera 
  } = useRoomStore();

  const { isConnected, emitNudge, emitTimerToggle } = useSocket(roomId);

  useEffect(() => {
    joinRoom(roomId);
    return () => {
      // Clean up room state on unmount
    };
  }, [roomId, joinRoom]);

  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-zinc-400">Đang kết nối vào phòng học...</p>
        </div>
      </div>
    );
  }

  const handleLeaveRoom = () => {
    leaveRoom();
    router.push('/rooms');
  };

  const isFocusSession = currentRoom.status === 'FOCUS';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between p-4 md:p-6 relative overflow-hidden select-none">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 mb-4 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLeaveRoom}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-900/80 px-3.5 py-2 rounded-full border border-zinc-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Sảnh Phòng
          </button>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <h1 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <span>{currentRoom.name}</span>
            <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {currentRoom.category}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800 text-zinc-300">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentRoom.members.length}/{currentRoom.maxMembers}</span>
          </span>

          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
            isConnected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
          }`}>
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{isConnected ? 'Realtime Sync' : 'Local Mode'}</span>
          </span>
        </div>
      </div>

      {/* Main 2-Column Grid Layout (70% Video / 30% Sidebar) */}
      <div className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 z-10 items-stretch my-2">
        {/* Main Area: Video Grid (70% = 8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between min-h-[450px]">
          <VideoGrid
            members={currentRoom.members}
            isFocusSession={isFocusSession}
            myCameraOn={myCameraOn}
          />
        </div>

        {/* Sidebar: Synced Timer & Member List (30% = 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 justify-between">
          {/* Synced Timer */}
          <SyncedTimer onToggleTimer={emitTimerToggle} />

          {/* Member List with Status Badges */}
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> Thành Viên Trực Tuyến ({currentRoom.members.length})
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">Chế độ im lặng</span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1 scrollbar-none flex-1">
              {currentRoom.members.map((m) => (
                <div key={m.id} className="flex items-center justify-between bg-zinc-950/60 p-2.5 rounded-2xl border border-zinc-800/60">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{m.avatar}</span>
                    <span className="text-xs font-semibold text-zinc-200">{m.name}</span>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    m.focusStatus === 'FOCUS'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {m.focusStatus === 'FOCUS' ? '🟢 Tập trung' : '🟡 Nghỉ ngơi'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Control Bar */}
      <div className="w-full max-w-4xl mx-auto z-20 pt-2">
        <div className="bg-zinc-900/90 backdrop-blur-2xl border border-zinc-800 p-3 rounded-3xl shadow-2xl flex flex-wrap items-center justify-between gap-3">
          {/* Nudge Energy Selector */}
          <NudgeButton onNudgeSend={emitNudge} />

          {/* Action Control Buttons */}
          <div className="flex items-center gap-3">
            {/* Toggle Camera */}
            <button
              onClick={toggleMyCamera}
              className={`px-4 py-2.5 rounded-2xl font-semibold text-xs transition-all flex items-center gap-2 border ${
                myCameraOn
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400'
              }`}
            >
              {myCameraOn ? <Camera className="w-4 h-4 text-emerald-400" /> : <CameraOff className="w-4 h-4" />}
              <span>{myCameraOn ? 'Tắt Webcam' : 'Bật Webcam'}</span>
            </button>

            {/* Leave Room */}
            <button
              onClick={handleLeaveRoom}
              className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Rời Phòng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
