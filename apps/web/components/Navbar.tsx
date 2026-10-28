"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap, Target, PlayCircle, Users, BarChart3,
  Settings, Trophy, GraduationCap, AlertTriangle, Menu, X
} from "lucide-react";
import { useOnboardingStore, PET_STAGES } from "../store/useOnboardingStore";

export const Navbar = () => {
  const pathname = usePathname();
  const { pet, isExamMode, schoolClass } = useOnboardingStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Tổng Quan", icon: Target },
    { href: "/goals/new", label: "Chia Nhỏ AI", icon: Zap },
    { href: "/focus", label: "Phiên 2 Phút", icon: PlayCircle },
    { href: "/rooms", label: "Phòng Học Ảo", icon: Users },
    { href: "/leaderboard", label: "BXH Trường", icon: Trophy },
    { href: "/reports", label: "Báo Cáo", icon: BarChart3 },
    { href: "/settings", label: "Cài Đặt", icon: Settings },
  ];

  const petStageInfo = PET_STAGES[pet.stage] || PET_STAGES.EGG;

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-2xl transition-all duration-500 ${
      isExamMode
        ? "border-red-900/60 bg-zinc-950/95 shadow-[0_4px_30px_rgba(225,29,72,0.15)]"
        : "border-white/10 bg-slate-950/80 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
    }`}>
      {isExamMode && (
        <div className="w-full bg-gradient-to-r from-red-950 via-rose-950 to-red-950 border-b border-red-800/60 px-4 py-1.5 flex items-center justify-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="text-[11px] font-black text-red-200 uppercase tracking-widest text-center">
            CHẾ ĐỘ ÔN THI ĐANG BẬT — TẬP TRUNG TỐI ĐA VÌ ĐIỂM SỐ MỸ ĐỨC B!
          </span>
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 font-bold text-base tracking-tight text-white group">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-md ${
            isExamMode
              ? "bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-red-900/40"
              : "bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 shadow-emerald-500/25 group-hover:scale-105"
          }`}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black tracking-tight text-base flex items-center gap-1">
              Focus<span className={isExamMode ? "text-red-400" : "text-emerald-400"}>AR</span>
            </span>
            <span className="text-[10px] text-emerald-400/80 font-bold tracking-wider uppercase">THPT Mỹ Đức B</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? isExamMode
                      ? "text-red-300 bg-red-500/15 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                      : "text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Badges & CTA */}
        <div className="flex items-center gap-2.5">
          {schoolClass && (
            <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-slate-900/90 border border-slate-700/60 rounded-full text-xs font-black text-emerald-400 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Lớp</span>
              <span>{schoolClass}</span>
            </div>
          )}

          {/* Pet Mascot Mini Badge */}
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-full text-xs transition-all shadow-sm group"
          >
            <span className="text-base group-hover:scale-125 transition-transform">{pet.emoji}</span>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] text-slate-400 font-semibold">{petStageInfo.label}</span>
              <span className="text-[10px] text-amber-400 font-black">{pet.xp} XP</span>
            </div>
          </Link>

          <Link
            href="/focus"
            className={`px-4 py-2 font-black text-xs rounded-full transition-all active:scale-95 flex items-center gap-1.5 shadow-lg ${
              isExamMode
                ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-600/30"
                : "bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 text-slate-950 shadow-emerald-500/30"
            }`}
          >
            <PlayCircle className="w-4 h-4 fill-current" />
            <span>{isExamMode ? "Ôn Thi Ngay" : "Vào Việc"}</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl px-4 py-3 space-y-1 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
