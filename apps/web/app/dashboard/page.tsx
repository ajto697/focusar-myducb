"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayCircle, Zap, Target, CheckCircle2, Clock, Trophy, Flame, Plus,
  ArrowUpRight, ShieldCheck, Bot, Sparkles, ChevronRight, History,
  TrendingUp, AlertTriangle, Sword, Crown, Star, BookOpen
} from "lucide-react";
import { useOnboardingStore, PET_STAGES, calcPetStage } from "../../store/useOnboardingStore";

const SUBJECT_TIPS: Record<string, string[]> = {
  "Toan":      ["On cong thuc truoc khi lam bai", "Giai 3 bai mau truoc khi tu giai"],
  "Tieng Anh": ["Hoc 10 tu vung moi/ngay", "Doc to to tang kha nang nghe"],
  "Ngu Van":   ["Hoc thuoc 3 dan y mau", "Viet mo bai trong 5 phut"],
  "Vat Ly":    ["Hieu ban chat truoc khi hoc cong thuc", "Ve so do tu duy"],
  "Hoa Hoc":   ["Hoc bang tuan hoan theo nhom", "Can bang PTHH la nen tang"],
};

export default function DashboardPage() {
  const {
    studentName, schoolClass, targetSubject, mainDistraction,
    scoreGoal, isExamMode, pet, toggleExamMode, addPetXP, isOnboarded
  } = useOnboardingStore();

  const [goals, setGoals] = useState<any[]>([]);
  const [streakDays, setStreakDays] = useState(3);
  const [xp, setXp] = useState(pet.xp || 180);
  const [todayFocusMins, setTodayFocusMins] = useState(45);
  const [showPetLevelUp, setShowPetLevelUp] = useState(false);
  const dailyTargetMins = 120;

  const petStageInfo = PET_STAGES[pet.stage];
  const nextStage = pet.stage === "EGG" ? "BABY" : pet.stage === "BABY" ? "TEEN" : pet.stage === "TEEN" ? "WARRIOR" : null;
  const nextStageInfo = nextStage ? PET_STAGES[nextStage] : null;
  const petXpToNext = nextStageInfo ? nextStageInfo.xpRequired - pet.xp : 0;
  const petProgress = nextStageInfo
    ? Math.min(100, ((pet.xp - petStageInfo.xpRequired) / (nextStageInfo.xpRequired - petStageInfo.xpRequired)) * 100)
    : 100;

  const tips = SUBJECT_TIPS[targetSubject || "Toan"] || SUBJECT_TIPS["Toan"];
  const todayTip = tips[Math.floor(Date.now() / 86400000) % tips.length];

  useEffect(() => {
    fetch("http://localhost:4000/goals")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setGoals(data); })
      .catch(() => {
        setGoals([
          {
            id: "g1",
            title: "Hoan thanh Bai Luan Tieng Anh 1000 tu",
            category: targetSubject || "Tieng Anh",
            progressPercentage: 40,
            tasksCount: 2,
            completedTasksCount: 1,
          },
        ]);
      });
  }, []);

  const progressPercent = Math.min(100, Math.round((todayFocusMins / dailyTargetMins) * 100));

  const handleFakeAddXP = () => {
    addPetXP(25);
    setShowPetLevelUp(true);
    setTimeout(() => setShowPetLevelUp(false), 2500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  };

  const greeting = studentName
    ? `Chao em ${studentName}!`
    : "Chao buoi sang, Hoc Vien!";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`max-w-7xl mx-auto space-y-8 py-2 transition-all duration-500 ${
        isExamMode ? "relative" : ""
      }`}
    >
      {/* Exam Mode Overlay Glow */}
      {isExamMode && (
        <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-red-950/20 to-transparent" />
      )}

      {/* A. Hero Welcome Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {schoolClass && (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                isExamMode
                  ? "bg-red-950/50 border-red-700/40 text-red-300"
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}>
                Lop {schoolClass} · THPT My Duc B
              </span>
            )}
            {targetSubject && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300">
                Mon trong tam: {targetSubject}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {greeting} <span className={isExamMode ? "text-red-400" : "text-emerald-400"}>Vao viec thoi!</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Chuoi{" "}
            <span className="text-amber-400 font-bold">{streakDays} ngay</span>{" "}
            cua em dang chay tot.{" "}
            {scoreGoal && <span className="text-zinc-300">Muc tieu: {scoreGoal}</span>}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-bold">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{streakDays} Ngay Chuoi</span>
          </div>

          {/* Exam Mode Toggle */}
          <button
            onClick={toggleExamMode}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
              isExamMode
                ? "bg-red-500/15 border-red-500/40 text-red-400 hover:bg-red-500/25"
                : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {isExamMode ? "ON THI Mode: BAT" : "Bat On Thi Mode"}
          </button>
        </div>
      </motion.div>

      {/* AI Study Tip Banner */}
      {targetSubject && (
        <motion.div
          variants={itemVariants}
          className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs ${
            isExamMode
              ? "bg-red-950/30 border-red-800/40 text-red-300"
              : "bg-emerald-950/30 border-emerald-500/20 text-emerald-300"
          }`}
        >
          <Sparkles className="w-4 h-4 flex-shrink-0" />
          <span>
            <span className="font-bold">Meo hom nay ({targetSubject}):</span> {todayTip}
          </span>
        </motion.div>
      )}

      {/* B. Core Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          {/* Core Action Card */}
          <motion.div
            variants={itemVariants}
            className={`relative overflow-hidden p-6 sm:p-8 rounded-3xl backdrop-blur-xl border space-y-6 shadow-2xl ${
              isExamMode
                ? "bg-red-950/20 border-red-800/30"
                : "bg-zinc-900/50 border-white/5"
            }`}
          >
            <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none ${
              isExamMode ? "bg-red-500/10" : "bg-emerald-500/10"
            }`} />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-4 text-center sm:text-left flex-1">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${
                  isExamMode
                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                }`}>
                  {isExamMode ? <AlertTriangle className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5 fill-emerald-400" />}
                  <span>{isExamMode ? "CHE DO ON THI — BLOCK DISTRACTION" : "QUY TAC 2 PHUT CHONG TRI HOAN"}</span>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {isExamMode ? (
                      <>San sang <span className="text-red-400">on thi</span> chua em?</>
                    ) : (
                      <>San sang cho <span className="text-emerald-400">2 phut</span>?</>
                    )}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {isExamMode
                      ? "Vao on thi thoi em oi! Cap sat ky thi roi, moi phut deu quy gia!"
                      : "Chi can cam ket mo sach va lam 1 viec nho. Nao bo se tu buoc vao luong tap trung."
                    }
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/focus"
                    className={`inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-black text-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                      isExamMode
                        ? "bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.35)]"
                        : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-zinc-950 shadow-[0_0_30px_rgba(16,185,129,0.35)]"
                    }`}
                  >
                    <PlayCircle className={`w-5 h-5 ${isExamMode ? "fill-white" : "fill-zinc-950"}`} />
                    <span>{isExamMode ? "Bat Dau On Thi Ngay!" : "Bat Dau 2 Phut Ngay"}</span>
                  </Link>
                </div>
              </div>

              {/* Circular Progress */}
              <div className="relative flex flex-col items-center justify-center p-4">
                <svg className="w-32 h-32 sm:w-36 sm:h-36 transform -rotate-90">
                  <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="8"
                    className="text-zinc-800/60" fill="transparent" />
                  <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="8"
                    className={`transition-all duration-500 ${isExamMode ? "text-red-500" : "text-emerald-400"}`}
                    fill="transparent" strokeDasharray={300}
                    strokeDashoffset={300 - (300 * progressPercent) / 100}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl sm:text-2xl font-black text-white">{todayFocusMins}m</span>
                  <span className="text-[10px] text-zinc-400 font-mono">/ {dailyTargetMins}m muc tieu</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Goals Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className={`w-4 h-4 ${isExamMode ? "text-red-400" : "text-emerald-400"}`} />
                Muc Tieu Dang Thuc Hien
              </h3>
              <Link href="/goals" className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                isExamMode ? "text-red-400 hover:text-red-300" : "text-emerald-400 hover:text-emerald-300"
              }`}>
                <span>Tat ca muc tieu</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {goals.length === 0 ? (
              <div className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Bot className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-white">Chua co muc tieu nao</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    De AI giup em ra nho muc tieu lon thanh cac buoc 2-15 phut sieu de bat dau.
                  </p>
                </div>
                <Link href="/goals/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold transition-all">
                  <Plus className="w-4 h-4" />
                  <span>Tao Muc Tieu Voi AI</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {goals.map((g) => (
                  <div key={g.id} className="p-5 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/5 hover:border-emerald-500/30 transition-all space-y-3 group">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md">
                            {g.category || "Hoc tap"}
                          </span>
                          <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                            {g.title}
                          </h4>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">{g.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                        style={{ width: `${g.progressPercentage}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                      <span className="flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {g.completedTasksCount || 1} / {g.tasksCount || 2} Task hoan thanh
                      </span>
                      <Link href="/focus" className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1">
                        Vao hoc ngay <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* PET WIDGET */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/5 space-y-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-400" />
              Linh Vat Dong Hanh
            </h3>

            {/* Pet display */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleFakeAddXP}
                title="Nhan de +25 XP thu nghiem"
                className="relative w-20 h-20 rounded-2xl bg-zinc-950/60 border border-zinc-800 flex items-center justify-center text-5xl hover:scale-110 transition-transform cursor-pointer select-none"
              >
                {pet.emoji}
                {pet.hasUniform && (
                  <span className="absolute -bottom-1 -right-1 text-base">🎒</span>
                )}
              </button>
              <div className="flex-1 space-y-2">
                <div>
                  <p className="font-bold text-zinc-100 text-sm">{petStageInfo.label}</p>
                  <p className="text-[11px] text-zinc-500">
                    {pet.xp} XP {nextStageInfo && `/ ${nextStageInfo.xpRequired} de tien hoa`}
                  </p>
                </div>
                {/* XP Progress Bar */}
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-400 transition-all duration-700"
                    style={{ width: `${petProgress}%` }}
                  />
                </div>
                {nextStageInfo && (
                  <p className="text-[10px] text-zinc-500">
                    Con {petXpToNext} XP de tro thanh{" "}
                    <span className="text-purple-400 font-bold">{nextStageInfo.emoji} {nextStageInfo.label}</span>
                  </p>
                )}
                {pet.stage === "WARRIOR" && (
                  <p className="text-[10px] text-yellow-400 font-bold">MAX LEVEL - Chien Binh Hoc Duong!</p>
                )}
              </div>
            </div>

            {/* Pet Level Up Toast */}
            <AnimatePresence>
              {showPetLevelUp && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-3 left-3 right-3 bg-purple-900/80 border border-purple-500/40 rounded-xl p-2.5 text-center"
                >
                  <p className="text-xs font-bold text-purple-300">+25 XP! Linh vat cua em vui lam! {pet.emoji}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-[10px] text-zinc-600 text-center">
              Tap trung de kiem XP va tien hoa linh vat
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/5 space-y-4"
          >
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Thong Ke Nhanh Hom Nay
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-400 font-medium block">Tap trung</span>
                <span className="text-lg font-black text-emerald-400">{todayFocusMins}m</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-400 font-medium block">Task xong</span>
                <span className="text-lg font-black text-indigo-400">3 Task</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-400 font-medium block">Xao nhang tab</span>
                <span className="text-lg font-black text-amber-400">0 Lan</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-400 font-medium block">XP kiem duoc</span>
                <span className="text-lg font-black text-purple-400">{pet.xp} XP</span>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard Quick CTA */}
          <motion.div
            variants={itemVariants}
            className="p-5 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 space-y-3"
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h4 className="font-bold text-sm text-yellow-300">Bang Xep Hang Lop</h4>
            </div>
            {schoolClass && (
              <p className="text-xs text-zinc-400">
                Lop <span className="text-yellow-300 font-bold">{schoolClass}</span> dang o hang #4 tren BXH.
                Co gang them de vuon len top 3!
              </p>
            )}
            <Link href="/leaderboard"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/30 text-yellow-300 rounded-xl text-xs font-bold transition-all">
              <Crown className="w-3.5 h-3.5" />
              Xem Bang Xep Hang
            </Link>
          </motion.div>

          {/* Privacy note */}
          <motion.div
            variants={itemVariants}
            className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-300"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>Moi hinh anh Webcam & Tab tracking xu ly 100% On-Device bao mat.</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
