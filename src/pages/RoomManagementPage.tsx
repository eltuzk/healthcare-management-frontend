import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Map as MapIcon, 
  Activity, Zap, X
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
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
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
      toast.error(error.message || 'Lỗi');
    }
  };

  const filteredRooms = rooms.filter(r => Number(r.floor) === selectedFloor);
  const leftSide = filteredRooms.slice(0, 5);
  const rightSide = filteredRooms.slice(5, 10);
  const islandSide = filteredRooms.slice(10, 15);

  return (
    <div className="min-h-screen bg-slate-50 noise-bg mesh-gradient overflow-hidden selection:bg-blue-500/30 text-slate-700 font-body p-6 lg:p-10">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-scan"></div>
        <div className="absolute inset-0 border-[40px] border-black/5 mask-gradient-to-b from-white to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto space-y-8">
        {/* Header - Floating Navigation */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col lg:flex-row justify-between items-center gap-6 glass-panel p-6 rounded-[32px]"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <MapIcon className="text-blue-600 w-6 h-6" />
            </div>
            {/* Title Removed */}
          </div>

          <div className="flex items-center gap-8">
            <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-black/5 shadow-inner">
              {[1, 2, 3].map(f => (
                <button 
                  key={f}
                  onClick={() => setSelectedFloor(f)}
                  className={`relative px-8 py-2.5 rounded-xl font-bold text-xs transition-all duration-500 ${
                    selectedFloor === f ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {selectedFloor === f && (
                    <motion.div 
                      layoutId="activeFloor"
                      className="absolute inset-0 bg-white rounded-xl border border-black/5 shadow-[0_5px_15px_rgba(0,0,0,0.05)]"
                    />
                  )}
                  <span className="relative z-10">TẦNG 0{f}</span>
                </button>
              ))}
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setEditingRoom(null); setIsRoomModalOpen(true); }}
              className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-xs shadow-[0_5px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              THÊM PHÒNG MỚI
            </motion.button>
          </div>
        </motion.header>

        {/* Main Interface */}
        <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* Sidebar Status */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="col-span-12 lg:col-span-2 space-y-4"
          >
            {/* Status Info Removed */}
          </motion.div>


          {/* Floor Map Engine */}
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 lg:col-span-10 relative"
          >
            <div className="glass-panel p-8 lg:p-12 rounded-[40px] min-h-[800px] relative overflow-hidden">
              
              {/* Floor Layout Grid */}
              <div className="relative w-full max-w-[1300px] mx-auto grid grid-cols-12 gap-8 z-10">
                
                {/* LEFT WING */}
                <div className="col-span-3 space-y-6">
                  {leftSide.map((room, idx) => (
                    <ArchitecturalRoom 
                      key={room.roomId} 
                      room={room} 
                      index={idx} 
                      onEdit={() => { setEditingRoom(room); setIsRoomModalOpen(true); }}
                    />
                  ))}
                </div>

                {/* CENTRAL CORE */}
                <div className="col-span-6 flex flex-col justify-between items-center py-4">
                  <div className="grid grid-cols-2 gap-6 w-full px-4">
                    {islandSide.map((room, idx) => (
                      <ArchitecturalRoom 
                        key={room.roomId} 
                        room={room} 
                        index={idx} 
                        onEdit={() => { setEditingRoom(room); setIsRoomModalOpen(true); }}
                      />
                    ))}
                  </div>

                  {/* Reception Area */}
                  <div className="relative mt-12">
                    <div className="absolute -inset-12 bg-blue-500/5 rounded-full blur-[40px]"></div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="relative glass-panel p-8 rounded-[40px] w-64 text-center border-slate-200/50 shadow-sm"
                    >
                      <div className="w-12 h-12 bg-blue-500/5 rounded-full mx-auto mb-4 flex items-center justify-center border border-blue-500/10">
                        <Activity className="text-blue-600 w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg uppercase tracking-tight">QUẦY LỄ TÂN</h3>
                    </motion.div>
                  </div>

                  {/* Furniture Decor */}
                  <div className="flex gap-4 opacity-20 mt-12">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-lg shadow-sm"></div>
                    ))}
                  </div>
                </div>

                {/* RIGHT WING */}
                <div className="col-span-3 space-y-6">
                  {rightSide.map((room, idx) => (
                    <ArchitecturalRoom 
                      key={room.roomId} 
                      room={room} 
                      index={idx} 
                      onEdit={() => { setEditingRoom(room); setIsRoomModalOpen(true); }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Room Modal */}
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
              className="relative glass-panel w-full max-w-lg rounded-[32px] overflow-hidden border-white shadow-2xl"
            >
              <form onSubmit={handleSaveRoom} className="p-8 lg:p-10 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="text-blue-600 w-5 h-5" />
                    {editingRoom ? 'Cập nhật phòng' : 'Thêm phòng mới'}
                  </h2>
                  <button type="button" onClick={() => setIsRoomModalOpen(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all">
                    <X className="text-slate-500 w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mã phòng</label>
                    <input name="roomCode" defaultValue={editingRoom?.roomCode} placeholder="PK101" required className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-900 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Tầng</label>
                    <input name="floor" type="number" defaultValue={editingRoom?.floor || selectedFloor} required className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 outline-none font-bold text-slate-900" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Loại phòng</label>
                    <select name="roomTypeId" defaultValue={editingRoom?.roomTypeId || ''} required className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-bold text-slate-900 outline-none focus:border-blue-500 appearance-none cursor-pointer">
                      <option value="">Chọn loại phòng</option>
                      {roomTypes.map((t: any) => <option key={t.roomTypeId} value={t.roomTypeId}>{t.roomTypeName}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Chuyên khoa</label>
                    <select name="specialtyId" defaultValue={editingRoom?.specialtyId || ''} className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-bold text-slate-900 outline-none focus:border-blue-500 appearance-none cursor-pointer">
                      <option value="">Không có chuyên khoa</option>
                      {specialties.map((s: any) => <option key={s.specialtyId} value={s.specialtyId}>{s.specialtyName}</option>)}
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all uppercase tracking-widest text-xs">
                  LƯU THAY ĐỔI
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ArchitecturalRoom: React.FC<{ room: Room, index: number, onEdit: () => void }> = ({ room, index, onEdit }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ y: -4 }}
      onClick={onEdit}
      className="relative cursor-pointer group"
    >
      <div className="relative border-[1px] border-slate-200 rounded-[20px] bg-white transition-all duration-300 p-5 group-hover:shadow-[0_12px_24px_-10px_rgba(0,0,0,0.08)] group-hover:border-blue-400/40">
        <div className="space-y-4">
          <div className="space-y-0.5">
            <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Mã phòng</span>
            <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none">{room.roomCode}</h4>
          </div>

          <div className="space-y-1">
            <span className="text-[7px] font-bold text-blue-500/50 uppercase tracking-widest">Chuyên khoa</span>
            <p className="text-xs font-bold text-slate-800 uppercase leading-tight">
              {room.specialtyName || room.roomTypeName}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomManagementPage;


