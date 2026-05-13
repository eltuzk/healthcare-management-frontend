import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Calendar as CalendarIcon, 
  User as UserIcon, MapPin, 
  Clock, Plus, X,
  ChevronRight, ChevronLeft,
  Save
} from 'lucide-react';
import { 
  getDoctorSchedules, 
  createDoctorSchedule, 
  deleteDoctorSchedule 
} from '../services/scheduleService';
import { getRooms } from '../services/roomService';
import { getDoctors } from '../services/staffService';
import { getAccounts } from '../services/accountService';
import { toast } from 'react-hot-toast';

interface Doctor {
  doctorId: number;
  fullName: string;
  specialtyName: string;
  specialtyId: number;
}

interface Room {
  roomId: number;
  roomCode: string;
  specialtyId: number;
  specialtyName: string;
}

interface Schedule {
  scheduleId?: number;
  doctorId: number;
  doctorName: string;
  roomId: number;
  roomCode: string;
  scheduleDate: string;
  shift: 'MORNING' | 'AFTERNOON';
  isNew?: boolean;
}

const DoctorSchedulePage: React.FC = () => {
  // Data State
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [pendingSchedules, setPendingSchedules] = useState<Schedule[]>([]);
  
  // UI State
  const [searchDoctor, setSearchDoctor] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Start on Monday
    const start = new Date(d.setDate(diff));
    start.setHours(0, 0, 0, 0);
    return start;
  });
  
  // Drag & Drop State
  const [draggingDoctor, setDraggingDoctor] = useState<Doctor | null>(null);

  // Scroll Ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, [currentWeekStart]);

  // Horizontal scroll with mouse wheel
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY !== 0) {
          el.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      };
      el.addEventListener('wheel', onWheel, { passive: false });
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);

  const fetchData = async () => {
    try {
      const startDate = currentWeekStart.toISOString().split('T')[0];
      const endDate = new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const [docsRes, roomsRes, schedRes, accountsRes] = await Promise.allSettled([
        getDoctors(0, 1000),
        getRooms(),
        getDoctorSchedules({ startDate, endDate }),
        getAccounts(0, 1000)
      ]);

      // 1. Process Doctors (Entity Source)
      let docs: Doctor[] = [];
      if (docsRes.status === 'fulfilled') {
        const val = docsRes.value;
        docs = val?.content || val?.data?.content || (Array.isArray(val) ? val : []);
      }

      // 2. Fallback to Accounts if Doctors is empty (Role-based Source)
      if (docs.length === 0 && accountsRes.status === 'fulfilled') {
        const val: any = accountsRes.value;
        const accounts = val?.content || val?.data?.content || (Array.isArray(val) ? val : []);
        docs = accounts
          .filter((acc: any) => acc.roleName !== 'PATIENT' && acc.roleName !== 'ROLE_PATIENT')
          .map((acc: any) => ({
            doctorId: acc.accountId, // Use accountId as doctorId fallback
            fullName: acc.fullName,
            specialtyName: acc.specialtyName || 'Chưa xác định',
            specialtyId: acc.specialtyId || 0
          }));
      }

      // 3. Process Rooms
      let rms: Room[] = [];
      if (roomsRes.status === 'fulfilled') {
        const val = roomsRes.value;
        rms = val?.data || val || [];
      }

      // 4. Process Schedules
      let scs: Schedule[] = [];
      if (schedRes.status === 'fulfilled') {
        const val = schedRes.value;
        scs = val?.data || val || [];
      }

      setDoctors(docs);
      setRooms(rms);
      setSchedules(scs);
      setPendingSchedules([]);
    } catch (error) {
      toast.error('Lỗi hệ thống khi tải dữ liệu');
      console.error('Data Load Error:', error);
    }
  };

  // Helpers
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      const dayName = d.toLocaleDateString('vi-VN', { weekday: 'short' });
      const dateNum = d.getDate();
      const monthNum = d.getMonth() + 1;
      return {
        dateStr: d.toISOString().split('T')[0],
        dayName: dayName.toUpperCase(),
        dateLabel: `${dateNum}/${monthNum < 10 ? '0' + monthNum : monthNum}`
      };
    });
  }, [currentWeekStart]);

  const roomsBySpecialty = useMemo(() => {
    const groups: Record<string, Room[]> = {};
    rooms.forEach(r => {
      const key = r.specialtyName || 'Khác';
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });
    return groups;
  }, [rooms]);

  const filteredDoctors = doctors.filter(d => 
    (d.fullName || '').toLowerCase().includes(searchDoctor.toLowerCase()) ||
    (d.specialtyName || '').toLowerCase().includes(searchDoctor.toLowerCase())
  );

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, doctor: Doctor) => {
    setDraggingDoctor(doctor);
    e.dataTransfer.setData('doctorId', doctor.doctorId.toString());
  };

  const handleDragEnd = () => {
    setDraggingDoctor(null);
  };

  const handleDrop = (date: string, shift: 'MORNING' | 'AFTERNOON', roomId: number) => {
    if (!draggingDoctor) return;
    
    const isAssigned = [...schedules, ...pendingSchedules].find(s => 
      s.scheduleDate === date && s.shift === shift && s.doctorId === draggingDoctor.doctorId
    );

    if (isAssigned) {
      toast.error(`${draggingDoctor.fullName} đã có lịch trong ca này`);
      return;
    }

    const newAssignment: Schedule = {
      doctorId: draggingDoctor.doctorId,
      doctorName: draggingDoctor.fullName,
      roomId: roomId,
      roomCode: rooms.find(r => r.roomId === roomId)?.roomCode || '',
      scheduleDate: date,
      shift: shift,
      isNew: true
    };

    setPendingSchedules(prev => [...prev, newAssignment]);
  };

  const handleSaveAll = async () => {
    if (pendingSchedules.length === 0) return;
    
    const loadingToast = toast.loading('Đang lưu lịch trực...');
    try {
      await Promise.all(pendingSchedules.map(s => 
        createDoctorSchedule({
          doctorId: s.doctorId,
          roomId: s.roomId,
          scheduleDate: s.scheduleDate,
          shift: s.shift,
          maxCapacity: 20
        })
      ));
      toast.success('Đã lưu tất cả lịch trực!', { id: loadingToast });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi lưu lịch trực', { id: loadingToast });
    }
  };

  const handleDeleteAssignment = async (schedule: Schedule) => {
    if (schedule.isNew) {
      setPendingSchedules(prev => prev.filter(s => s !== schedule));
      return;
    }

    if (!confirm('Bạn có chắc chắn muốn xóa lịch trực này?')) return;
    try {
      if (schedule.scheduleId) {
        await deleteDoctorSchedule(schedule.scheduleId);
        toast.success('Đã xóa lịch trực');
        fetchData();
      }
    } catch (error) {
      toast.error('Không thể xóa lịch trực');
    }
  };

  const allVisibleSchedules = [...schedules, ...pendingSchedules];

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden font-body">
      {/* Header Section */}
      <div className="flex-none p-6 lg:px-10 lg:pt-8 lg:pb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <CalendarIcon className="text-blue-600 w-8 h-8" />
            Điều phối <span className="text-blue-600 font-light italic">Lịch trực</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <button 
              onClick={() => setCurrentWeekStart(new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000))}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-6 font-bold text-sm text-slate-700 min-w-[150px] text-center">
              {weekDays[0].dateLabel} — {weekDays[6].dateLabel}
            </div>
            <button 
              onClick={() => setCurrentWeekStart(new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000))}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {pendingSchedules.length > 0 && (
            <motion.button 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleSaveAll}
              className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
              <Save size={18} />
              LƯU THAY ĐỔI ({pendingSchedules.length})
            </motion.button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-6 lg:px-10 lg:pb-10 gap-8">
        
        {/* Left Sidebar: Doctors */}
        <div className="w-[300px] flex-none flex flex-col gap-6 h-full">
          <div className="glass-panel p-6 rounded-[32px] flex flex-col h-full overflow-hidden border border-white shadow-xl bg-white">
            <div className="flex items-center justify-between mb-6 flex-none">
               <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px] flex items-center gap-2">
                 <UserIcon size={14} className="text-blue-600" />
                 Nhân sự ({filteredDoctors.length})
               </h3>
            </div>

            <div className="relative mb-6 flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Tìm tên..." 
                className="w-full bg-slate-100 border-none rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={searchDoctor}
                onChange={(e) => setSearchDoctor(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doctor => (
                  <motion.div 
                    key={doctor.doctorId}
                    draggable
                    onDragStart={(e) => handleDragStart(e as any, doctor)}
                    onDragEnd={handleDragEnd}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-2xl border border-slate-100 bg-white shadow-sm cursor-grab active:cursor-grabbing group hover:border-blue-200 transition-all ${
                      draggingDoctor?.doctorId === doctor.doctorId ? 'opacity-50 border-blue-500 border-dashed bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-blue-200">
                        <UserIcon className="text-slate-400 group-hover:text-blue-500 w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 leading-tight truncate">{doctor.fullName}</p>
                        <p className="text-[9px] font-bold text-blue-600/70 uppercase tracking-widest mt-1">{doctor.specialtyName}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 opacity-50">
                  <UserIcon className="mx-auto mb-3 text-slate-300" size={32} />
                  <p className="text-xs font-bold uppercase tracking-widest">Không có dữ liệu</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid: Weekly Schedule */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <div className="glass-panel rounded-[40px] overflow-hidden flex flex-col h-full border border-white shadow-xl relative bg-white">
            
            {/* Calendar Container with Single Scroll Axis */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-auto custom-scrollbar scroll-smooth relative"
            >
              <div className="min-w-[1200px] flex flex-col">
                
                {/* Grid Header */}
                <div className="grid grid-cols-[160px_repeat(7,1fr)] border-b border-slate-100 bg-white sticky top-0 z-40 shadow-sm">
                  <div className="p-6 border-r border-slate-100 flex items-center bg-white sticky left-0 z-50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Không gian</span>
                  </div>
                  {weekDays.map(day => (
                    <div key={day.dateStr} className="p-6 text-center border-r border-slate-100 last:border-none bg-white">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{day.dayName}</p>
                      <p className="text-xl font-black text-slate-900 tracking-tighter italic">{day.dateLabel}</p>
                    </div>
                  ))}
                </div>

                {/* Grid Body */}
                <div className="bg-slate-50/20">
                  {Object.entries(roomsBySpecialty).map(([specialty, specialtyRooms]) => (
                    <div key={specialty} className="contents">
                      <div className="col-span-full bg-blue-50/40 px-8 py-3 border-y border-slate-100/50 flex justify-between items-center sticky left-0 z-30">
                        <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em]">{specialty}</h4>
                      </div>
                      
                      {specialtyRooms.map(room => (
                        <div key={room.roomId} className="grid grid-cols-[160px_repeat(7,1fr)] min-h-[160px] border-b border-slate-100/50 bg-white">
                          {/* Room Column */}
                          <div className="p-6 border-r border-slate-100 bg-white flex flex-col justify-center sticky left-0 z-20 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mã phòng</span>
                            <h5 className="text-2xl font-black text-slate-900 italic tracking-tighter leading-none">{room.roomCode}</h5>
                          </div>

                          {/* Day Columns */}
                          {weekDays.map(day => (
                            <div key={`${room.roomId}-${day.dateStr}`} className="border-r border-slate-100 last:border-none flex flex-col p-2 gap-2 bg-white/50">
                              {['MORNING', 'AFTERNOON'].map((shift: any) => {
                                const assignment = allVisibleSchedules.find(s => s.scheduleDate === day.dateStr && s.shift === shift && s.roomId === room.roomId);
                                const isCompatible = draggingDoctor?.specialtyId === room.specialtyId || draggingDoctor?.specialtyId === 0;
                                const isDimmed = draggingDoctor && !isCompatible;

                                return (
                                  <div 
                                    key={shift}
                                    onDragOver={(e) => { if (isCompatible) e.preventDefault(); }}
                                    onDrop={() => handleDrop(day.dateStr, shift, room.roomId)}
                                    className={`flex-1 rounded-2xl border-2 transition-all duration-300 relative group/cell flex flex-col p-1 ${
                                      assignment 
                                        ? (assignment.isNew ? 'border-emerald-200 bg-emerald-50/30' : 'border-blue-100 bg-blue-50/20')
                                        : 'border-transparent'
                                    } ${isDimmed ? 'opacity-10 grayscale pointer-events-none' : ''} ${
                                      draggingDoctor && isCompatible ? 'border-dashed border-blue-400 bg-blue-50/50 cursor-copy' : ''
                                    }`}
                                  >
                                    <span className="absolute top-1 right-2 text-[6px] font-black text-slate-300 uppercase z-0">{shift === 'MORNING' ? 'AM' : 'PM'}</span>
                                    
                                    {assignment ? (
                                      <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }} 
                                        animate={{ opacity: 1, scale: 1 }} 
                                        className={`flex-1 rounded-xl p-3 shadow-md relative group/assign flex flex-col justify-center z-10 ${
                                          assignment.isNew ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                                        }`}
                                      >
                                        <p className="text-[10px] font-black uppercase leading-tight text-center">{assignment.doctorName}</p>
                                        {assignment.isNew && <p className="text-[7px] font-bold text-emerald-100 uppercase mt-1 text-center">Chờ lưu</p>}
                                        <button 
                                          onClick={() => handleDeleteAssignment(assignment)} 
                                          className="absolute -top-1 -right-1 w-6 h-6 bg-slate-900/40 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/assign:opacity-100 transition-all shadow-lg"
                                        >
                                          <X size={12} className="text-white" />
                                        </button>
                                      </motion.div>
                                    ) : (
                                      <div className="flex-1 flex items-center justify-center">
                                        {draggingDoctor && isCompatible && <Plus className="text-blue-500 w-5 h-5 animate-pulse" />}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <AnimatePresence>
        {draggingDoctor && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-10 py-5 rounded-full shadow-2xl z-[100] flex items-center gap-5 border border-white/10">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"><UserIcon size={20} /></div>
            <div className="text-center">
              <p className="text-sm font-black uppercase">{draggingDoctor.fullName}</p>
              <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-1 italic">Kéo vào: {draggingDoctor.specialtyName}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorSchedulePage;


