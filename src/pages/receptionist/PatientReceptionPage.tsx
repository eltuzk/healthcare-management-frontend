import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Plus, Clock, CheckCircle2, User,
  ArrowRight, RefreshCcw, Search, Calendar
} from 'lucide-react';
import { getAppointments, checkInAppointment } from '../../services/scheduleService';

const PatientReceptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCheckIn = async (appointmentId: any) => {
    try {
      await checkInAppointment(appointmentId);
      toast.success('Đã tiếp nhận bệnh nhân vào phòng khám!');
      fetchDailyQueue();
    } catch (err: any) {
      toast.error('Lỗi tiếp nhận: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchDailyQueue();
    const interval = setInterval(fetchDailyQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDailyQueue = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const data = await getAppointments({ date: today });
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi tải danh sách hàng đợi:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(app =>
    app.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.appointmentCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColumn = (status: string) => {
    return filteredAppointments.filter(app => {
      if (status === 'WAITING') return app.status === 'CONFIRMED' || app.status === 'CHECKED_IN' || app.status === 'PENDING';
      if (status === 'IN_PROGRESS') return app.status === 'IN_PROGRESS';
      if (status === 'COMPLETED') return app.status === 'COMPLETED';
      return false;
    });
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col animate-fade-in pb-4">

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="font-body text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Bảng điều phối trực tuyến</span>
          </div>
          <h1 className="font-display text-[2.5rem] font-black text-slate-900 tracking-tight leading-none">Điều phối Tiếp nhận</h1>
          <p className="font-body text-slate-400 mt-2 font-bold flex items-center gap-2">
            <Calendar size={16} />
            Hôm nay, {new Date().toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm tên hoặc mã BN..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-transparent focus:border-primary rounded-[20px] font-bold text-slate-700 shadow-sm transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={fetchDailyQueue}
            className="p-4 bg-white border-2 border-slate-100 rounded-[20px] text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm active:scale-95"
          >
            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden min-h-0">

        {/* Column: Waiting */}
        <div className="flex flex-col bg-slate-50/50 rounded-[40px] p-6 border border-slate-100 shadow-inner overflow-hidden">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500 bg-opacity-10 shadow-sm">
                <Clock size={20} className="text-amber-500" />
              </div>
              <h3 className="font-display font-black text-slate-800 uppercase tracking-wider text-sm">Đã check-in</h3>
            </div>
            <span className="bg-white text-slate-500 font-black text-xs px-3 py-1 rounded-full border border-slate-200">
              {getStatusColumn('WAITING').length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {getStatusColumn('WAITING').map((app) => (
              <PatientCard key={app.appointmentId} appointment={app} onCheckIn={handleCheckIn} />
            ))}
            {getStatusColumn('WAITING').length === 0 && <EmptyState text="Không có bệnh nhân chờ" />}
          </div>
        </div>

        {/* Column: In Progress */}
        <div className="flex flex-col bg-slate-50/50 rounded-[40px] p-6 border border-slate-100 shadow-inner overflow-hidden">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary bg-opacity-10 shadow-sm">
                <RefreshCcw size={20} className="text-primary" />
              </div>
              <h3 className="font-display font-black text-slate-800 uppercase tracking-wider text-sm">Đang khám</h3>
            </div>
            <span className="bg-white text-slate-500 font-black text-xs px-3 py-1 rounded-full border border-slate-200">
              {getStatusColumn('IN_PROGRESS').length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {getStatusColumn('IN_PROGRESS').map((app) => (
              <PatientCard key={app.appointmentId} appointment={app} />
            ))}
            {getStatusColumn('IN_PROGRESS').length === 0 && <EmptyState text="Chưa có ca thăm khám nào" />}
          </div>
        </div>

        {/* Column: Completed */}
        <div className="flex flex-col bg-slate-50/50 rounded-[40px] p-6 border border-slate-100 shadow-inner overflow-hidden">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500 bg-opacity-10 shadow-sm">
                <CheckCircle2 size={20} className="text-emerald-500" />
              </div>
              <h3 className="font-display font-black text-slate-800 uppercase tracking-wider text-sm">Đã hoàn thành</h3>
            </div>
            <span className="bg-white text-slate-500 font-black text-xs px-3 py-1 rounded-full border border-slate-200">
              {getStatusColumn('COMPLETED').length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {getStatusColumn('COMPLETED').map((app) => (
              <PatientCard key={app.appointmentId} appointment={app} />
            ))}
            {getStatusColumn('COMPLETED').length === 0 && <EmptyState text="Chưa có ca hoàn thành" />}
          </div>
        </div>

      </div>
    </div>
  );
};

const PatientCard = ({ appointment, onCheckIn }: { appointment: any; onCheckIn?: (id: any) => void }) => (
  <div className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-3">
      <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter ${appointment.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
        }`}>
        {appointment.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chờ thu tiền'}
      </span>
    </div>
    <div className="flex gap-4 items-center mb-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
        <User size={20} />
      </div>
      <div>
        <h4 className="font-display font-black text-slate-800 text-base leading-none mb-1">{appointment.patientName}</h4>
        <p className="font-body text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mã: {appointment.appointmentCode}</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
      <div className="space-y-1">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-wider">Bác sĩ</p>
        <p className="text-xs font-bold text-slate-600 truncate">{appointment.doctorName}</p>
      </div>
      <div className="space-y-1">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-wider">Phòng</p>
        <p className="text-xs font-bold text-slate-600">{appointment.roomCode}</p>
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-primary">
        <Clock size={12} />
        <span className="text-[10px] font-black uppercase">{appointment.appointmentTime || '--:--'}</span>
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight size={14} />
      </div>
    </div>

    {onCheckIn && appointment.status === 'CONFIRMED' && (
      <button
        onClick={() => onCheckIn(appointment.appointmentId)}
        className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2 group/btn"
      >
        <CheckCircle2 size={14} className="group-hover/btn:scale-110 transition-transform" />
        Tiếp nhận bệnh nhân
      </button>
    )}
  </div>
);

const EmptyState = ({ text }: { text: string }) => (
  <div className="py-12 flex flex-col items-center justify-center text-slate-300 gap-3 border-2 border-dashed border-slate-100 rounded-[32px]">
    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
      <User size={24} className="opacity-20" />
    </div>
    <p className="font-body text-xs font-black uppercase tracking-widest">{text}</p>
  </div>
);

export default PatientReceptionPage;
