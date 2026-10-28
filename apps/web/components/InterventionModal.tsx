'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  HelpCircle, 
  Sparkles, 
  X, 
  Play, 
  Coffee, 
  BrainCircuit, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';
import { useSessionStore, INTERVENTION_OPTIONS, InterventionOption } from '../store/useSessionStore';

const OPTION_ICONS = {
  hard: BrainCircuit,
  tired: Coffee,
  clueless: HelpCircle,
  tiktok: Smartphone
};

export default function InterventionModal() {
  const { 
    isInterventionOpen, 
    activeInterventionKey, 
    aiResponseBubble,
    selectInterventionReason, 
    closeIntervention,
    startTimer
  } = useSessionStore();

  if (!isInterventionOpen) return null;

  const handleResume = () => {
    closeIntervention();
    startTimer();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop overlay with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeIntervention}
          className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-zinc-900/90 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/20 overflow-hidden z-10"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Icon */}
          <button
            onClick={closeIntervention}
            className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-300 p-2 rounded-full hover:bg-zinc-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">AI Focus Coach</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h2 className="text-xl font-bold text-zinc-100">
                Bạn đang mắc ở đâu?
              </h2>
            </div>
          </div>

          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
            Đừng lo lắng! Mọi người đều có lúc bị khựng lại. Hãy cho tôi biết vấn đề để tôi hỗ trợ bạn ngay:
          </p>

          {/* 4 Option Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {Object.values(INTERVENTION_OPTIONS).map((opt) => {
              const IconComponent = OPTION_ICONS[opt.id];
              const isSelected = activeInterventionKey === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => selectInterventionReason(opt.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/30'
                      : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/40'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800/60 text-zinc-400'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* AI Response Chat Bubble */}
          <AnimatePresence mode="wait">
            {aiResponseBubble && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4.5 mb-6 relative"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-zinc-950 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-sm">
                    AI
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Gợi ý từ Trợ lý 2 Phút:
                    </p>
                    <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                      "{aiResponseBubble}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleResume}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold py-3.5 px-5 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-sm"
            >
              <Play className="w-4 h-4 fill-zinc-950" />
              <span>Tiếp Tục Tập Trung</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
