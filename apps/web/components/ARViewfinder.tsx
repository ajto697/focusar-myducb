'use client';

import React, { useRef, useEffect } from 'react';
import { useFaceTracking } from '../hooks/useFaceTracking';
import { Camera, CameraOff, Eye, ShieldCheck, AlertTriangle, Zap } from 'lucide-react';

interface ARViewfinderProps {
  className?: string;
  onStatusChange?: (status: string) => void;
}

export const ARViewfinder: React.FC<ARViewfinderProps> = ({
  className = 'w-full h-[520px]',
  onStatusChange,
}) => {
  const { videoRef, streamActive, errorMsg, trackingResult, startCamera, stopCamera } = useFaceTracking(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const scanLineY = useRef(0);
  const scanDir = useRef(1);

  // Canvas Drawing Loop for 468 MediaPipe Landmarks & Iron Man Radar Overlay
  useEffect(() => {
    if (!streamActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth || 800;
    const height = canvas.offsetHeight || 500;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Subtle Iron Man AR Radar Grid Overlay
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Draw Animated Scanning Line Sweep
    scanLineY.current += 3 * scanDir.current;
    if (scanLineY.current > height) scanDir.current = -1;
    if (scanLineY.current < 0) scanDir.current = 1;

    const scanGrad = ctx.createLinearGradient(0, scanLineY.current - 20, 0, scanLineY.current);
    scanGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
    scanGrad.addColorStop(1, 'rgba(16, 185, 129, 0.35)');

    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanLineY.current - 20, width, 20);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, scanLineY.current);
    ctx.lineTo(width, scanLineY.current);
    ctx.stroke();

    // 3. Draw Viewfinder 4 Corner Brackets (Teal Emerald #10b981)
    const margin = 20;
    const bLen = 24;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(margin, margin + bLen);
    ctx.lineTo(margin, margin);
    ctx.lineTo(margin + bLen, margin);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(width - margin - bLen, margin);
    ctx.lineTo(width - margin, margin);
    ctx.lineTo(width - margin, margin + bLen);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(margin, height - margin - bLen);
    ctx.lineTo(margin, height - margin);
    ctx.lineTo(margin + bLen, height - margin);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(width - margin - bLen, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.lineTo(width - margin, height - margin - bLen);
    ctx.stroke();

    // 4. Draw 468 Facial Landmarks (Emerald Chấm Tròn Nhỏ #10b981) & Face Box
    const { landmarks, faceBox, focusState } = trackingResult;

    if (focusState !== 'ABSENT' && landmarks.length > 0) {
      // Draw 468 Landmark Dots
      ctx.fillStyle = focusState === 'FOCUSED' ? '#10b981' : '#f59e0b';
      ctx.shadowColor = focusState === 'FOCUSED' ? '#10b981' : '#f59e0b';
      ctx.shadowBlur = 6;

      for (let i = 0; i < landmarks.length; i++) {
        const pt = landmarks[i];
        const px = pt.x * width;
        const py = pt.y * height;

        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Neon Face Bounding Box
      if (faceBox) {
        const boxX = faceBox.x * width;
        const boxY = faceBox.y * height;
        const boxW = faceBox.width * width;
        const boxH = faceBox.height * height;

        const boxColor = focusState === 'FOCUSED' ? '#10b981' : '#f59e0b';
        ctx.strokeStyle = boxColor;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = boxColor;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 16);
        ctx.stroke();

        // Draw Realtime Status Tag Label Above Face Box
        ctx.shadowBlur = 0;
        ctx.fillStyle = boxColor;
        ctx.fillRect(boxX, boxY - 26, 250, 22);

        ctx.fillStyle = '#09090b';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(
          `468 LANDMARKS • ${focusState} • ${trackingResult.lookingDirectionText}`,
          boxX + 6,
          boxY - 10
        );
      }
    }

    if (onStatusChange) {
      onStatusChange(focusState);
    }
  }, [streamActive, trackingResult, onStatusChange]);

  return (
    <div className={`relative rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl select-none ${className}`}>
      {/* HTML5 Live Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-500 ${streamActive ? 'opacity-85' : 'opacity-0'}`}
      />

      {/* MediaPipe 468 Landmarks & Radar Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Top Right Action Button */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={streamActive ? stopCamera : startCamera}
          className="px-3.5 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 text-xs font-bold text-zinc-200 hover:text-emerald-400 hover:border-emerald-500/40 transition-all flex items-center gap-2"
        >
          {streamActive ? (
            <>
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tắt Camera</span>
            </>
          ) : (
            <>
              <CameraOff className="w-3.5 h-3.5 text-zinc-400" />
              <span>Bật Camera Quét Mặt</span>
            </>
          )}
        </button>
      </div>

      {/* Realtime Dynamic Telemetry Iron Man HUD Card (Bottom Left Overlay) */}
      <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-zinc-900/85 backdrop-blur-xl border border-white/10 space-y-2 text-xs z-20 max-w-xs shadow-2xl">
        <div className="flex items-center gap-2 font-bold text-white border-b border-white/10 pb-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <span>MEDIAPIPE 468 LANDMARKS HUD</span>
        </div>

        <div className="text-zinc-300 space-y-1.5 pt-1">
          <div className="flex items-center justify-between gap-4 font-mono">
            <span className="text-zinc-400">Trạng thái:</span>
            <span
              className={
                trackingResult.focusState === 'FOCUSED'
                  ? 'text-emerald-400 font-bold'
                  : trackingResult.focusState === 'ABSENT'
                  ? 'text-rose-400 font-bold'
                  : 'text-amber-400 font-bold'
              }
            >
              {trackingResult.focusState === 'FOCUSED'
                ? '● TẬP TRUNG'
                : trackingResult.focusState === 'LOOKING_AWAY'
                ? '⚠️ QUAY MẶT ĐỊ'
                : trackingResult.focusState === 'LOOKING_DOWN'
                ? '⚠️ CÚI MẶT'
                : '❌ VẮNG MẶT'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 font-mono">
            <span className="text-zinc-400">Hướng nhìn:</span>
            <span className="text-emerald-300 font-bold text-[11px] truncate max-w-[130px]">
              {trackingResult.lookingDirectionText}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 font-mono">
            <span className="text-zinc-400">Độ tin cậy:</span>
            <span className="text-emerald-400 font-bold">{(trackingResult.confidence * 100).toFixed(0)}%</span>
          </div>

          <div className="flex items-center justify-between gap-4 font-mono">
            <span className="text-zinc-400">Mô hình:</span>
            <span className="text-zinc-400 font-bold text-[10px]">Google MediaPipe Tasks</span>
          </div>
        </div>
      </div>

      {/* Top Left Privacy Badge */}
      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-zinc-900/80 backdrop-blur-xl border border-white/10 text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 z-20">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>100% On-Device Face Landmarker</span>
      </div>

      {/* Error / Offline Mode Placeholder */}
      {errorMsg && (
        <div className="absolute bottom-4 right-4 z-20 p-3 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
