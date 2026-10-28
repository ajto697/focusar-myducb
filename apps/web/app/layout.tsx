import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Bắt Đầu 2 Phút (FocusAR) - Web Anti-Procrastination Platform',
  description: 'Chiến thắng trì hoãn trong 2 phút bằng AI Task Breakdown, Chrome Extension tab monitoring và Webcam AR Guardian.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-slate-950 text-slate-100 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
          <p>© 2026 FocusAR (Bắt Đầu 2 Phút). Privacy-First On-Device AI & Computer Vision.</p>
        </footer>
      </body>
    </html>
  );
}
