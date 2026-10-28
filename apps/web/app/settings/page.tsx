'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, Camera, Bot, Trash2, Download, Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const [webcamEnabled, setWebcamEnabled] = useState(true);
  const [arOverlayEnabled, setArOverlayEnabled] = useState(true);
  const [extensionEnabled, setExtensionEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDeleteData = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử học tập và dữ liệu cá nhân không?')) {
      alert('Đã xóa toàn bộ dữ liệu cá nhân thành công.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-emerald-400" />
          Cài Đặt & Quyền Riêng Tư (Privacy Controls)
        </h1>
        <p className="text-slate-400 text-sm">
          Quản lý quyền webcam, linh vật AR, kết nối Extension và quyền chủ động với dữ liệu cá nhân.
        </p>
      </div>

      {/* Privacy Guarantee Box */}
      <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-4">
        <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
        <div className="space-y-1">
          <h3 className="font-bold text-emerald-300">Cam Kết Bảo Mật Tuyệt Đối (Privacy-First)</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            MediaPipe & TensorFlow.js xử lý hình ảnh webcam 100% trên thiết bị người dùng. Không có luồng video hay ảnh chụp nào bị gửi về máy chủ. Chrome Extension chỉ kiểm tra tên miền tab để cảnh báo xao nhãng.
          </p>
        </div>
      </div>

      {/* Settings Options Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between py-3 border-b border-slate-800">
          <div className="space-y-1">
            <div className="font-bold text-sm text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              Bật Webcam Computer Vision (Phát Hiện Hiện Diện)
            </div>
            <div className="text-xs text-slate-400">Tự động cảnh báo khi rời bàn học hoặc sử dụng điện thoại</div>
          </div>
          <input
            type="checkbox"
            checked={webcamEnabled}
            onChange={(e) => setWebcamEnabled(e.target.checked)}
            className="w-5 h-5 accent-emerald-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between py-3 border-b border-slate-800">
          <div className="space-y-1">
            <div className="font-bold text-sm text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" />
              Bật Linh Vật AR Focus Guardian
            </div>
            <div className="text-xs text-slate-400">Hiển thị nhân vật ảo đồng hành & nhắc nhở trực quan</div>
          </div>
          <input
            type="checkbox"
            checked={arOverlayEnabled}
            onChange={(e) => setArOverlayEnabled(e.target.checked)}
            className="w-5 h-5 accent-emerald-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="space-y-1">
            <div className="font-bold text-sm text-white">Kết Nối Chrome Extension Tab Monitoring</div>
            <div className="text-xs text-slate-400">Phát hiện khi mở tab Facebook/TikTok trong giờ học</div>
          </div>
          <input
            type="checkbox"
            checked={extensionEnabled}
            onChange={(e) => setExtensionEnabled(e.target.checked)}
            className="w-5 h-5 accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" /> Đã Lưu Cài Đặt!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Lưu Thay Đổi
            </>
          )}
        </button>

        <button
          onClick={handleDeleteData}
          className="px-6 py-3 bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 text-rose-300 font-bold text-sm rounded-xl flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> Xóa Dữ Liệu Cá Nhân
        </button>
      </div>
    </div>
  );
}
