'use client';

import React, { useState } from 'react';
import { ARViewfinder } from '../../components/ARViewfinder';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ARViewfinderPage() {
  const [currentStatus, setCurrentStatus] = useState<string>('FOCUSED');

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <Link href="/dashboard" className="hover:text-emerald-400 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span>/</span>
            <span className="text-emerald-400 font-semibold">MediaPipe AR Viewfinder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            MediaPipe 468 Face Landmarks AR Viewfinder
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/focus"
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-extrabold text-xs rounded-full shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all"
          >
            Vào Phiên Học 2 Phút
          </Link>
        </div>
      </div>

      {/* Main AR Viewfinder Component */}
      <div className="space-y-4">
        <ARViewfinder
          onStatusChange={(status) => setCurrentStatus(status)}
          className="w-full h-[540px]"
        />
      </div>
    </div>
  );
}
