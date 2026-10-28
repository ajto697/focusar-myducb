'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  BrainCircuit, 
  Zap, 
  ChevronLeft,
  ListTodo,
  Target,
  GraduationCap
} from 'lucide-react';
import { useSessionStore, MicroTask } from '../../../store/useSessionStore';
import { useOnboardingStore } from '../../../store/useOnboardingStore';

const PRESET_GOALS = [
  'Ôn thi giữa kỳ môn Toán (Hàm số bậc hai & Bất phương trình)',
  'Làm 10 câu trắc nghiệm Tiếng Anh từ vựng & ngữ pháp',
  'Lập dàn ý phân tích bài thơ Tây Tiến (Ngữ Văn 12)',
  'Ôn công thức Vật Lý chương Dao động điều hòa',
  'Cân bằng 5 phương trình phản ứng Oxi hóa - Khử (Hóa)'
];

export default function NewGoalPage() {
  const router = useRouter();
  const setGoalAndTasks = useSessionStore((state) => state.setGoalAndTasks);
  const { schoolClass, targetSubject } = useOnboardingStore();

  const [goalInput, setGoalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<MicroTask[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle AI analysis API call
  const handleAnalyzeGoal = async (targetGoal?: string) => {
    const goalToAnalyze = targetGoal || goalInput;
    if (!goalToAnalyze.trim()) {
      setErrorMessage('Vui lòng nhập mục tiêu của bạn!');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    setHasAnalyzed(false);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: goalToAnalyze,
          subject: targetSubject || 'Toán',
          schoolClass: schoolClass || '12C1'
        })
      });

      if (!response.ok) {
        throw new Error('Không thể kết nối đến máy chủ AI');
      }

      const data = await response.json();
      if (data.tasks && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
        setHasAnalyzed(true);
      } else {
        throw new Error('Dữ liệu từ AI không đúng định dạng');
      }
    } catch (err: any) {
      console.error('Error analyzing goal:', err);
      // Fallback micro-tasks if fetch fails
      setTasks([
        { id: 1, title: `Mở công cụ làm việc và chuẩn bị cho "${goalToAnalyze.slice(0, 30)}"`, duration: 2 },
        { id: 2, title: 'Liệt kê 3 bước đầu tiên cần thực hiện', duration: 5 },
        { id: 3, title: 'Thực hiện bước quan trọng nhất trong 10 phút', duration: 10 }
      ]);
      setHasAnalyzed(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (preset: string) => {
    setGoalInput(preset);
    handleAnalyzeGoal(preset);
  };

  const handleAddTask = () => {
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    setTasks([...tasks, { id: newId, title: 'Bước nhỏ mới...', duration: 2 }]);
  };

  const handleRemoveTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleUpdateTaskTitle = (id: number, newTitle: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, title: newTitle } : t));
  };

  const handleStartSession = () => {
    if (tasks.length === 0) return;
    setGoalAndTasks(goalInput || 'Mục tiêu mới', tasks);
    router.push('/session');
  };

  const totalMinutes = tasks.reduce((acc, t) => acc + t.duration, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-3xl mb-8 flex items-center justify-between z-10">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors bg-zinc-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800"
        >
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </button>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-medium">
          <Zap className="w-3.5 h-3.5 animate-pulse" /> Quy Tắc 2 Phút
        </div>
      </div>

      {/* Main Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-6 md:p-10 shadow-2xl z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-4 border border-emerald-500/20 text-emerald-400">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Chia Nhỏ Mục Tiêu Với AI
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-xl mx-auto">
            Nhập bài tập lớn bạn đang trì hoãn. AI sẽ phân tách thành các hành động siêu nhỏ chỉ mất từ 2 phút để bạn bắt đầu ngay lập tức.
          </p>
        </div>

        {/* Form Input Section */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="VD: Viết bài luận 1000 từ về Trí Tuệ Nhân Tạo..."
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyzeGoal()}
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-2xl px-5 py-4 pl-12 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-base shadow-inner"
            />
            <Target className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          {errorMessage && (
            <p className="text-rose-400 text-xs px-2">{errorMessage}</p>
          )}

          {/* Quick Preset Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-xs text-zinc-500 py-1 font-medium">Gợi ý:</span>
            {PRESET_GOALS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(preset)}
                className="text-xs bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-400 px-3 py-1.5 rounded-full border border-zinc-700/50 transition-all text-left"
              >
                + {preset}
              </button>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={() => handleAnalyzeGoal()}
            disabled={isLoading || !goalInput.trim()}
            className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-950 font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-base"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>AI Đang Phân Tích & Phân Rã Micro-tasks...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>AI Phân Tích Mục Tiêu</span>
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {hasAnalyzed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-10 pt-8 border-t border-zinc-800/80 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-emerald-400" />
                    Danh Sách Micro-Tasks (Khuyên dùng)
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Tổng thời gian dự kiến: <span className="text-emerald-400 font-semibold">{totalMinutes} phút</span> ({tasks.length} bước)
                  </p>
                </div>
                <button
                  onClick={handleAddTask}
                  className="text-xs flex items-center gap-1.5 text-zinc-400 hover:text-emerald-400 bg-zinc-800/60 hover:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-700/50 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm bước
                </button>
              </div>

              {/* Task Items */}
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-3.5 hover:border-zinc-700 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 font-semibold flex items-center justify-center text-sm border border-emerald-500/20 shrink-0">
                      {index + 1}
                    </div>

                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => handleUpdateTaskTitle(task.id, e.target.value)}
                      className="flex-1 bg-transparent text-sm text-zinc-200 focus:outline-none focus:text-zinc-100"
                    />

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400" /> {task.duration}m
                      </span>
                      <button
                        onClick={() => handleRemoveTask(task.id)}
                        className="text-zinc-600 hover:text-rose-400 p-1 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Confirm & Start Session Button */}
              <button
                onClick={handleStartSession}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 text-lg mt-4 group"
              >
                <span>Bắt Đầu Phiên 2 Phút Ngay</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
