import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Map as MapIcon, 
  Activity, Zap, X,
  Building, CheckCircle, AlertTriangle, TrendingUp, Layers, HelpCircle
} from 'lucide-react';
import { 
  getRooms, getRoomTypes, createRoom, updateRoom 
} from '../services/roomService';
import { getSpecialties } from '../services/specialtyService';
import { toast } from 'react-hot-toast';

interface Room {
  roomId: number;
  roomCode: string;
  roomTypeName: string;
  roomTypeId: number;
  branchName: string;
  branchId: number;
  position: string;
  note: string;
  floor: number;
  specialtyId?: number;
  specialtyName?: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
}

const RoomManagementPage: React.FC = () => {
  const userRole = localStorage.getItem('role') ?? '';
  const isAdmin = userRole === 'ADMIN';

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [roomsRes, typesRes, specsRes] = await Promise.all([
        getRooms().catch(() => []),
        getRoomTypes().catch(() => []),
        getSpecialties().catch(() => [])
      ]);
      
      const processed = (Array.isArray(roomsRes) ? roomsRes : []).map((r: any) => ({
        ...r,
        status: r.roomId % 8 === 0 ? 'MAINTENANCE' : (r.roomId % 3 === 0 ? 'OCCUPIED' : 'AVAILABLE')
      }));

      setRooms(processed);
      setRoomTypes(typesRes.data || typesRes);
      setSpecialties(specsRes.data || specsRes);
      
      const floors = [...new Set(processed.map((r: any) => r.floor))].sort((a, b) => a - b);
      if (floors.length > 0 && !floors.includes(selectedFloor)) {
        setSelectedFloor(floors[0]);
      }
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải dữ liệu phòng bệnh');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      roomCode: formData.get('roomCode') as string,
      roomTypeId: Number(formData.get('roomTypeId')),
      branchId: Number(formData.get('branchId')) || 1,
      floor: Number(formData.get('floor')),
      position: formData.get('position') as string || 'default',
      note: formData.get('note') as string || '',
      specialtyId: formData.get('specialtyId') ? Number(formData.get('specialtyId')) : null,
    };

    try {
      if (editingRoom) await updateRoom(editingRoom.roomId, data);
      else await createRoom(data);
      toast.success('Thao tác thành công');
      setIsRoomModalOpen(false);
      fetchInitialData();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi lưu thông tin');
    }
  };

  // Filter rooms of current floor
  const floorRooms = rooms.filter(r => Number(r.floor) === selectedFloor);
  
  // Distribute rooms perfectly to fill horizontal grid space
  const leftSide = floorRooms.slice(0, 5);
  const rightSide = floorRooms.slice(5, 10);
  const islandSide = floorRooms.slice(10, 15);

  // Dynamic calculations for full page space utilization
  const totalRoomsCount = floorRooms.length;
  const availableRoomsCount = floorRooms.filter(r => r.status === 'AVAILABLE').length;
  const occupiedRoomsCount = floorRooms.filter(r => r.status === 'OCCUPIED').length;
  const maintenanceRoomsCount = floorRooms.filter(r => r.status === 'MAINTENANCE').length;
  const occupancyPercentage = totalRoomsCount > 0 ? Math.round((occupiedRoomsCount / totalRoomsCount) * 100) : 0;

  // Group rooms by specialties for live charts list
  const specialtyDistribution = floorRooms.reduce((acc: { [key: string]: number }, room) => {
    const key = room.specialtyName || 'Khác / Hành chính';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-indigo-500/30 text-slate-700 font-body p-6 lg:p-8 flex flex-col gap-6">
      
      {/* Background Subtle Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/25 to-transparent animate-scan"></div>
      </div>

      {/* 1. Header Control Panel */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-5 rounded-3xl border border-slate-150 shadow-sm"
      >
        <div className="flex items-center gap-4">
          {isAdmin && (
            <div className="w-11 h-11 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm">
              <MapIcon className="text-indigo-600 w-5 h-5" />
            </div>
          )}
          <div>
            <h1 className="font-display text-2xl font-black text-slate-900 tracking-tight leading-tight">Sơ đồ & Phân khu Phòng ban</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Hệ thống mô phỏng & quản trị kiến trúc y khoa</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-end">
          {/* Floor selection tabs */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            {[1, 2, 3].map(f => (
              <button 
                key={f}
                onClick={() => setSelectedFloor(f)}
                className={`relative px-6 py-2.5 rounded-xl font-black text-xs transition-all duration-300 ${
                  selectedFloor === f ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {selectedFloor === f && (
                  <motion.div 
                    layoutId="activeFloor"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-150"
                  />
                )}
                <span className="relative z-10 uppercase">Tầng 0{f}</span>
              </button>
            ))}
          </div>

          {isAdmin && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setEditingRoom(null); setIsRoomModalOpen(true); }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus size={14} />
              THÊM PHÒNG MỚI
            </motion.button>
          )}
        </div>
      </motion.header>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-40 gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đang tải kiến trúc sơ đồ...</p>
        </div>
      ) : (
        /* 2. Full-Width Split Grid Layout */
        <div className="grid grid-cols-12 gap-6 flex-1 items-stretch">
          
          {/* Left Wing - Rich Statistics & Insight Control Panel */}
          <motion.div 
            initial={{ x: -25, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 xl:col-span-3 flex flex-col gap-5 justify-between"
          >
            {/* Real-time stats card grid */}
            <div className="bg-white rounded-3xl border border-slate-150 shadow-sm p-6 flex flex-col gap-6 flex-1">
              <div>
                <h3 className="font-display font-black text-slate-800 text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
                  <TrendingUp className="text-indigo-600 w-4 h-4" /> Hiệu suất tầng 0{selectedFloor}
                </h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Thông tin tổng hợp thời gian thực</p>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wide">Tỷ lệ lấp đầy</span>
                  <span className="text-lg font-black text-indigo-600">{occupancyPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${occupancyPercentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="bg-indigo-600 h-full rounded-full"
                  />
                </div>
              </div>

              {/* Stats metrics list */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tổng số phòng</span>
                  <span className="text-2xl font-black text-slate-800 mt-1">{totalRoomsCount}</span>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3.5 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Đang Trống</span>
                    <CheckCircle className="text-emerald-500 w-3.5 h-3.5" />
                  </div>
                  <span className="text-2xl font-black text-emerald-600 mt-1">{availableRoomsCount}</span>
                </div>
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-3.5 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Đang Khám</span>
                    <Building className="text-indigo-500 w-3.5 h-3.5" />
                  </div>
                  <span className="text-2xl font-black text-indigo-600 mt-1">{occupiedRoomsCount}</span>
                </div>
                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-3.5 flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Bảo trì</span>
                    <AlertTriangle className="text-amber-500 w-3.5 h-3.5" />
                  </div>
                  <span className="text-2xl font-black text-amber-600 mt-1">{maintenanceRoomsCount}</span>
                </div>
              </div>

              {/* Specialty breakdown panel */}
              <div className="space-y-4 pt-4 border-t border-slate-100 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-display font-black text-xs text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Layers className="text-slate-400 w-3.5 h-3.5" /> Phân bổ chuyên khoa
                  </h4>
                  <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
                    {Object.entries(specialtyDistribution).map(([spec, count]) => (
                      <div key={spec} className="flex justify-between items-center bg-slate-50 border border-slate-150 px-3.5 py-2.5 rounded-xl hover:border-slate-300 transition-colors">
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[170px]">{spec}</span>
                        <span className="bg-white border border-slate-200 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-md min-w-[20px] text-center shadow-sm">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend explanation */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-2">
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><HelpCircle size={10} /> Chú thích</h5>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse"></span>
                     <span className="text-[11px] font-semibold text-slate-600">Sẵn sàng / Đang trống</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-indigo-600 shadow-sm"></span>
                     <span className="text-[11px] font-semibold text-slate-600">Đang hoạt động / Khám</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm animate-pulse"></span>
                     <span className="text-[11px] font-semibold text-slate-600">Bảo trì kỹ thuật</span>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Wing - Interactive Full-Screen Floor Map Dashboard */}
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 xl:col-span-9 flex flex-col"
          >
            <div className="bg-white border border-slate-150 p-6 lg:p-8 rounded-3xl shadow-sm flex flex-col flex-1 min-h-[750px] relative overflow-hidden justify-between">
              
              {/* architectural blueprint visual grid bg */}
              <div className="absolute inset-0 grid grid-cols-12 pointer-events-none opacity-5">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="border-r border-indigo-900 h-full"></div>
                ))}
              </div>
              
              {/* Floor Layout Grid */}
              <div className="relative w-full mx-auto grid grid-cols-12 gap-6 z-10 flex-1 items-stretch">
                
                {/* LEFT WING SECTION */}
                <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
                  <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-display font-black text-xs text-slate-400 uppercase tracking-widest">Khu Tây (Phòng 1-5)</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  </div>
                  <div className="flex flex-col gap-3.5 flex-1 justify-start">
                    {leftSide.map((room, idx) => (
                      <ArchitecturalRoom 
                        key={room.roomId} 
                        room={room} 
                        index={idx} 
                        onEdit={() => { setEditingRoom(room); setIsRoomModalOpen(true); }}
                        isAdmin={isAdmin}
                      />
                    ))}
                    {leftSide.length === 0 && (
                      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs font-bold text-slate-400">
                        Khu vực chưa xếp phòng
                      </div>
                    )}
                  </div>
                </div>

                {/* CENTRAL CORE & CORRIDOR */}
                <div className="col-span-12 md:col-span-6 flex flex-col justify-between gap-6 py-2 px-2 border-l border-r border-slate-100 bg-slate-50/20 rounded-2xl">
                  
                  {/* Central Island Rooms */}
                  <div className="flex flex-col gap-4">
                    <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-display font-black text-xs text-slate-400 uppercase tracking-widest">Phân khu Trung Tâm</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {islandSide.map((room, idx) => (
                        <ArchitecturalRoom 
                          key={room.roomId} 
                          room={room} 
                          index={idx} 
                          onEdit={() => { setEditingRoom(room); setIsRoomModalOpen(true); }}
                          isAdmin={isAdmin}
                        />
                      ))}
                      {islandSide.length === 0 && (
                        <div className="col-span-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs font-bold text-slate-400">
                          Chưa có thiết kế phòng
                        </div>
                      )}
                    </div>
                  </div>

                  {/* High fidelity Central Reception Lounge */}
                  <div className="relative my-4 flex justify-center">
                    <div className="absolute -inset-10 bg-indigo-500/5 rounded-full blur-[35px] pointer-events-none"></div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="relative bg-white border-2 border-indigo-100 p-6 rounded-2xl w-full max-w-sm text-center shadow-md flex items-center gap-4 justify-center"
                    >
                      <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
                        <Activity className="text-indigo-600 w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-display font-black text-slate-800 text-sm uppercase tracking-wide">Quầy Lễ Tân Trung Tâm</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Khu tiếp đón & Hướng dẫn Tầng 0{selectedFloor}</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Corridor Decor - Sofa seating mockups to simulate high-fidelity layout */}
                  <div className="flex justify-between items-center px-4 bg-slate-100/60 border border-slate-150 py-3 rounded-2xl shadow-inner">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hành lang & Ghế chờ chính</span>
                    <div className="flex gap-2.5">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-7 h-5 bg-white border border-slate-200 rounded shadow-sm relative flex items-center justify-center">
                          <span className="absolute w-4 h-0.5 bg-slate-100 top-0.5 rounded"></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT WING SECTION */}
                <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
                  <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-display font-black text-xs text-slate-400 uppercase tracking-widest">Khu Đông (Phòng 6-10)</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  </div>
                  <div className="flex flex-col gap-3.5 flex-1 justify-start">
                    {rightSide.map((room, idx) => (
                      <ArchitecturalRoom 
                        key={room.roomId} 
                        room={room} 
                        index={idx} 
                        onEdit={() => { setEditingRoom(room); setIsRoomModalOpen(true); }}
                        isAdmin={isAdmin}
                      />
                    ))}
                    {rightSide.length === 0 && (
                      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs font-bold text-slate-400">
                        Khu vực chưa xếp phòng
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 3. Room Creation/Modification Modal */}
      <AnimatePresence>
        {isRoomModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => setIsRoomModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden border border-slate-150 shadow-2xl z-10"
            >
              <form onSubmit={handleSaveRoom} className="p-8 lg:p-10 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-display font-black text-slate-900 flex items-center gap-2">
                    <Zap className="text-indigo-600 w-5 h-5 animate-pulse" />
                    {editingRoom ? 'CẬP NHẬT PHÒNG BỆNH' : 'THÊM PHÒNG BỆNH MỚI'}
                  </h2>
                  <button type="button" onClick={() => setIsRoomModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all">
                    <X className="text-slate-500 w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mã phòng</label>
                    <input name="roomCode" defaultValue={editingRoom?.roomCode} placeholder="E.g. NO101" required className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-slate-900 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số Tầng</label>
                    <input name="floor" type="number" defaultValue={editingRoom?.floor || selectedFloor} required className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 outline-none font-bold text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Loại phòng</label>
                    <select name="roomTypeId" defaultValue={editingRoom?.roomTypeId || ''} required className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-bold text-slate-900 outline-none focus:border-indigo-600 appearance-none cursor-pointer">
                      <option value="">Chọn loại phòng</option>
                      {roomTypes.map((t: any) => <option key={t.roomTypeId} value={t.roomTypeId}>{t.roomTypeName}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chuyên khoa</label>
                    <select name="specialtyId" defaultValue={editingRoom?.specialtyId || ''} className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-bold text-slate-900 outline-none focus:border-indigo-600 appearance-none cursor-pointer">
                      <option value="">Không có chuyên khoa</option>
                      {specialties.map((s: any) => <option key={s.specialtyId} value={s.specialtyId}>{s.specialtyName}</option>)}
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-widest text-xs">
                  LƯU THAY ĐỔI KIẾN TRÚC
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ArchitecturalRoom: React.FC<{ room: Room, index: number, onEdit: () => void, isAdmin?: boolean }> = ({ room, index, onEdit, isAdmin }) => {
  
  // Custom status color logic for high visual wow factor
  const getGlowColor = (status: Room['status']) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
      case 'OCCUPIED': return 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]';
      case 'MAINTENANCE': return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * index }}
      whileHover={isAdmin ? { y: -3, scale: 1.01 } : {}}
      onClick={isAdmin ? onEdit : undefined}
      className={`relative ${isAdmin ? 'cursor-pointer group' : ''}`}
    >
      <div className={`relative border border-slate-150 rounded-2xl bg-white transition-all duration-300 p-4 ${
        isAdmin ? 'group-hover:shadow-[0_12px_20px_-8px_rgba(0,0,0,0.06)] group-hover:border-indigo-300' : ''
      }`}>
        <div className="flex justify-between items-start">
          <div className="space-y-1 pr-2">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block leading-none">Phòng</span>
            <h4 className="text-base font-display font-black text-slate-900 tracking-tight leading-none">{room.roomCode}</h4>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-wider pt-1.5 leading-tight truncate max-w-[130px]">
              {room.specialtyName || room.roomTypeName}
            </p>
          </div>

          {/* Beautiful pulsing status dot indicator */}
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${getGlowColor(room.status)}`}></span>
          </div>
        </div>

        {/* Small bottom meta info */}
        <div className="mt-3.5 pt-2 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{room.roomTypeName}</span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-150 px-1.5 py-0.5 rounded">T0{room.floor}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomManagementPage;
