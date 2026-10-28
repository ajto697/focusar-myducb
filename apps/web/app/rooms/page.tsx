'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Sparkles, 
  ChevronLeft, 
  Flame, 
  Filter, 
  X, 
  ShieldCheck, 
  Radio
} from 'lucide-react';
import RoomCard from '../../components/room/RoomCard';
import { useRoomStore } from '../../store/useRoomStore';

const CATEGORIES = ['Tất cả', 'Học thuật', 'Lập trình', 'Ngoại ngữ', 'Chill'];

export default function RoomLobbyPage() {
  const router = useRouter();
  const { rooms, createRoom } = useRoomStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Room Form State
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCategory, setNewRoomCategory] = useState<'Học thuật' | 'Lập trình' | 'Ngoại ngữ' | 'Chill'>('Học thuật');
  const [newRoomMaxMembers, setNewRoomMaxMembers] = useState(10);

  const filteredRooms = rooms.filter((room) => {
    const matchesCategory = selectedCategory === 'Tất cả' || room.category === selectedCategory;
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    createRoom(newRoomName, newRoomCategory, newRoomMaxMembers);
    setIsModalOpen(false);
    setNewRoomName('');
    const target = useRoomStore.getState().currentRoom;
    if (target) {
      router.push(`/rooms/${target.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 mb-8 z-10 relative">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-xs md:text-sm text-zinc-400 hover:text-zinc-100 transition-colors bg-zinc-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800"
        >
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </button>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-semibold">
          <Radio className="w-3.5 h-3.5 animate-pulse" /> Body Doubling Realtime
        </div>
      </div>

      {/* Title & Banner */}
      <div className="max-w-6xl mx-auto mb-10 z-10 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" /> Phòng Học Tĩnh Lặng Ảo
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-100">
              Phòng Học Ảo (Body Doubling)
            </h1>
            <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
              Học cùng những người khác qua Webcam trong sự im lặng tuyệt đối. Không chat ồn ào, đồng bộ Pomodoro 25 phút để cùng nhau bứt phá!
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold px-6 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2 text-sm shrink-0 self-start md:self-auto"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Tạo Phòng Học Mới</span>
          </button>
        </div>
      </div>

      {/* Controls: Search & Category Filter */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên phòng học..."
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl px-4 py-3 pl-10 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-all"
          />
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 relative">
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}

        {filteredRooms.length === 0 && (
          <div className="col-span-full py-16 text-center bg-zinc-900/30 border border-zinc-800/80 rounded-3xl">
            <Users className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-zinc-300">Không tìm thấy phòng phù hợp</h3>
            <p className="text-xs text-zinc-500 mt-1">Hãy thử tìm từ khóa khác hoặc bấm nút Tạo Phòng Mới ở trên.</p>
          </div>
        )}
      </div>

      {/* Modal: Create Room */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl z-10"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-300 p-1.5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Tạo Phòng Học Mới</h3>
                  <p className="text-xs text-zinc-400">Không gian Body Doubling yên tĩnh</p>
                </div>
              </div>

              <form onSubmit={handleCreateRoomSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Tên phòng học</label>
                  <input
                    type="text"
                    required
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="VD: Góc Học Tĩnh Lặng #2"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Chủ đề</label>
                  <select
                    value={newRoomCategory}
                    onChange={(e: any) => setNewRoomCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Học thuật">Học thuật</option>
                    <option value="Lập trình">Lập trình</option>
                    <option value="Ngoại ngữ">Ngoại ngữ</option>
                    <option value="Chill">Chill</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Số người tối đa</label>
                  <select
                    value={newRoomMaxMembers}
                    onChange={(e) => setNewRoomMaxMembers(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value={4}>4 người</option>
                    <option value={8}>8 người</option>
                    <option value={10}>10 người</option>
                    <option value={15}>15 người</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 text-sm mt-2"
                >
                  Xác Nhận Tạo Phòng
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
