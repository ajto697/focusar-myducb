import React from 'react';
import { Flame, Zap, ShieldCheck, Heart, Volume2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base shadow-lg',
  };

  const variantStyles = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 focus:ring-emerald-500',
    secondary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20 focus:ring-indigo-500',
    outline: 'border-2 border-slate-700 hover:bg-slate-800 text-slate-200 focus:ring-slate-500',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/20 focus:ring-rose-500',
    ghost: 'hover:bg-slate-800 text-slate-300 focus:ring-slate-500',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl ${className}`}>
      {children}
    </div>
  );
};

export const StreakBadge: React.FC<{ streakDays: number }> = ({ streakDays }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-bold animate-pulse">
      <Flame className="w-4 h-4 text-amber-500" />
      <span>{streakDays} Ngày Chuỗi Focus</span>
    </div>
  );
};

export const FocusTimerDisplay: React.FC<{ seconds: number; isRunning?: boolean }> = ({ seconds, isRunning }) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-950/60 border border-emerald-500/30 rounded-3xl shadow-2xl">
      <div className="text-6xl md:text-7xl font-mono font-extrabold tracking-wider text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
        {formatted}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-400">
        <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'}`} />
        {isRunning ? 'Đang trong phiên 2 Phút...' : 'Tạm dừng'}
      </div>
    </div>
  );
};
