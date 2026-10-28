"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayCircle, Zap, Target, CheckCircle2, Clock, Trophy, Flame, Plus,
  ArrowUpRight, ShieldCheck, Bot, Sparkles, ChevronRight, History,
  TrendingUp, AlertTriangle, Sword, Crown, Star, BookOpen, GraduationCap,
  Heart, Compass, Share2
} from "lucide-react";
import { useOnboardingStore, PET_STAGES, calcPetStage, Subject } from "../../store/useOnboardingStore";

const SUBJECT_TIPS: Record<string, string[]> = {
  "Toan": [
    "Ôn lại công thức trọng tâm trước khi làm bài",
    "Làm 3 câu nhận biết để lấy đà trước khi đụng câu khó",
    "Vẽ hình to, rõ ràng và gạch chân giả thiết đề bài"
  ],
  "Tieng Anh": [
    "Học 10 từ vựng theo chủ đề mỗi ngày (đặt câu ngắn)",
    "Đọc to đoạn văn mẫu 1 lần để tăng phản xạ ngữ âm",
    "Ghi chú lại các bẫy ngữ pháp thường gặp trong đề thi"
  ],
  "Ngu Van": [
    "Học thuộc 3 luận điểm cốt lõi của tác phẩm",
    "Tập viết phần mở bài ấn tượng trong đúng 5 phút",
    "Dùng sơ đồ tư duy để nhớ mạch cảm xúc của bài thơ"
  ],
  "Vat Ly": [
    "Hiểu rõ bản chất hiện tượng trước khi ráp công thức",
    "Đổi đơn vị chuẩn SI ngay khi đọc đề bài",
    "Vẽ sơ đồ mạch điện hoặc phân tích lực trước khi tính toán"
  ],
  "Hoa Hoc": [
    "Cân bằng phương trình hóa học là nền tảng số 1",
    "Nhớ hóa trị và bảo toàn nguyên tố/khối lượng",
    "Ghi chép hiện tượng màu sắc kết tủa, khí thoát ra"
  ],
  "Sinh Hoc": [
    "Vẽ sơ đồ phả hệ và sơ đồ lai ra giấy nháp",
    "Ghi nhớ các cơ chế di truyền và biến dị qua hình vẽ",
    "Đọc kỹ câu hỏi trắc nghiệm đếm số phát biểu đúng/sai"
  ],
  "Lich Su": [
    "Học theo dòng thời gian và các mốc chiến dịch lớn",
    "Liên hệ nguyên nhân thắng lợi và ý nghĩa lịch sử",
    "Học theo từ khóa ngắn gọn thay vì học vẹt cả đoạn"
  ],
  "Dia Ly": [
    "Khai thác triệt để Atlat Địa lý Việt Nam",
    "Nắm chắc đặc điểm khí hậu và các vùng kinh tế trọng điểm",
    "Ghi nhớ các dạng biểu đồ thường gặp để chọn đúng loại"
  ],
  "GDCD": [
    "Nắm chắc các quyền tự do cơ bản của công dân",
    "Phân tích tình huống thực tế theo từng chủ thể vi phạm",
    "Đọc kỹ đề để không bị lừa các câu phủ định"
  ]
};

const SUBJECT_ICONS: Record<string, { label: string; emoji: string }> = {
  "Toan": { label: "Toán", emoji: "📐" },
  "Ngu Van": { label: "Ngữ Văn", emoji: "📝" },
  "Tieng Anh": { label: "Tiếng Anh", emoji: "🌍" },
  "Vat Ly": { label: "Vật Lý", emoji: "⚡" },
  "Hoa Hoc": { label: "Hóa Học", emoji: "🧪" },
  "Sinh Hoc": { label: "Sinh Học", emoji: "🌱" },
  "Lich Su": { label: "Lịch Sử", emoji: "📜" },
  "Dia Ly": { label: "Địa Lý", emoji: "🗺️" },
  "GDCD": { label: "GDCD", emoji: "🏛️" },
};

