'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ThumbsUp, Zap, Sparkles, Coffee, Send } from 'lucide-react';
import { useRoomStore } from '../../store/useRoomStore';

interface NudgeButtonProps {
  onNudgeSend?: (emoji: string) => void;
}

const EMOJI_OPTIONS = [
  { label: 'Yêu thương', emoji: '💖', icon: Heart },
  { label: 'Cố lên', emoji: '👍', icon: ThumbsUp },
  { label: 'Năng lượng', emoji: '⚡', icon: Zap },
  { label: 'Tỏa sáng', emoji: '✨', icon: Sparkles },
  { label: 'Tỉnh táo', emoji: '☕', icon: Coffee }
];

export default function NudgeButton({ onNudgeSend }: NudgeButtonProps) {
  const { nudges, sendNudge, removeNudge } = useRoomStore();

  const handleSendEmoji = (emoji: string) => {
    if (onNudgeSend) {
      onNudgeSend(emoji);
    } else {
      sendNudge('Bạn (Tôi)', emoji);
    }
  };

  // Auto clear floating nudges after 3.5 seconds
  useEffect(() => {
    if (nudges.length > 0) {
      const timer = setTimeout(() => {
        removeNudge(nudges[0].id);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [nudges, removeNudge]);

  return (
    <>
      {/* Floating Animated Emojis across screen */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {nudges.map((nudge) => (
            <motion.div
              key={nudge.id}
              initial={{ opacity: 0, y: '80vh', scale: 0.5 }}
              animate={{ opacity: [0, 1, 1, 0], y: '15vh', scale: [0.8, 1.4, 1.2, 0.9] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3.5, ease: 'easeOut' }}
              style={{ left: `${nudge.xOffset}%` }}
              className="absolute flex flex-col items-center"
            >
              <div className="text-5xl filter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-bounce">
                {nudge.emoji}
              </div>
              <span className="text-[10px] bg-zinc-900/90 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 backdrop-blur-md shadow-md mt-1 font-semibold">
                {nudge.senderName} động viên!
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick Nudge Selector Bar */}
      <div className="flex items-center gap-1.5 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 p-1.5 rounded-2xl shadow-xl">
        <span className="text-[10px] text-zinc-500 font-semibold px-2 uppercase tracking-wider hidden sm:inline">
          Gửi Năng Lượng:
        </span>
        {EMOJI_OPTIONS.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendEmoji(opt.emoji)}
            className="p-2 bg-zinc-900/80 hover:bg-emerald-500/20 text-zinc-300 hover:text-emerald-400 rounded-xl border border-zinc-800/80 hover:border-emerald-500/40 transition-all text-base hover:scale-110 active:scale-95"
            title={opt.label}
          >
            {opt.emoji}
          </button>
        ))}
      </div>
    </>
  );
}
