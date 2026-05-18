import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Search, User, Plus, Calendar as CalendarIcon, 
  Clock, CheckCircle2, X, ArrowRight, UserPlus, Info
} from 'lucide-react';
import { searchPatient, createPatient } from '../services/patientService';
import { getConsultationFees } from '../services/consultationFeeService';
import { getDoctorSchedules, createWalkInAppointment } from '../services/scheduleService';

// Timezone-safe local date string helper
const formatLocalISO = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const AppointmentBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Data States
  const [consultationFees, setConsultationFees] = useState<any[]>([]);
  const [availableSchedules, setAvailableSchedules] = useState<any[]>([]);
  
  // Selection States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(() => formatLocalISO(new Date()));
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  
  // Form State
  const [visitReason, setVisitReason] = useState('Khám mới');
  const [showCreatePatient, setShowCreatePatient] = useState(false);
  const [newPatient, setNewPatient] = useState({
    fullName: '', phone: '', identityNum: '', gender: 'MALE', dateOfBirth: '', address: ''
  });

  useEffect(() => {
    fetchFees();
  }, []);

  // Fetch schedules whenever date or fee changes
  useEffect(() => {
    fetchSchedules();
  }, [selectedDate, selectedFee]);

  const fetchFees = async () => {
    try {
      const data = await getConsultationFees();
      setConsultationFees(data);
    } catch (err) {
      toast.error('Không thể tải danh sách loại khám');
    }
  };

  const fetchSchedules = async () => {
    try {
      const params: any = { date: selectedDate };
      const data = await getDoctorSchedules(params);
      
      // Filter by specialty if a fee is selected
      let filtered = data;
      if (selectedFee) {
        filtered = data.filter((s: any) => s.specialtyId === selectedFee.specialtyId);
      }
      setAvailableSchedules(filtered);
    } catch (err) {
      console.error('Lỗi tải lịch trực:', err);
    }
  };

  const handleSearchPatient = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const patient = await searchPatient(searchQuery);
      setSelectedPatient(patient);
      toast.success('Đã chọn bệnh nhân: ' + patient.fullName);
    } catch (err) {
      toast.error('Không tìm thấy bệnh nhân. Vui lòng tạo hồ sơ mới.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const patient = await createPatient(newPatient);
      setSelectedPatient(patient);
      setShowCreatePatient(false);
      // Reset form
      setNewPatient({
        fullName: '', phone: '', identityNum: '', gender: 'MALE', dateOfBirth: '', address: ''
      });
      toast.success('Đã tạo hồ sơ bệnh nhân thành công!');
    } catch (err: any) {
      toast.error('Lỗi tạo hồ sơ: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedPatient || !selectedSchedule) {
      toast.error('Vui lòng chọn bệnh nhân và bác sĩ');
      return;
    }
    setSubmitting(true);
    try {
      await createWalkInAppointment({
        patientId: selectedPatient.patientId,
        doctorScheduleId: selectedSchedule.doctorScheduleId,
        receivedAmount: selectedFee.price,
        visitReason: visitReason,
        initialSymptoms: visitReason
      });
      toast.success('Đã đăng ký và thu tiền thành công!');
      navigate('/patients');
    } catch (err: any) {
      toast.error('Lỗi tiếp nhận: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedPatient(null);
    setSelectedFee(null);
    setSelectedSchedule(null);
    setSearchQuery('');
    setSelectedDate(formatLocalISO(new Date()));
    setVisitReason('Khám mới');
  };

  // Generate the next 7 days in local time for visual selection
  const next7Days = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      list.push({
        dateStr: formatLocalISO(d),
        dayName: d.toLocaleDateString('vi-VN', { weekday: 'short' }),
        dayNum: d.getDate(),
        monthName: `T${d.getMonth() + 1}`
      });
    }
    return list;
  }, []);

  return (
    <div className="flex flex-col relative animate-fade-in pb-6 text-slate-800">
      
      {/* Header Area */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            Đăng ký Khám bệnh
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-0.5">Tiếp nhận bệnh nhân, chọn ca trực bác sĩ & hoàn tất thu tiền</p>
        </div>
        <div className="flex gap-2 self-stretch sm:self-auto">
          <button 
            onClick={() => navigate('/patients')}
            className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            Bảng điều phối
          </button>
          <button 
            onClick={resetForm}
            className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
          >
            Làm mới form
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Columns (5/12): Patient Search & Service Selection */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Card 1: Patient Selection */}
          <div className="bg-white rounded-2xl p-5 border border-slate-150 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <User size={14} className="text-slate-400" />
                Thông tin bệnh nhân
              </h3>
              <button 
                onClick={() => setShowCreatePatient(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg transition-all"
              >
                <UserPlus size={14} />
                Tạo hồ sơ mới
              </button>
            </div>
            
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4.5 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="SĐT hoặc CCCD bệnh nhân..." 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-800 transition-all outline-none"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSearchPatient()}
                />
              </div>
              <button 
                onClick={handleSearchPatient}
                disabled={loading || !searchQuery.trim()}
                className="bg-slate-800 text-white px-4 rounded-xl font-bold text-sm hover:bg-slate-900 transition-all disabled:opacity-30 disabled:hover:bg-slate-800 flex items-center justify-center"
              >
                {loading ? '...' : 'Tìm'}
              </button>
            </div>

            {selectedPatient ? (
              <div className="bg-gradient-to-br from-slate-800 to-slate-950 rounded-xl p-5 text-white shadow-md relative overflow-hidden animate-in fade-in duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 blur-xl"></div>
                <div className="relative z-10">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-display font-black text-lg border border-white/20">
                      {selectedPatient.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-base leading-snug">{selectedPatient.fullName}</h4>
                      <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mt-0.5">Mã BN: {selectedPatient.patientId}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedPatient(null)} 
                      className="ml-auto w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-3 mt-4 pt-4 border-t border-white/10 text-xs">
                    <div>
                      <p className="text-white/40 font-bold uppercase tracking-widest text-[9px]">Giới tính</p>
                      <p className="text-sm font-semibold mt-0.5">{selectedPatient.gender === 'MALE' ? 'Nam' : selectedPatient.gender === 'FEMALE' ? 'Nữ' : 'Khác'}</p>
                    </div>
                    <div>
                      <p className="text-white/40 font-bold uppercase tracking-widest text-[9px]">Số điện thoại</p>
                      <p className="text-sm font-semibold mt-0.5">{selectedPatient.phone || 'Chưa cập nhật'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-white/40 font-bold uppercase tracking-widest text-[9px]">Số định danh (CCCD)</p>
                      <p className="text-sm font-semibold mt-0.5 tracking-wider">{selectedPatient.identityNum || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-50/50">
                <User size={32} className="opacity-30" />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Chưa chọn bệnh nhân</p>
              </div>
            )}
          </div>

          {/* Card 2: Service Selection */}
          <div className="bg-white rounded-2xl p-5 border border-slate-150 shadow-sm flex flex-col flex-1">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <Info size={14} />
              Dịch vụ khám yêu cầu
            </h3>
            
            <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
              {consultationFees.map(fee => (
                <div 
                  key={fee.feeId}
                  onClick={() => { setSelectedFee(fee); setSelectedSchedule(null); }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden group ${
                    selectedFee?.feeId === fee.feeId 
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' 
                      : 'border-slate-100 hover:border-slate-350 bg-slate-50/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5 relative z-10">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      selectedFee?.feeId === fee.feeId ? 'bg-indigo-150 text-indigo-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {fee.specialtyName}
                    </span>
                    <span className={`text-base font-black ${selectedFee?.feeId === fee.feeId ? 'text-indigo-600' : 'text-slate-800'}`}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fee.price)}
                    </span>
                  </div>
                  <p className={`text-sm font-bold relative z-10 ${selectedFee?.feeId === fee.feeId ? 'text-indigo-950' : 'text-slate-700'}`}>
                    {fee.feeName}
                  </p>
                  {selectedFee?.feeId === fee.feeId && (
                    <div className="absolute -right-3 -bottom-3 text-indigo-600/10">
                       <CheckCircle2 size={48} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Columns (7/12): Booking Date & Scheduled Doctors */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-150 shadow-sm flex flex-col p-6">
           
           {/* Date Picker Section */}
           <div className="mb-6 pb-5 border-b border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Ngày tiếp nhận khám</h3>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                
                {/* Horizontal Date Picker strip */}
                <div className="flex gap-2 overflow-x-auto pb-1 max-w-full custom-scrollbar flex-1">
                  {next7Days.map(item => {
                    const isSelected = selectedDate === item.dateStr;
                    return (
                      <button
                        key={item.dateStr}
                        type="button"
                        onClick={() => { setSelectedSchedule(null); setSelectedDate(item.dateStr); }}
                        className={`flex-shrink-0 flex flex-col items-center justify-center w-14 py-2 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-slate-900 border-slate-900 text-white shadow'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`text-[8px] font-black uppercase ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                          {item.dayName}
                        </span>
                        <span className="text-base font-display font-black leading-none mt-1">
                          {item.dayNum}
                        </span>
                        <span className={`text-[8px] font-bold ${isSelected ? 'text-white/40' : 'text-slate-400'} mt-0.5`}>
                          {item.monthName}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Direct Calendar Pick */}
                <div className="flex items-center gap-2 self-stretch sm:self-auto pl-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0">
                  <div className="relative w-full sm:w-auto">
                    <CalendarIcon size={14} className="text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      value={selectedDate}
                      min={formatLocalISO(new Date())}
                      onChange={e => {
                        setSelectedSchedule(null);
                        setSelectedDate(e.target.value);
                      }}
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-700 outline-none transition-all cursor-pointer w-full sm:w-36"
                    />
                  </div>
                </div>

              </div>
           </div>

           {/* Doctor Schedule Selection */}
           <div className="mb-6 flex-1 flex flex-col min-h-[300px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Bác sĩ trực trong ngày</h3>
                {selectedFee && (
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                    Khoa: {selectedFee.specialtyName}
                  </span>
                )}
              </div>
              
              {!selectedFee ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded-xl gap-2 py-10 bg-slate-50/20">
                   <CalendarIcon size={28} className="opacity-30" />
                   <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Chọn loại khám ở cột trái để xem bác sĩ trực</p>
                </div>
              ) : availableSchedules.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded-xl gap-2 py-10 bg-slate-50/20">
                   <Clock size={28} className="opacity-30" />
                   <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Không có bác sĩ trực trong ngày này</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableSchedules.map(s => {
                    const isSelected = selectedSchedule?.doctorScheduleId === s.doctorScheduleId;
                    const percentage = Math.min((s.currentBookingCount / s.maxCapacity) * 100, 100);
                    return (
                      <button 
                        key={s.doctorScheduleId}
                        onClick={() => setSelectedSchedule(s)}
                        className={`p-4.5 rounded-xl border-2 text-left transition-all relative overflow-hidden group shadow-sm ${
                          isSelected 
                            ? 'bg-slate-900 border-slate-900 text-white shadow scale-[1.01]' 
                            : 'bg-white border-slate-100 hover:border-indigo-400 text-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                           <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all ${
                              isSelected ? 'bg-white/10 border-white/20' : 'bg-indigo-50 border-indigo-150 text-indigo-600'
                           }`}>
                              <Clock size={18} />
                           </div>
                           <div className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider ${
                              isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'
                           }`}>
                              {s.shift === 'MORNING' ? 'CA SÁNG' : 'CA CHIỀU'}
                           </div>
                        </div>
                        
                        <p className={`font-black text-base ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {s.doctorName}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-1.5 text-xs">
                          <p className={`font-semibold ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                            Phòng: <span className={isSelected ? 'text-white font-bold' : 'text-indigo-600 font-bold'}>{s.roomCode}</span>
                          </p>
                          <span className="w-1 h-1 rounded-full bg-slate-350"></span>
                          <p className={`font-semibold ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                            Đã đặt: <span className={isSelected ? 'text-white font-bold' : 'text-indigo-600 font-bold'}>{s.currentBookingCount}/{s.maxCapacity}</span>
                          </p>
                        </div>
                        
                        {/* Booking Capacity Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-1 mt-3">
                          <div 
                            className={`h-1 rounded-full transition-all duration-300 ${isSelected ? 'bg-white' : 'bg-indigo-600'}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        
                        {isSelected && (
                          <div className="absolute -right-4 -bottom-4 text-white/5 blur-sm">
                             <CheckCircle2 size={80} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
           </div>

           {/* Ghi chú tiếp nhận */}
           <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Ghi chú tiếp nhận khám</h3>
              <div className="relative">
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition-all outline-none h-20 resize-none"
                  placeholder="Triệu chứng lâm sàng, lý do khám..."
                  value={visitReason}
                  onChange={e => setVisitReason(e.target.value)}
                />
              </div>
           </div>
        </div>

      </div>

      {/* Modern Sticky Footer Summary */}
      <div className="sticky bottom-0 mt-6 border border-slate-200 px-6 py-4 bg-white/95 backdrop-blur-md flex justify-between items-center z-20 shadow-[0_-10px_30px_-5px_rgba(0,0,0,0.03),0_10px_20px_-5px_rgba(0,0,0,0.02)] rounded-2xl">
         <div className="w-full flex justify-between items-center gap-6">
           
           <div className="flex items-center gap-4 hidden md:flex">
             {selectedPatient ? (
               <>
                 <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-lg shadow-sm">
                   {selectedPatient.fullName.charAt(0)}
                 </div>
                 <div>
                   <p className="font-bold text-sm text-slate-800 leading-tight mb-1">{selectedPatient.fullName}</p>
                   <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 font-bold rounded text-[9px] uppercase tracking-wider">{selectedFee?.feeName || 'Chưa chọn dịch vụ'}</span>
                      {selectedSchedule && (
                        <span className="font-semibold">BS. {selectedSchedule.doctorName} (Phòng {selectedSchedule.roomCode})</span>
                      )}
                   </div>
                 </div>
               </>
             ) : (
               <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-8 h-8 rounded-lg border border-dashed border-slate-300 flex items-center justify-center">
                    <Plus size={14} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider">Đang chờ nhập thông tin bệnh nhân...</p>
               </div>
             )}
           </div>

           <div className="flex gap-6 w-full md:w-auto justify-between md:justify-end items-center">
              <div className="flex flex-col items-end justify-center">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">TỔNG PHÍ THU QUẦY</p>
                 <p className="text-2xl font-black text-indigo-600 tracking-tight">
                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedFee?.price || 0)}
                 </p>
              </div>
              
              <button 
                onClick={handleConfirmBooking}
                disabled={submitting || !selectedPatient || !selectedSchedule}
                className="px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:bg-indigo-700 transition-all disabled:opacity-30 disabled:hover:bg-indigo-600 active:scale-98 flex items-center justify-center gap-2 group"
              >
                {submitting ? (
                  'ĐANG XỬ LÝ...'
                ) : (
                  <>
                    TIẾP ĐÓN & THU TIỀN
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
           </div>
           
         </div>
      </div>

      {/* Beautiful Redesigned Patient Creation Modal */}
      {showCreatePatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCreatePatient(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden p-6 animate-in zoom-in-95 duration-200">
             
             <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <UserPlus size={20} className="text-indigo-600" />
                  Tạo hồ sơ bệnh nhân mới
                </h2>
                <button 
                  onClick={() => setShowCreatePatient(false)} 
                  className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
                >
                   <X size={16} />
                </button>
             </div>
             
             <form onSubmit={handleCreatePatient} className="space-y-4">
                
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Họ và tên bệnh nhân <span className="text-red-500">*</span></label>
                   <input 
                     required 
                     type="text"
                     placeholder="Ví dụ: Nguyễn Văn An" 
                     className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 transition-all outline-none" 
                     value={newPatient.fullName} 
                     onChange={e => setNewPatient({...newPatient, fullName: e.target.value})} 
                   />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Số điện thoại <span className="text-red-500">*</span></label>
                      <input 
                        required 
                        type="tel"
                        placeholder="Ví dụ: 0912345678" 
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 transition-all outline-none" 
                        value={newPatient.phone} 
                        onChange={e => setNewPatient({...newPatient, phone: e.target.value})} 
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Giới tính <span className="text-red-500">*</span></label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 transition-all outline-none" 
                        value={newPatient.gender} 
                        onChange={e => setNewPatient({...newPatient, gender: e.target.value})}
                      >
                         <option value="MALE">Nam</option>
                         <option value="FEMALE">Nữ</option>
                         <option value="OTHER">Khác</option>
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Số định danh / CCCD</label>
                      <input 
                        type="text"
                        placeholder="Số căn cước công dân" 
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 transition-all outline-none" 
                        value={newPatient.identityNum} 
                        onChange={e => setNewPatient({...newPatient, identityNum: e.target.value})} 
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Ngày sinh</label>
                      <input 
                        type="date"
                        max={formatLocalISO(new Date())}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 transition-all outline-none" 
                        value={newPatient.dateOfBirth} 
                        onChange={e => setNewPatient({...newPatient, dateOfBirth: e.target.value})} 
                      />
                   </div>
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Địa chỉ thường trú</label>
                   <input 
                     type="text"
                     placeholder="Số nhà, đường, phường/xã, quận/huyện..." 
                     className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 transition-all outline-none" 
                     value={newPatient.address} 
                     onChange={e => setNewPatient({...newPatient, address: e.target.value})} 
                   />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowCreatePatient(false)}
                    className="flex-1 border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting} 
                    className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all shadow-sm"
                  >
                     {submitting ? 'Đang tạo...' : 'Tạo hồ sơ mới'}
                  </button>
                </div>

             </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AppointmentBookingPage;
