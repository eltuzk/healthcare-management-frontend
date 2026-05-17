import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Search, 
  User, 
  X, 
  Save, 
  Clock, 
  MapPin,
  Trash2,
  Filter,
  UserCheck
} from 'lucide-react';
import { getDoctors, getAccounts } from '../services/staffService';
import { getRooms } from '../services/roomService';
import { getDoctorSchedules, createDoctorSchedule, deleteDoctorSchedule } from '../services/scheduleService';
import toast from 'react-hot-toast';

interface Doctor {
  doctorId: number;
  fullName: string;
  specialtyName: string;
  specialtyId: number;
}

interface Room {
  roomId: number;
  roomCode: string;
  roomName: string;
  specialtyId: number;
  specialtyName: string;
}

interface Assignment {
  doctorScheduleId?: number;
  doctorId: number;
  doctorName: string;
  roomId: number;
  scheduleDate: string;
  shift: 'MORNING' | 'AFTERNOON';
  isPending?: boolean;
}

const formatLocalISO = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const DoctorSchedulePage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Selection Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; shift: 'MORNING' | 'AFTERNOON'; roomId: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<number | null>(null);

  const userRole = localStorage.getItem('role') || '';
  const isAdmin = userRole.includes('ADMIN');

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const startOfWeek = new Date(currentDate);
      const dayOfWeek = currentDate.getDay();
      const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startDate = formatLocalISO(startOfWeek);
      const endDate = formatLocalISO(endOfWeek);

      const [docsRes, roomsRes, schedRes, accountsRes] = await Promise.allSettled([
        getDoctors(0, 1000),
        getRooms(),
        getDoctorSchedules({ startDate, endDate }),
        getAccounts(0, 1000)
      ]);

      let docs: Doctor[] = [];
      if (docsRes.status === 'fulfilled') {
        const val: any = docsRes.value;
        docs = val?.content || val?.data?.content || (Array.isArray(val) ? val : []);
      }

      // Fallback to accounts if doctors list is empty
      if (docs.length === 0 && accountsRes.status === 'fulfilled') {
        const val: any = accountsRes.value;
        const accounts = val?.content || val?.data?.content || (Array.isArray(val) ? val : []);
        docs = accounts
          .filter((acc: any) => (acc.roleName || '').includes('DOCTOR') && acc.actorId)
          .map((acc: any) => ({
            doctorId: acc.actorId,
            fullName: acc.fullName,
            specialtyName: acc.specialtyName || 'Chưa xác định',
            specialtyId: acc.specialtyId || 0
          }));
      }
      setDoctors(docs);

      if (roomsRes.status === 'fulfilled') {
        setRooms(roomsRes.value as Room[]);
      }

      if (schedRes.status === 'fulfilled') {
        setAssignments((schedRes.value as any[]).map(s => ({
          doctorScheduleId: s.doctorScheduleId,
          doctorId: s.doctorId,
          doctorName: s.doctorName,
          roomId: s.roomId,
          scheduleDate: s.scheduleDate,
          shift: s.shift
        })));
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const weekDays = useMemo(() => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = currentDate.getDay();
    const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push({
        date: day,
        dateStr: formatLocalISO(day),
        label: day.toLocaleDateString('vi-VN', { weekday: 'short' }),
        dayNum: day.getDate()
      });
    }
    return days;
  }, [currentDate]);

  const handleOpenModal = (date: string, shift: 'MORNING' | 'AFTERNOON', roomId: number) => {
    if (isAdmin) return;
    setSelectedSlot({ date, shift, roomId });
    setIsModalOpen(true);
  };

  const handleAssignDoctor = (doctor: Doctor) => {
    if (!selectedSlot) return;

    const room = rooms.find(r => r.roomId === selectedSlot.roomId);
    const isCompatible = doctor.specialtyId === room?.specialtyId || doctor.specialtyId === 0 || !room?.specialtyId;

    if (!isCompatible && !window.confirm(`Bác sĩ này có chuyên khoa (${doctor.specialtyName}) khác với chuyên khoa của phòng (${room?.specialtyName}). Bạn vẫn muốn phân công?`)) {
      return;
    }

    // Check if doctor already has a shift on this day
    const existing = assignments.find(a => a.scheduleDate === selectedSlot.date && a.shift === selectedSlot.shift && a.doctorId === doctor.doctorId);
    if (existing) {
      toast.error('Bác sĩ này đã có lịch trực trong ca này!');
      return;
    }

    const newAssignment: Assignment = {
      doctorId: doctor.doctorId,
      doctorName: doctor.fullName,
      roomId: selectedSlot.roomId,
      scheduleDate: selectedSlot.date,
      shift: selectedSlot.shift,
      isPending: true
    };

    setAssignments(prev => [...prev, newAssignment]);
    setIsModalOpen(false);
    toast.success(`Đã thêm tạm thời: ${doctor.fullName}`);
  };

  const handleRemoveAssignment = async (assignment: Assignment) => {
    if (isAdmin) return;

    if (assignment.isPending) {
      setAssignments(prev => prev.filter(a => a !== assignment));
      return;
    }

    if (window.confirm(`Xóa lịch trực của bác sĩ ${assignment.doctorName}?`)) {
      try {
        await deleteDoctorSchedule(assignment.doctorScheduleId!);
        setAssignments(prev => prev.filter(a => a.doctorScheduleId !== assignment.doctorScheduleId));
        toast.success('Đã xóa lịch trực');
      } catch (error) {
        toast.error('Lỗi khi xóa lịch trực');
      }
    }
  };

  const handleSaveAll = async () => {
    const pending = assignments.filter(a => a.isPending);
    if (pending.length === 0) {
      toast.success('Không có thay đổi nào cần lưu');
      return;
    }

    setIsSaving(true);
    try {
      await Promise.all(pending.map(a => createDoctorSchedule({
        doctorId: a.doctorId,
        roomId: a.roomId,
        scheduleDate: a.scheduleDate,
        shift: a.shift,
        maxCapacity: 20
      })));
      toast.success('Đã lưu tất cả thay đổi');
      fetchData();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu một số lịch trực');
      fetchData();
    } finally {
      setIsSaving(false);
    }
  };

  const filteredDoctors = doctors.filter(d => 
    (d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
     d.doctorId.toString() === searchQuery) &&
    (!specialtyFilter || d.specialtyId === specialtyFilter)
  );

  const [gridSpecialtyFilter, setGridSpecialtyFilter] = useState<string>('ALL');

  const groupedRooms = useMemo(() => {
    const filtered = rooms.filter(r => 
      gridSpecialtyFilter === 'ALL' || r.specialtyName === gridSpecialtyFilter
    );
    const groups: { [key: string]: Room[] } = {};
    filtered.forEach(room => {
      const spec = room.specialtyName || 'Khác';
      if (!groups[spec]) groups[spec] = [];
      groups[spec].push(room);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [rooms, gridSpecialtyFilter]);

  const allGridSpecialties = useMemo(() => {
    const specs = new Set<string>();
    rooms.forEach(r => { if (r.specialtyName) specs.add(r.specialtyName); });
    return Array.from(specs).sort();
  }, [rooms]);

  const doctorSpecialties = useMemo(() => {
    const map = new Map();
    doctors.forEach(d => map.set(d.specialtyId, d.specialtyName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [doctors]);

  if (loading && doctors.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden font-body">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Điều phối Lịch trực</h1>
            <p className="text-sm text-slate-500">Quản lý ca trực và phân công bác sĩ vào phòng khám</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Specialty Filter */}
          <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
            <Filter size={16} className="text-slate-400" />
            <select 
              value={gridSpecialtyFilter}
              onChange={(e) => setGridSpecialtyFilter(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-slate-700 outline-none focus:ring-0 cursor-pointer"
            >
              <option value="ALL">Tất cả Chuyên khoa</option>
              {allGridSpecialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Week Selector */}
          <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
            <button 
              onClick={() => {
                const d = new Date(currentDate);
                d.setDate(d.getDate() - 7);
                setCurrentDate(d);
              }}
              className="p-2 hover:bg-white rounded-full transition-all text-slate-600"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 font-semibold text-slate-700 min-w-[180px] text-center text-sm">
              Tuần {weekDays[0].dayNum} - {weekDays[6].dayNum} Tháng {(currentDate.getMonth() + 1)}
            </span>
            <button 
              onClick={() => {
                const d = new Date(currentDate);
                d.setDate(d.getDate() + 7);
                setCurrentDate(d);
              }}
              className="p-2 hover:bg-white rounded-full transition-all text-slate-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {!isAdmin && (
            <button
              onClick={handleSaveAll}
              disabled={isSaving || assignments.filter(a => a.isPending).length === 0}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 text-sm"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <Save size={20} />
              )}
              LƯU THAY ĐỔI
              {assignments.filter(a => a.isPending).length > 0 && (
                <span className="ml-1 bg-white text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                  {assignments.filter(a => a.isPending).length}
                </span>
              )}
            </button>
          )}

          {isAdmin && (
            <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-full border border-amber-100 flex items-center gap-2 font-medium text-sm">
              <Clock size={16} />
              Chế độ xem
            </div>
          )}
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="min-w-[1200px] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="sticky left-0 bg-slate-50 z-20 w-64 p-6 text-left font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">
                  Chuyên khoa / Phòng
                </th>
                {weekDays.map(day => (
                  <th key={day.dateStr} className="p-4 border-r border-slate-200 last:border-r-0">
                    <div className={`flex flex-col items-center py-2 rounded-2xl ${day.dateStr === new Date().toISOString().split('T')[0] ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200' : ''}`}>
                      <span className="text-xs font-bold uppercase opacity-60">{day.label}</span>
                      <span className="text-2xl font-black">{day.dayNum}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groupedRooms.map(([specialtyName, roomList]) => (
                <React.Fragment key={specialtyName}>
                  {/* Specialty Header Row */}
                  <tr className="bg-slate-100/80 border-y border-slate-200">
                    <td colSpan={8} className="p-3 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                        <span className="font-black text-slate-700 uppercase tracking-widest text-sm">{specialtyName}</span>
                        <span className="bg-white/50 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-400 border border-slate-200">
                          {roomList.length} PHÒNG
                        </span>
                      </div>
                    </td>
                  </tr>

                  {roomList.map((room, idx) => (
                    <tr key={room.roomId} className={`group ${idx % 2 === 1 ? 'bg-slate-50/30' : ''}`}>
                      <td className="sticky left-0 bg-white group-hover:bg-indigo-50 transition-colors z-20 p-6 border-r border-slate-200 border-b border-slate-100 last:border-b-0 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 p-2.5 rounded-2xl text-indigo-600">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <div className="font-black text-slate-800 text-lg leading-tight">{room.roomCode}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter truncate w-32">{room.roomName}</div>
                          </div>
                        </div>
                      </td>

                      {weekDays.map(day => (
                        <td key={`${room.roomId}-${day.dateStr}`} className="p-3 border-r border-slate-200 border-b border-slate-100 last:border-r-0 group-hover:bg-slate-50/50 transition-colors">
                          <div className="flex flex-col gap-3">
                            <ShiftSlot 
                              shift="MORNING"
                              day={day}
                              room={room}
                              assignment={assignments.find(a => a.scheduleDate === day.dateStr && a.shift === 'MORNING' && a.roomId === room.roomId)}
                              onAssign={() => handleOpenModal(day.dateStr, 'MORNING', room.roomId)}
                              onRemove={handleRemoveAssignment}
                              isAdmin={isAdmin}
                            />
                            
                            <ShiftSlot 
                              shift="AFTERNOON"
                              day={day}
                              room={room}
                              assignment={assignments.find(a => a.scheduleDate === day.dateStr && a.shift === 'AFTERNOON' && a.roomId === room.roomId)}
                              onAssign={() => handleOpenModal(day.dateStr, 'AFTERNOON', room.roomId)}
                              onRemove={handleRemoveAssignment}
                              isAdmin={isAdmin}
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-white/20">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100">
                  <UserCheck size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Phân công Bác sĩ</h2>
                  <p className="text-slate-500 font-medium">Chọn một bác sĩ cho ca {selectedSlot?.shift === 'MORNING' ? 'Sáng' : 'Chiều'} tại {rooms.find(r => r.roomId === selectedSlot?.roomId)?.roomCode}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 hover:bg-slate-200 rounded-2xl transition-all text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Filters */}
            <div className="p-6 bg-white flex items-center gap-4 border-b border-slate-50">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder="Tìm kiếm bác sĩ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-600/20 focus:bg-white transition-all outline-none"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-hide">
                <button
                  onClick={() => setSpecialtyFilter(null)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${!specialtyFilter ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  Tất cả
                </button>
                {doctorSpecialties.map(spec => (
                  <button
                    key={spec.id}
                    onClick={() => setSpecialtyFilter(spec.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${specialtyFilter === spec.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {spec.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body - Doctor List */}
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-2 gap-6 bg-slate-50/30">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doc => {
                  const room = rooms.find(r => r.roomId === selectedSlot?.roomId);
                  const isCompatible = doc.specialtyId === room?.specialtyId || doc.specialtyId === 0 || !room?.specialtyId;

                  return (
                    <button
                      key={doc.doctorId}
                      onClick={() => handleAssignDoctor(doc)}
                      className={`flex items-center gap-4 p-5 rounded-[28px] border-2 transition-all text-left group relative ${
                        isCompatible 
                          ? 'bg-white border-slate-100 hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1' 
                          : 'bg-white border-amber-200 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1'
                      }`}
                    >
                      <div className={`p-3 rounded-2xl transition-colors ${
                        isCompatible 
                          ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' 
                          : 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white'
                      }`}>
                        <User size={32} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-slate-800 text-lg truncate">{doc.fullName}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{doc.specialtyName}</div>
                      </div>
                      {!isCompatible && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-amber-100 text-amber-600 text-[10px] font-black rounded-lg uppercase">Sai chuyên khoa</div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-2 py-20 text-center">
                  <User size={64} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-xl font-bold text-slate-400">Không tìm thấy bác sĩ phù hợp</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ShiftSlotProps {
  shift: 'MORNING' | 'AFTERNOON';
  day: any;
  room: Room;
  assignment?: Assignment;
  onAssign: () => void;
  onRemove: (a: Assignment) => void;
  isAdmin: boolean;
}

const ShiftSlot: React.FC<ShiftSlotProps> = ({ shift, assignment, onAssign, onRemove, isAdmin }) => {
  return (
    <div className={`relative min-h-[50px] rounded-2xl border-2 border-dashed transition-all ${
      assignment 
        ? (assignment.isPending ? 'bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-emerald-50/30 border-emerald-100') 
        : 'bg-slate-50 border-slate-100 hover:border-indigo-300 hover:bg-white cursor-pointer'
    }`}
    onClick={() => !assignment && !isAdmin && onAssign()}
    >
      <div className="absolute -top-2 -left-2 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter bg-white border border-slate-200 text-slate-400 shadow-sm">
        {shift === 'MORNING' ? 'Sáng' : 'Chiều'}
      </div>

      {assignment ? (
        <div className="p-2 flex items-center justify-between gap-2 h-full">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`p-1.5 rounded-xl ${assignment.isPending ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'}`}>
              <User size={14} />
            </div>
            <div className="truncate">
              <div className="text-[11px] font-black text-slate-800 leading-tight truncate">{assignment.doctorName}</div>
              {assignment.isPending && (
                <span className="text-[9px] font-bold text-indigo-500 uppercase flex items-center gap-1">
                  <Clock size={8} /> Chờ lưu
                </span>
              )}
            </div>
          </div>
          
          {!isAdmin && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRemove(assignment);
              }}
              className="p-1.5 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-colors group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ) : (
        <div className="h-[46px] flex items-center justify-center transition-all group/plus">
          {!isAdmin && <Plus size={24} className="text-slate-200 group-hover/plus:text-indigo-400 group-hover/plus:scale-125 transition-all" />}
        </div>
      )}
    </div>
  );
};

export default DoctorSchedulePage;
