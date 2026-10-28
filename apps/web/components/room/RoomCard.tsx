'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Clock, Flame, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { StudyRoom } from '../../store/useRoomStore';

interface RoomCardProps {
  room: StudyRoom;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Học thuật': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Lập trình': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Ngoại ngữ': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Chill': 'bg-amber-500/10 text-amber-400 border-amber-500/20'
};

export default function RoomCard({ room }: RoomCardProps) {
  const categoryStyle = CATEGORY_COLORS[room.category] || 'bg-zinc-800 text-zinc-300 border-zinc-700';

  // Format timer minutes
  const minutesLeft = Math.ceil(room.secondsLeft / 60);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-950/20 transition-all group"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`text-xs px-3 py-1 rounded-full border font-medium ${categoryStyle}`}>
            {room.category}
          </span>

          <div className="flex items-center gap-1.5 text-xs bg-zinc-950/60 px-3 py-1 rounded-full border border-zinc-800 text-zinc-400 font-mono">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>{room.memberCount}/{room.maxMembers}</span>
          </div>
        </div>

        {/* Room Title */}
        <h3 className="text-xl font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors mb-2 leading-snug">
          {room.name}
        </h3>

        {/* Status indicator */}
        <div className="flex items-center gap-2 mb-6 text-xs">
          <span className={`w-2 h-2 rounded-full ${
            room.status === 'FOCUS' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
          }`} />
          <span className="text-zinc-300 font-medium">
            {room.status === 'FOCUS' ? `Đang trong phiên (Còn ${minutesLeft}m)` : `Đang trong giờ nghỉ (${minutesLeft}m)`}
          </span>
        </div>
      </div>

      {/* Footer: Overlapping Avatars & Join Button */}
      <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between">
        <div className="flex items-center -space-x-2 overflow-hidden">
          {room.members.slice(0, 4).map((member, idx) => (
            <div
              key={member.id || idx}
              className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-sm shadow-md"
              title={member.name}
            >
              {member.avatar}
            </div>
          ))}
          {room.members.length > 4 && (
            <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-xs text-zinc-400 font-bold">
              +{room.members.length - 4}
            </div>
          )}
        </div>

        <Link
          href={`/rooms/${room.id}`}
          className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 font-semibold text-xs px-4 py-2.5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500 transition-all flex items-center gap-1.5"
        >
          <span>Vào Học Cùng</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
