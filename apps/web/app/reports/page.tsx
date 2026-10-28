'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, Calendar, CheckCircle2, AlertCircle, Bot, Zap, Flame } from 'lucide-react';

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any | null>(null);

  useEffect(() => {
    fetch('http://localhost:4000/reports/daily')
      .then((res) => res.json())
      .then((data) => setReportData(data))
      .catch(() => {
        setReportData({
          date: new Date().toISOString().split('T')[0],
          totalFocusMinutes: 65,
          completedTasksCount: 3,
          tabDistractionsCount: 2,
          phoneDistractionsCount: 1,
          aiReviewSummary:
            'Hôm nay bạn đã xuất sắc chiến thắng trì hoãn với 65 phút tập trung! Bạn phát hiện 2 lần xao nhãng Facebook nhưng đã quay lại phiên 2 phút kịp thời.',
          topDistractorDomains: [
            { domain: 'facebook.com', count: 2 },
            { domain: 'tiktok.com', count: 1 },
          ],
        });
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-emerald-400" />
          Báo Cáo Tập Trung & AI Procrastination Review
        </h1>
        <p className="text-slate-400 text-sm">
          Phân tích các khoảng thời gian hay xao nhãng và nhận nhận xét từ AI Coach để điều chỉnh lịch học thích hợp.
        </p>
      </div>

      {reportData && (
        <div className="space-y-6">
          {/* AI Coach Daily Review Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-white">AI Coach Đánh Giá Cuối Ngày</h2>
                <div className="text-xs text-slate-400 font-mono">Ngày: {reportData.date}</div>
              </div>
            </div>

            <p className="text-slate-200 text-sm leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              "{reportData.aiReviewSummary}"
            </p>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-2xl font-extrabold text-emerald-400">{reportData.totalFocusMinutes} phút</div>
              <div className="text-xs text-slate-400 mt-1">Tổng tập trung</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-2xl font-extrabold text-indigo-400">{reportData.completedTasksCount} Task</div>
              <div className="text-xs text-slate-400 mt-1">Đã hoàn thành</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-2xl font-extrabold text-amber-400">{reportData.tabDistractionsCount} Lần</div>
              <div className="text-xs text-slate-400 mt-1">Chuyển tab xao nhãng</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-2xl font-extrabold text-rose-400">{reportData.phoneDistractionsCount} Lần</div>
              <div className="text-xs text-slate-400 mt-1">Cầm điện thoại</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
