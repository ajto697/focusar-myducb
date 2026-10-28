"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap, Target, PlayCircle, Users, BarChart3,
  Settings, Trophy, GraduationCap, AlertTriangle
} from "lucide-react";
import { useOnboardingStore, PET_STAGES } from "../store/useOnboardingStore";

export const Navbar = () => {
  const pathname = usePathname();
  const { pet, isExamMode, schoolClass } = useOnboardingStore();

  const navItems = [
    { href: "/dashboard", label: "Tong Quan", icon: Target },
    { href: "/goals/new", label: "Muc Tieu & AI", icon: Zap },
    { href: "/focus", label: "Phien 2 Phut", icon: PlayCircle },
    { href: "/rooms", label: "Phong Hoc", icon: Users },
    { href: "/leaderboard", label: "BXH Lop", icon: Trophy },
    { href: "/reports", label: "Bao Cao", icon: BarChart3 },
    { href: "/settings", label: "Cai Dat", icon: Settings },
  ];

  const petStageInfo = PET_STAGES[pet.stage];

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-500 ${
      isExamMode
        ? "border-red-900/50 bg-zinc-950/95"
        : "border-white/5 bg-zinc-950/80"
    }`}>
      {isExamMode && (
        <div className="w-full bg-red-950/60 border-b border-red-800/40 px-4 py-1 flex items-center justify-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span className="text-xs font-bold text-red-300 uppercase tracking-widest">
            CHE DO ON THI DANG BAT — TAP TRUNG TOI DA!
          </span>
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-base tracking-tight text-white group">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
            isExamMode
              ? "bg-red-500/15 border border-red-500/40"
              : "bg-emerald-500/10 border border-emerald-500/30 group-hover:border-emerald-400"
          }`}>
            <GraduationCap className={`w-4 h-4 ${isExamMode ? "text-red-400" : "text-emerald-400"}`} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold tracking-tight text-sm">
              Focus<span className={isExamMode ? "text-red-400" : "text-emerald-400"}>AR</span>
            </span>
            <span className="text-[9px] text-zinc-500 font-semibold tracking-wider">My Duc B</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? isExamMode
                      ? "text-red-400 bg-red-500/10 border border-red-500/20"
                      : "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          {schoolClass && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[11px] font-bold text-zinc-300">
              {schoolClass}
            </div>
          )}

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs">
            <span className="text-base">{pet.emoji}</span>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] text-zinc-400">{petStageInfo.label}</span>
              <span className="text-[10px] text-emerald-400 font-bold">{pet.xp} XP</span>
            </div>
          </div>

          <Link
            href="/focus"
            className={`px-4 py-1.5 font-extrabold text-xs rounded-full transition-all active:scale-95 flex items-center gap-1.5 ${
              isExamMode
                ? "bg-gradient-to-r from-red-600 to-rose-500 text-white"
                : "bg-gradient-to-r from-emerald-500 to-teal-400 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
            }`}
          >
            <PlayCircle className={`w-3.5 h-3.5 ${isExamMode ? "fill-white" : "fill-zinc-950"}`} />
            {isExamMode ? "On Thi!" : "Hoc Ngay"}
          </Link>
        </div>
      </div>
    </header>
  );
};
