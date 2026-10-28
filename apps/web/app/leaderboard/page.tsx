'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Flame, Clock, Users, Crown, Star, Zap, ChevronLeft, TrendingUp, Award, Medal } from 'lucide-react';

const MOCK_CLASS_RANKINGS = [
  { rank: 1, className: '12C1', totalHours: 342, streak: 28, members: 42, subject: 'Toán & Anh', medal: 'gold' },
  { rank: 2, className: '11B2', totalHours: 298, streak: 21, members: 38, subject: 'Toán & Lý', medal: 'silver' },
  { rank: 3, className: '12C3', totalHours: 276, streak: 19, members: 40, subject: 'Văn & Sử', medal: 'bronze' },
  { rank: 4, className: '10A1', totalHours: 231, streak: 15, members: 35, subject: 'Tiếng Anh', medal: null },
  { rank: 5, className: '11B1', totalHours: 198, streak: 12, members: 37, subject: 'Lý & Hóa', medal: null },
  { rank: 6, className: '10A3', totalHours: 187, streak: 11, members: 33, subject: 'Tổng Hợp', medal: null },
  { rank: 7, className: '12C2', totalHours: 165, streak: 9, members: 41, subject: 'Lịch Sử', medal: null },
  { rank: 8, className: '11B3', totalHours: 143, streak: 8, members: 36, subject: 'Hóa Học', medal: null },
];

const MOCK_TOP_STUDENTS = [
  { rank: 1, name: 'Nguyễn Minh Anh', class: '12C1', focusHours: 68, streak: 28, avatar: '🦁', badge: 'Thánh Học Tập' },
  { rank: 2, name: 'Trần Đức Huy', class: '11B2', focusHours: 61, streak: 21, avatar: '🦊', badge: 'Chiến Binh Mỹ Đức' },
  { rank: 3, name: 'Lê Thị Thảo Nhi', class: '12C3', focusHours: 55, streak: 19, avatar: '🐼', badge: 'Ngôi Sao Tập Trung' },
  { rank: 4, name: 'Phạm Bảo Nam', class: '10A1', focusHours: 48, streak: 15, avatar: '🚀', badge: null },
  { rank: 5, name: 'Võ Hoàng Yến', class: '11B1', focusHours: 45, streak: 14, avatar: '✨', badge: null },
  { rank: 6, name: 'Đỗ Quang Việt', class: '12C2', focusHours: 42, streak: 12, avatar: '⚡', badge: null },
  { rank: 7, name: 'Huỳnh Ánh Dương', class: '10A3', focusHours: 39, streak: 11, avatar: '🌟', badge: null },
  { rank: 8, name: 'Ngô Quỳnh Trang', class: '11B3', focusHours: 36, streak: 9, avatar: '🌻', badge: null },
  { rank: 9, name: 'Cao Nhật Minh', class: '12C1', focusHours: 33, streak: 8, avatar: '☕', badge: null },
  { rank: 10, name: 'Bùi Gia Bảo', class: '10A2', focusHours: 30, streak: 7, avatar: '🎯', badge: null },
];

