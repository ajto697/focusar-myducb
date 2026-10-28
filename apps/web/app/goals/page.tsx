'use client';

import React, { useState } from 'react';
import { Zap, Plus, CheckCircle2, Clock, Sparkles, Loader2, ListTodo } from 'lucide-react';

export default function GoalsPage() {
  const [goalTitle, setGoalTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);

  const handleAiBreakdown = async () => {
    if (!goalTitle.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:4000/ai/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalTitle, description }),
      });
      const data = await res.json();
      setGeneratedResult(data);
    } catch (err) {
      console.warn('Backend API error, using AI Engine fallback:', err);
      setGeneratedResult({
        goalTitle,
        tasks: [
          {
            title: `Bắt đầu bước 2 phút: Mở tài liệu & Viết 1 dòng về ${goalTitle}`,
            estimatedMinutes: 2,
            subTasks: [
              { title: 'Tạo file làm việc mới và viết tiêu đề', estimatedMinutes: 1 },
              { title: 'Liệt kê 2 ý tưởng chính đầu tiên', estimatedMinutes: 1 },
            ],
          },
          {
            title: `Phát triển nội dung chính cho ${goalTitle}`,
            estimatedMinutes: 15,
            subTasks: [
              { title: 'Tìm kiếm tài liệu tham khảo cốt lõi', estimatedMinutes: 7 },
              { title: 'Phác thảo khung nội dung chính', estimatedMinutes: 8 },
            ],
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-emerald-400" />
          Tạo Mục Tiêu & Chia Nhỏ Bằng AI
        </h1>
        <p className="text-slate-400 text-sm">
          Nhập mục tiêu lớn bạn đang thấy áp lực (ví dụ: "Viết khóa luận 5000 từ"). AI sẽ tự động rã thành các bước 2-15 phút siêu dễ bắt đầu.
        </p>
      </div>

      {/* Goal Generator Input Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-200">Mục tiêu của bạn:</label>
          <input
            type="text"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            placeholder="Ví dụ: Ôn tập 5 chương môn Giải Tích..."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-200">Mô tả hoặc yêu cầu cụ thể (tùy chọn):</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ghi chú thêm về deadline hoặc tài liệu..."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
          />
        </div>

        <button
          onClick={handleAiBreakdown}
          disabled={isLoading || !goalTitle.trim()}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI Đang Phân Phân Tích & Chia Nhỏ Task...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 fill-slate-950" />
              AI Chia Nhỏ Mục Tiêu
            </>
          )}
        </button>
      </div>

      {/* Generated Result Output */}
      {generatedResult && (
        <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
            <h2 className="text-xl font-bold text-emerald-300">
              Kế Hoạch Khởi Động: {generatedResult.goalTitle}
            </h2>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/30">
              Đã rã chuẩn 2-Minute Rule
            </span>
          </div>

          <div className="space-y-4">
            {generatedResult.tasks?.map((t: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <h3 className="font-bold text-base text-white">{t.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {t.estimatedMinutes} phút
                  </span>
                </div>

                {t.subTasks && t.subTasks.length > 0 && (
                  <div className="pl-10 space-y-2 border-l-2 border-slate-800">
                    {t.subTasks.map((st: any, sIdx: number) => (
                      <div key={sIdx} className="text-xs text-slate-300 flex items-center justify-between">
                        <span>• {st.title}</span>
                        <span className="text-slate-500">{st.estimatedMinutes}m</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