export default function DashboardPage() {
  const {
    studentName, schoolClass, targetSubject, mainDistraction,
    scoreGoal, isExamMode, pet, toggleExamMode, addPetXP, isOnboarded
  } = useOnboardingStore();

  const [goals, setGoals] = useState<any[]>([]);
  const [streakDays, setStreakDays] = useState(3);
  const [todayFocusMins, setTodayFocusMins] = useState(45);
  const [showPetLevelUp, setShowPetLevelUp] = useState(false);
  const [activeSubject, setActiveSubject] = useState<string>(targetSubject || "Toan");
  const dailyTargetMins = 120;

  const petStageInfo = PET_STAGES[pet.stage] || PET_STAGES.EGG;
  const nextStage = pet.stage === "EGG" ? "BABY" : pet.stage === "BABY" ? "TEEN" : pet.stage === "TEEN" ? "WARRIOR" : null;
  const nextStageInfo = nextStage ? PET_STAGES[nextStage] : null;
  const petXpToNext = nextStageInfo ? Math.max(0, nextStageInfo.xpRequired - pet.xp) : 0;
  const petProgress = nextStageInfo
    ? Math.min(100, Math.max(5, ((pet.xp - petStageInfo.xpRequired) / (nextStageInfo.xpRequired - petStageInfo.xpRequired)) * 100))
    : 100;

  const currentTips = SUBJECT_TIPS[activeSubject] || SUBJECT_TIPS["Toan"];
  const todayTip = currentTips[Math.floor(Date.now() / 86400000) % currentTips.length];

  useEffect(() => {
    fetch("http://localhost:4000/goals")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data) && data.length > 0) setGoals(data); else throw new Error(); })
      .catch(() => {
        setGoals([
          {
            id: "g1",
            title: `Làm 5 bài tập trọng tâm môn ${SUBJECT_ICONS[targetSubject || "Toan"]?.label || "Toán"}`,
            category: SUBJECT_ICONS[targetSubject || "Toan"]?.label || "Toán",
            progressPercentage: 60,
            tasksCount: 3,
            completedTasksCount: 2,
          },
          {
            id: "g2",
            title: "Ôn lại lý thuyết thi giữa kỳ trong 15 phút",
            category: "Ôn Tập",
            progressPercentage: 25,
            tasksCount: 4,
            completedTasksCount: 1,
          }
        ]);
      });
  }, [targetSubject]);

  const progressPercent = Math.min(100, Math.round((todayFocusMins / dailyTargetMins) * 100));

  const handlePetFeed = () => {
    addPetXP(25);
    setShowPetLevelUp(true);
    setTimeout(() => setShowPetLevelUp(false), 2500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  };

  const studentDisplay = studentName ? studentName : "Học Sinh";
  const classDisplay = schoolClass ? schoolClass : "12C1";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 py-2 relative"
    >
      {/* Exam Mode Glowing Aurora */}
      {isExamMode && (
        <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-rose-950/25 via-red-950/15 to-transparent" />
      )}

      {/* ========================================================
          A. WELCOME & STATUS HERO HEADER
         ======================================================== */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
        {/* Glow orb */}
        <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[100px] pointer-events-none ${
          isExamMode ? "bg-red-500/20" : "bg-emerald-500/15"
        }`} />

        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-black px-3 py-1 rounded-full border tracking-wide uppercase flex items-center gap-1.5 shadow-sm ${
              isExamMode
                ? "bg-red-950/70 border-red-700/60 text-red-200"
                : "bg-emerald-950/70 border-emerald-500/30 text-emerald-300"
            }`}>
              <GraduationCap className="w-3.5 h-3.5" />
              Lớp {classDisplay} · THPT Mỹ Đức B
            </span>

            {targetSubject && (
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-slate-300 flex items-center gap-1">
                <span>Môn trọng tâm:</span>
                <span className="text-white font-extrabold">{SUBJECT_ICONS[targetSubject]?.label || targetSubject}</span>
              </span>
            )}

            {mainDistraction && (
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-rose-950/40 border border-rose-800/40 text-rose-300">
                Chặn: {mainDistraction}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2 flex-wrap">
            <span>Chào em, {studentDisplay}!</span>
            <span className={`inline-block ${isExamMode ? "text-gradient-ruby" : "text-gradient-emerald"}`}>
              {isExamMode ? "Chiến đấu thôi em ơi!" : "Vào việc thôi em ơi, cố lên!"}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            🔥 Chuỗi tập trung: <span className="text-amber-400 font-extrabold">{streakDays} ngày liên tiếp</span>.
            {scoreGoal ? (
              <span className="text-slate-400 ml-2">Mục tiêu cá nhân: <strong className="text-white">"{scoreGoal}"</strong></span>
            ) : (
              <span className="text-slate-400 ml-2">Hãy duy trì phong độ để đưa lớp {classDisplay} lên top 1 trường!</span>
            )}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 z-10 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 text-amber-300 rounded-2xl text-xs font-black shadow-sm">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{streakDays} NGÀY CHUỖI</span>
          </div>

          {/* Exam Mode Toggle Button */}
          <button
            onClick={toggleExamMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black border transition-all duration-300 shadow-md ${
              isExamMode
                ? "bg-gradient-to-r from-red-600 to-rose-600 border-red-500 text-white shadow-red-600/30 animate-pulse"
                : "bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-red-500/50 hover:text-red-400"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{isExamMode ? "ÔN THI: ĐANG BẬT" : "BẬT CHẾ ĐỘ ÔN THI"}</span>
          </button>
        </div>
      </motion.div>

      {/* ========================================================
          B. STUDY TIP OF THE DAY (ANH/CHỊ KHÓA TRÊN)
         ======================================================== */}
      <motion.div
        variants={itemVariants}
        className={`flex items-start sm:items-center gap-3.5 p-4 rounded-2xl border text-xs shadow-md transition-all ${
          isExamMode
            ? "bg-gradient-to-r from-red-950/40 via-slate-900/60 to-slate-950 border-red-800/50 text-red-200"
            : "bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-slate-950 border-emerald-500/30 text-emerald-200"
        }`}
      >
        <div className={`p-2 rounded-xl flex-shrink-0 ${
          isExamMode ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"
        }`}>
          <Sparkles className="w-4 h-4 animate-spin-slow" />
        </div>
        <div className="space-y-0.5">
          <p className="font-black uppercase tracking-wider text-[10px] text-slate-400">
            Lời Dặn Khóa Trên ({SUBJECT_ICONS[activeSubject]?.label || activeSubject}):
          </p>
          <p className="text-white font-medium sm:text-xs">
            "{todayTip}"
          </p>
        </div>
      </motion.div>

      {/* ========================================================
          C. CORE 2-COLUMN GRID (MAIN ACTION & WIDGETS)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: HERO 2-MIN LAUNCHER & TASKS */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. Core 2-Minute Launcher Card */}
          <motion.div
            variants={itemVariants}
            className={`relative overflow-hidden p-6 sm:p-8 rounded-3xl border space-y-6 shadow-2xl glass-panel ${
              isExamMode
                ? "border-red-800/40 bg-gradient-to-br from-red-950/40 to-slate-950/80"
                : "border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-[#07090E]"
            }`}
          >
            {/* Ambient Background glow */}
            <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none ${
              isExamMode ? "bg-red-500/15" : "bg-emerald-500/15"
            }`} />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-4 text-center sm:text-left flex-1">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-black shadow-sm ${
                  isExamMode
                    ? "bg-red-500/15 border-red-500/30 text-red-300"
                    : "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                }`}>
                  {isExamMode ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                  )}
                  <span>{isExamMode ? "CHẾ ĐỘ ÔN THI KHẨN CẤP" : "QUY TẮC 2 PHÚT — BẮT ĐẦU DỄ DÀNG"}</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {isExamMode ? (
                      <>Sẵn sàng <span className="text-gradient-ruby">bứt phá điểm số</span> chưa em?</>
                    ) : (
                      <>Không cần hoàn hảo. <br className="hidden sm:inline" />Chỉ cần <span className="text-gradient-emerald">2 phút mở sách!</span></>
                    )}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                    {isExamMode
                      ? "Mỗi phút tập trung lúc này là thêm điểm cho kỳ thi sắp tới. Vào trận ngay thôi em ơi!"
                      : "Cam kết 2 phút: mở tập vở ra, đọc 1 trang đầu tiên. Trí não sẽ tự động kéo em vào luồng tập trung sâu."
                    }
                  </p>
                </div>

                {/* Quick Subject Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chọn môn học phiên này:</span>
                  <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
                    {Object.entries(SUBJECT_ICONS).slice(0, 5).map(([key, item]) => {
                      const isSelected = activeSubject === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setActiveSubject(key)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                            isSelected
                              ? isExamMode
                                ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                                : "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black"
                              : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <span>{item.emoji}</span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Big CTA Button */}
                <div className="pt-2">
                  <Link
                    href="/focus"
                    className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm tracking-wide transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-2xl ${
                      isExamMode
                        ? "bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white shadow-red-600/40 hover:shadow-red-600/60"
                        : "bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 shadow-emerald-500/40 hover:shadow-emerald-500/60"
                    }`}
                  >
                    <PlayCircle className="w-5 h-5 fill-current" />
                    <span>{isExamMode ? "VÀO TRẬN ÔN THI NGAY!" : "BẮT ĐẦU 2 PHÚT NGAY"}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-75" />
                  </Link>
                </div>
              </div>

              {/* Circular Gauge Progress */}
              <div className="relative flex flex-col items-center justify-center p-4">
                <svg className="w-36 h-36 sm:w-40 sm:h-40 transform -rotate-90">
                  <circle
                    cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="10"
                    className="text-slate-800/70" fill="transparent"
                  />
                  <circle
                    cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="10"
                    className={`transition-all duration-700 ${isExamMode ? "text-red-500" : "text-emerald-400"}`}
                    fill="transparent"
                    strokeDasharray={310}
                    strokeDashoffset={310 - (310 * progressPercent) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl sm:text-3xl font-black text-white">{todayFocusMins}p</span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold tracking-tight">/ {dailyTargetMins}p mục tiêu</span>
                  <span className={`text-[9px] font-black uppercase mt-1 px-2 py-0.5 rounded-full ${
                    progressPercent >= 50 ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                  }`}>
                    {progressPercent}% Đạt
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. Tasks & AI Goal Breakdown Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Target className={`w-5 h-5 ${isExamMode ? "text-red-400" : "text-emerald-400"}`} />
                Nhiệm Vụ Học Tập Trọng Tâm
              </h3>
              <Link
                href="/goals/new"
                className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                  isExamMode
                    ? "bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Chia nhỏ bài tập với AI</span>
              </Link>
            </div>

            <div className="space-y-3">
              {goals.map((g) => (
                <div
                  key={g.id}
                  className="p-5 rounded-3xl glass-panel border border-white/10 hover:border-emerald-500/40 transition-all space-y-3.5 group shadow-lg"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-black px-2.5 py-1 bg-slate-900 border border-slate-800 text-emerald-400 rounded-lg">
                        {g.category || "Học tập"}
                      </span>
                      <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                        {g.title}
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-black text-emerald-400">{g.progressPercentage}%</span>
                  </div>

                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 transition-all duration-700 rounded-full"
                      style={{ width: `${g.progressPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {g.completedTasksCount || 1} / {g.tasksCount || 2} Micro-task đã hoàn thành
                    </span>
                    <Link
                      href="/focus"
                      className="text-[11px] font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Vào học ngay</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: PET MASCOT, STATS & LEADERBOARD WIDGET */}
        <div className="space-y-6">
          {/* 1. PET MASCOT SYSTEM (NUÔI LINH VẬT MỸ ĐỨC B) */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-400 fill-purple-400" />
                Linh Vật Trường Mỹ Đức B
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300">
                Giai đoạn: {pet.stage}
              </span>
            </div>

            {/* Interactive Pet Visual */}
            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={handlePetFeed}
                title="Bấm để nạp thêm +25 XP và cho linh vật ăn!"
                className="relative w-22 h-22 p-4 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/30 flex items-center justify-center text-5xl hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-purple-900/20 group"
              >
                <span className="animate-float block">{pet.emoji}</span>
                <span className="absolute -bottom-1 -right-1 text-xs bg-purple-900 border border-purple-500/40 rounded-full px-1.5 py-0.5 font-black text-purple-200 shadow-md">
                  +XP
                </span>
              </button>

              <div className="flex-1 space-y-2">
                <div>
                  <p className="font-black text-white text-sm flex items-center gap-1.5">
                    <span>{petStageInfo.label}</span>
                    <span className="text-xs">🎒</span>
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {petStageInfo.description || "Đang đồng hành ôn thi"}
                  </p>
                </div>

                {/* XP Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-purple-300 font-bold">{pet.xp} XP</span>
                    <span className="text-slate-500">{nextStageInfo ? `${nextStageInfo.xpRequired} XP` : "MAX"}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 transition-all duration-700 rounded-full"
                      style={{ width: `${petProgress}%` }}
                    />
                  </div>
                </div>

                {nextStageInfo ? (
                  <p className="text-[10px] text-slate-400">
                    Cần <strong className="text-amber-400">{petXpToNext} XP</strong> nữa để tiến hóa thành{" "}
                    <span className="text-purple-300 font-bold">{nextStageInfo.emoji} {nextStageInfo.label}</span>!
                  </p>
                ) : (
                  <p className="text-[10px] text-amber-400 font-black">
                    🏆 ĐÃ ĐẠT CẤP ĐỘ CHIẾN BINH MỸ ĐỨC B CAO NHẤT!
                  </p>
                )}
              </div>
            </div>

            {/* Level up celebration toast */}
            <AnimatePresence>
              {showPetLevelUp && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-900/90 to-pink-900/90 border border-purple-500/50 rounded-2xl p-3 text-center shadow-lg"
                >
                  <p className="text-xs font-black text-purple-200 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>+25 XP! Linh vật ăn no và đang cổ vũ em! {pet.emoji}</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handlePetFeed}
              className="w-full py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold transition-all text-center flex items-center justify-center gap-2"
            >
              <Heart className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
              <span>Nạp Năng Lượng Cho Linh Vật (+25 XP)</span>
            </button>
          </motion.div>

          {/* 2. CLASS LEADERBOARD HIGHLIGHT WIDGET */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-3xl glass-panel border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-slate-950/80 to-slate-900/90 space-y-4 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h4 className="font-black text-sm text-amber-300">Thi Đua Toàn Trường</h4>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-md border border-amber-500/30">
                THPT Mỹ Đức B
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-300 leading-relaxed">
                Lớp <strong className="text-amber-400 font-black">{classDisplay}</strong> đang thi đua cùng các lớp khác.
                Mỗi phút tập trung của em đều được cộng trực tiếp vào tổng giờ học của lớp!
              </p>

              {/* Quick Top 3 mini table */}
              <div className="bg-slate-950/70 rounded-2xl p-3 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">🥇 12C1</span>
                  <span className="font-mono text-slate-400">342 giờ · 28 ngày</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">🥈 11B2</span>
                  <span className="font-mono text-slate-400">298 giờ · 21 ngày</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-amber-600">
                  <span className="flex items-center gap-1.5">🥉 12C3</span>
                  <span className="font-mono text-slate-400">276 giờ · 19 ngày</span>
                </div>
              </div>
            </div>

            <Link
              href="/leaderboard"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-black transition-all shadow-md"
            >
              <Crown className="w-4 h-4" />
              <span>Xem Bảng Xếp Hạng Đầy Đủ</span>
            </Link>
          </motion.div>

          {/* 3. TODAY'S QUICK STATS */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-xl"
          >
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Chỉ Số Tập Trung Hôm Nay
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Thời gian</span>
                <span className="text-xl font-black text-emerald-400">{todayFocusMins} phút</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Hoàn thành</span>
                <span className="text-xl font-black text-cyan-400">3 Task</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Xao nhãng tab</span>
                <span className="text-xl font-black text-emerald-400">0 Lần</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Kinh nghiệm</span>
                <span className="text-xl font-black text-purple-400">{pet.xp} XP</span>
              </div>
            </div>
          </motion.div>

          {/* 4. PRIVACY GUARANTEE */}
          <motion.div
            variants={itemVariants}
            className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-500/20 flex items-center gap-3 text-xs text-slate-400"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>Hình ảnh camera & tab tracking xử lý 100% nội bộ trên máy, bảo mật tuyệt đối cho học sinh.</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