const MEDAL_STYLES = {
  gold: {
    ring: 'ring-2 ring-yellow-400/60 shadow-lg shadow-yellow-500/20',
    bg: 'bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border-yellow-400/30',
    text: 'text-yellow-300',
    icon: '🥇',
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30'
  },
  silver: {
    ring: 'ring-2 ring-zinc-300/40 shadow-lg shadow-zinc-300/10',
    bg: 'bg-gradient-to-br from-zinc-400/15 to-zinc-600/10 border-zinc-400/30',
    text: 'text-zinc-200',
    icon: '🥈',
    badge: 'bg-zinc-400/20 text-zinc-200 border-zinc-400/30'
  },
  bronze: {
    ring: 'ring-2 ring-amber-600/40 shadow-lg shadow-amber-600/10',
    bg: 'bg-gradient-to-br from-amber-700/20 to-amber-900/10 border-amber-600/30',
    text: 'text-amber-300',
    icon: '🥉',
    badge: 'bg-amber-700/20 text-amber-300 border-amber-600/30'
  }
} as const;

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'class' | 'individual'>('class');

  const top3Classes = MOCK_CLASS_RANKINGS.slice(0, 3);
  const restClasses = MOCK_CLASS_RANKINGS.slice(3);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-yellow-500/8 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8 relative z-10">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard" className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-900/60 px-4 py-2 rounded-full border border-zinc-800">
              <ChevronLeft className="w-4 h-4" /> Dashboard
            </Link>
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5" /> BXH Mỹ Đức B
            </div>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-3">🏆</div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              Bảng Xếp Hạng
              <span className="block text-yellow-400">Trường THPT Mỹ Đức B</span>
            </h1>
            <p className="text-zinc-400 text-sm mt-3 max-w-lg mx-auto">
              Vinh danh những lớp và cá nhân học tập chăm chỉ nhất. Hãy chiến đấu vì màu cờ sắc áo của lớp mình!
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 w-fit mx-auto gap-1">
          <button
            onClick={() => setTab('class')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === 'class' ? 'bg-emerald-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            🏫 Xếp Hạng Lớp
          </button>
          <button
            onClick={() => setTab('individual')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === 'individual' ? 'bg-yellow-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            👑 Thánh Học Tập
          </button>
        </div>

        {/* CLASS LEADERBOARD */}
        {tab === 'class' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 mb-2">
              {[top3Classes[1], top3Classes[0], top3Classes[2]].map((room, podiumIdx) => {
                if (!room) return null;
                const medal = room.medal as keyof typeof MEDAL_STYLES;
                const style = MEDAL_STYLES[medal];
                const heights = ['h-28', 'h-36', 'h-24'];
                return (
                  <div key={room.className} className="flex flex-col items-center gap-3">
                    <div className={`w-full rounded-3xl border p-4 flex flex-col items-center gap-2 ${style.bg} ${style.ring}`}>
                      <span className="text-3xl">{style.icon}</span>
                      <span className={`text-2xl font-black ${style.text}`}>{room.className}</span>
                      <span className="text-xs text-zinc-400">{room.members} thành viên</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${style.badge}`}>
                        {room.totalHours}h tập trung
                      </span>
                    </div>
                    <div className={`w-full ${heights[podiumIdx]} rounded-t-2xl flex items-start justify-center pt-3 ${
                      podiumIdx === 1 ? 'bg-yellow-500/20' : podiumIdx === 0 ? 'bg-zinc-400/10' : 'bg-amber-700/10'
                    }`}>
                      <span className={`text-5xl font-black ${podiumIdx === 1 ? 'text-yellow-300/30' : 'text-zinc-500/30'}`}>
                        #{podiumIdx === 1 ? 1 : podiumIdx === 0 ? 2 : 3}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rest of Rankings List */}
            <div className="space-y-3">
              {restClasses.map((room, i) => (
                <motion.div
                  key={room.className}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 transition-all"
                >
                  <span className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center text-sm font-black">
                    #{room.rank}
                  </span>
                  <div className="flex-1">
                    <div className="font-bold text-zinc-100">Lớp {room.className}</div>
                    <div className="text-xs text-zinc-500">{room.members} thành viên · {room.subject}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold text-sm">{room.totalHours}h</div>
                    <div className="text-xs text-zinc-500 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" /> {room.streak} ngày
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* INDIVIDUAL LEADERBOARD */}
        {tab === 'individual' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {MOCK_TOP_STUDENTS.map((student, i) => {
              const isTop3 = i < 3;
              const medalIcon = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null;

              return (
                <motion.div
                  key={student.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`flex items-center gap-4 rounded-2xl p-4 border transition-all ${
                    i === 0
                      ? 'bg-yellow-500/10 border-yellow-400/30 ring-1 ring-yellow-400/20'
                      : i === 1
                      ? 'bg-zinc-400/5 border-zinc-400/20'
                      : i === 2
                      ? 'bg-amber-700/10 border-amber-600/20'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {/* Rank Number or Medal */}
                  <div className="w-9 flex-shrink-0 flex items-center justify-center">
                    {medalIcon ? (
                      <span className="text-2xl">{medalIcon}</span>
                    ) : (
                      <span className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-400 text-sm font-black flex items-center justify-center">
                        #{student.rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    isTop3 ? 'bg-zinc-800/80 border-2 border-zinc-700' : 'bg-zinc-900 border border-zinc-800'
                  }`}>
                    {student.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-zinc-100 text-sm">{student.name}</span>
                      {student.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                          i === 0 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30' :
                          i === 1 ? 'bg-zinc-400/20 text-zinc-200 border-zinc-400/30' :
                          'bg-amber-700/20 text-amber-300 border-amber-600/30'
                        }`}>
                          ✨ {student.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-500">Lớp {student.class}</div>
                  </div>

                  {/* Stats */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-emerald-400 font-bold text-sm">{student.focusHours}h</div>
                    <div className="text-xs text-zinc-500 flex items-center justify-end gap-1">
                      <Flame className="w-3 h-3 text-amber-400" /> {student.streak} ngày
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Footer note */}
        <div className="text-center text-xs text-zinc-600 py-4">
          Bảng xếp hạng cập nhật mỗi 24 giờ · Dữ liệu tính từ tổng giờ học qua ứng dụng FocusAR
        </div>
      </div>
    </div>
  );
}
