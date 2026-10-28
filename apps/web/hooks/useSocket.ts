'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRoomStore } from '../store/useRoomStore';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

export function useSocket(roomId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const sendNudgeStore = useRoomStore((state) => state.sendNudge);
  const toggleTimerRunningStore = useRoomStore((state) => state.toggleTimerRunning);

  useEffect(() => {
    // Attempt socket.io connection with fallback grace
    try {
      const socket = io(SOCKET_SERVER_URL, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 3,
        timeout: 3000,
        autoConnect: true
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        setIsConnected(true);
        if (roomId) {
          socket.emit('room:join', { roomId });
        }
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      // Listen for incoming Nudges from other room members
      socket.on('nudge:received', (data: { senderName: string; emoji: string }) => {
        sendNudgeStore(data.senderName || 'Đồng học', data.emoji || '💖');
      });

      // Listen for Synced Timer triggers from Room Host
      socket.on('timer:sync', () => {
        toggleTimerRunningStore();
      });

    } catch (err) {
      console.warn('Socket.io client connecting in local offline mode:', err);
    }

    return () => {
      if (socketRef.current) {
        if (roomId) {
          socketRef.current.emit('room:leave', { roomId });
        }
        socketRef.current.disconnect();
      }
    };
  }, [roomId, sendNudgeStore, toggleTimerRunningStore]);

  const emitNudge = (emoji: string) => {
    // Dispatch locally immediately for zero-latency UI response
    sendNudgeStore('Bạn (Tôi)', emoji);

    if (socketRef.current && isConnected && roomId) {
      socketRef.current.emit('nudge:send', { roomId, emoji });
    }
  };

  const emitTimerToggle = () => {
    toggleTimerRunningStore();
    if (socketRef.current && isConnected && roomId) {
      socketRef.current.emit('timer:toggle', { roomId });
    }
  };

  return {
    isConnected,
    emitNudge,
    emitTimerToggle
  };
}
