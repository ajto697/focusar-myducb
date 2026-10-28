'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MicOff, CameraOff, VolumeX, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { RoomMember } from '../../store/useRoomStore';

interface VideoGridProps {
  members: RoomMember[];
  isFocusSession: boolean;
  myCameraOn: boolean;
}

export default function VideoGrid({ members, isFocusSession, myCameraOn }: VideoGridProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Acquire webcam stream for local user if camera is toggled on
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (myCameraOn) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Webcam permission not granted or unavailable:', err);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [myCameraOn]);

  // Determine grid columns based on member count
  const gridColsClass =
    members.length <= 1
      ? 'grid-cols-1'
      : members.length <= 4
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-2 md:grid-cols-3';

  return (
    <div className={`grid ${gridColsClass} gap-4 w-full h-full auto-rows-fr`}>
      {members.map((member, index) => {
        const isMe = member.name.includes('Tôi');
        const showWebcam = isMe ? myCameraOn : member.isCameraOn;

        return (
          <motion.div
            key={member.id || index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900/80 border border-zinc-800/90 shadow-xl group flex items-center justify-center"
          >
            {/* Background Focus Overlay */}
            {isFocusSession && (
              <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[2px] pointer-events-none z-10 transition-all" />
            )}

            {/* Video or Cute Avatar Content */}
            {showWebcam && isMe ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : showWebcam ? (
              <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex flex-col items-center justify-center relative">
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-5xl shadow-inner animate-pulse">
                  {member.avatar}
                </div>
                <span className="text-xs text-zinc-400 mt-2 font-mono">Webcam Feed Active</span>
              </div>
            ) : (
              /* Fallback Cute Avatar */
              <div className="w-full h-full bg-zinc-950/90 flex flex-col items-center justify-center p-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-4xl shadow-xl">
                    {member.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-zinc-900 border border-zinc-700 rounded-full p-1 text-zinc-400">
                    <CameraOff className="w-3.5 h-3.5" />
                  </div>
                </div>
                <span className="text-xs text-zinc-400 mt-3 font-medium">Bàn học tĩnh lặng</span>
              </div>
            )}

            {/* Status Badges Overlay */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border backdrop-blur-md flex items-center gap-1 ${
                member.focusStatus === 'FOCUS'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : member.focusStatus === 'BREAK'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  member.focusStatus === 'FOCUS' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                }`} />
                {member.focusStatus === 'FOCUS' ? 'Đang Tập Trung' : member.focusStatus === 'BREAK' ? 'Đang Nghỉ' : 'Vắng Mặt'}
              </span>

              {member.isHost && (
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-medium backdrop-blur-md">
                  Chủ phòng
                </span>
              )}
            </div>

            {/* User Name & Mic Muted Badge (Bottom Left) */}
            <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
              <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 px-3 py-1 rounded-xl text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                {isMe && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{member.name}</span>
              </div>

              {/* Muted Mic indicator (Always Muted in Body Doubling) */}
              <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 p-1.5 rounded-xl text-zinc-400" title="Đã tắt mic (Phòng im lặng)">
                <MicOff className="w-3.5 h-3.5 text-zinc-500" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
