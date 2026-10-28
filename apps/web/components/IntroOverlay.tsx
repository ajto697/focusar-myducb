'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Bot, Leaf, ArrowRight, X, Sparkles } from 'lucide-react';

interface IntroOverlayProps {
  onComplete: () => void;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'SPLASH' | 'SLIDES'>('SPLASH');
  const [slideIndex, setSlideIndex] = useState(0);
  const [splashProgress, setSplashProgress] = useState(0);

  const slides = [
    {
      icon: Zap,
      badge: 'BẮT ĐẦU DỄ DÀNG',
      text: 'Học 3 tiếng? Không. Chỉ cần 2 phút.',
      color: 'from-emerald-400 to-teal-400',
    },
    {
      icon: Bot,
      badge: 'CHIA NHỎ THÔNG MINH',
      text: 'AI tự chia nhỏ bài tập cho bạn.',
      color: 'from-teal-400 to-indigo-400',
    },
    {
      icon: Sparkles,
      badge: 'AR GUARDIAN',
      text: 'Linh vật ảo nhắc bạn quay lại bàn học.',
      color: 'from-indigo-400 to-emerald-400',
    },
  ];

  // Step 1: Splash timer (2 seconds countdown)
  useEffect(() => {
    if (step === 'SPLASH') {
      const interval = setInterval(() => {
        setSplashProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStep('SLIDES');
            return 100;
          }
          return prev + 5; // 20 steps * 100ms = 2000ms
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [step]);

  // Step 2: Auto advance slides every 3.5s
  useEffect(() => {
    if (step === 'SLIDES') {
      const timer = setInterval(() => {
        setSlideIndex((prev) => {
          if (prev >= slides.length - 1) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 3500);

      return () => clearInterval(timer);
    }
  }, [step, slides.length]);

  const handleFinish = () => {
    localStorage.setItem('focusar_has_seen_intro', 'true');
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-[#0B0F19] flex flex-col items-center justify-between p-8 select-none overflow-hidden"
    >
      {/* Top Header: Skip Button */}
      <div className="w-full max-w-4xl flex justify-end">
        <button
          onClick={handleFinish}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 text-xs font-semibold tracking-wider transition-all"
        >
          <span>Bỏ qua</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl w-full">
        {step === 'SPLASH' ? (
          /* Step 1: Splash Screen with Logo Zoom & 2s Progress */
          <motion.div
            key="splash"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Logo Center Container */}
            <div className="relative flex items-center justify-center">
              {/* Circular Progress Ring */}
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="64"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-emerald-400 transition-all duration-150"
                  fill="transparent"
                  strokeDasharray={402}
                  strokeDashoffset={402 - (402 * splashProgress) / 100}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] animate-pulse">
                <Zap className="w-12 h-12 text-slate-950 fill-slate-950" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Bắt Đầu <span className="text-emerald-400">2 Phút</span>
              </h1>
              <p className="text-slate-500 text-xs tracking-widest uppercase font-mono">FocusAR • Anti-Procrastination</p>
            </div>
          </motion.div>
        ) : (
          /* Step 2: 3 Short Text-Light Slides */
          <AnimatePresence mode="wait">
            <motion.div
              key={slideIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center gap-8 py-4"
            >
              {/* Slide Icon */}
              {React.createElement(slides[slideIndex].icon, {
                className: 'w-16 h-16 text-emerald-400 filter drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]',
              })}

              <div className="space-y-3">
                <span className="text-[11px] font-extrabold tracking-widest text-emerald-400 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  {slides[slideIndex].badge}
                </span>

                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug">
                  {slides[slideIndex].text}
                </h2>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-sm flex flex-col items-center gap-6 pb-4">
        {step === 'SLIDES' && (
          <>
            {/* Slide Dots Indicator */}
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    slideIndex === idx ? 'w-8 bg-emerald-400' : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Action CTA */}
            {slideIndex === slides.length - 1 ? (
              <button
                onClick={handleFinish}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-base rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 transform active:scale-95"
              >
                Vào Ứng Dụng Ngay
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm rounded-2xl transition-all"
              >
                Tiếp tục
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};
