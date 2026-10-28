import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'FocusAR - THPT Mỹ Đức B | Bạn Đồng Hành Chống Trì Hoãn & Đua Top Lớp',
  description: 'Nền tảng học tập thông minh dành riêng cho học sinh trường THPT Mỹ Đức B. Đánh bại trì hoãn với Quy tắc 2 phút, nuôi linh vật và thi đua xếp hạng giữa các lớp.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark scroll-smooth">
      <body className="bg-[#07090E] text-slate-100 flex flex-col min-h-screen relative overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950">
        {/* Ambient Top Glow / Aurora */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-emerald-500/10 blur-[160px] pointer-events-none -z-10 rounded-full" />
        <div className="fixed top-1/3 right-0 w-[500px] h-[400px] bg-cyan-500/5 blur-[180px] pointer-events-none -z-10 rounded-full" />

        <Navbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          {children}
        </main>

        <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500 relative z-10 bg-slate-950/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="font-semibold text-slate-400">
                FocusAR · Trường THPT Mỹ Đức B
              </p>
            </div>
            <p className="text-slate-500">
              Phong trào thi đua học tập & rèn luyện vì màu cờ sắc áo của từng lớp học.
            </p>
            <p className="text-slate-600">
              © 2026 FocusAR Mỹ Đức B.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
