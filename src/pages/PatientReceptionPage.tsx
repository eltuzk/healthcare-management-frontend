import React, { useState, useEffect } from 'react';
import { getAppointments, checkInAppointment } from '../services/scheduleService';

const PatientReceptionPage: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Walk-in Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableSchedules, setAvailableSchedules] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    identityNum: '',
    doctorScheduleId: '',
    visitReason: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchTodaySchedules();
  }, []);

  const fetchTodaySchedules = async () => {
    try {
      const { getDoctorSchedules } = await import('../services/scheduleService');
      const data = await getDoctorSchedules();
      setAvailableSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi lấy lịch trực:", err);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Tạm thời lấy tất cả appointments, thực tế nên filter theo ngày
      const data = await getAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Lỗi khi lấy danh sách tiếp nhận:", err);
      setError(err.message || 'Không thể tải danh sách cuộc hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (id: number) => {
    try {
      await checkInAppointment(id);
      // Refresh list after check-in
      fetchAppointments();
    } catch (err: any) {
      alert('Lỗi khi tiếp nhận bệnh nhân: ' + err.message);
    }
  };

  const handleAddWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorScheduleId) {
      alert('Vui lòng chọn lịch khám của bác sĩ');
      return;
    }
    setSubmitting(true);
    try {
      const { createWalkInAppointment } = await import('../services/scheduleService');
      await createWalkInAppointment({
        fullName: formData.fullName,
        phone: formData.phone,
        identityNum: formData.identityNum,
        doctorScheduleId: Number(formData.doctorScheduleId),
        visitReason: formData.visitReason,
        status: 'PENDING'
      });
      setIsModalOpen(false);
      setFormData({ fullName: '', phone: '', identityNum: '', doctorScheduleId: '', visitReason: '' });
      fetchAppointments();
      alert('Đã đăng ký bệnh nhân thành công!');
    } catch (err: any) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Grouping logic
  const waiting = appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED');
  const examining = appointments.filter(a => a.status === 'CHECKED_IN' || a.status === 'IN_PROGRESS');
  const completed = appointments.filter(a => a.status === 'COMPLETED');

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-6 animate-fade-in relative pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-on-surface tracking-tight leading-tight">Điều phối Tiếp nhận</h1>
          <p className="font-body text-sm text-on-surface-variant mt-2 flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            HÔM NAY: <span className="font-bold text-on-surface">{appointments.length} CA</span>
          </p>
        </div>
        
        <div className="flex bg-surface-container-low rounded-xl p-1">
            <button className="px-6 py-2.5 text-sm font-bold font-body rounded-lg transition-all bg-surface-container-lowest text-primary shadow-sm">
              Hôm nay
            </button>
            <button 
              onClick={fetchAppointments}
              className="px-6 py-2.5 text-sm font-bold font-body rounded-lg transition-all text-on-surface-variant hover:text-on-surface flex items-center gap-2"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Làm mới
            </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error-container/10 border border-error/20 rounded-xl text-error font-medium">
          {error}
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto custom-scrollbar relative">
        {loading && appointments.length === 0 && (
           <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex justify-center items-center z-10">
             <div className="flex flex-col items-center gap-4">
                <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <p className="font-body text-sm font-bold text-primary">Đang tải dữ liệu tiếp nhận...</p>
             </div>
           </div>
        )}

        <div className="flex gap-6 min-w-[1000px] h-full pb-4">
          
          {/* Column 1: Waiting */}
          <div className="flex-1 bg-surface-container-lowest rounded-[24px] shadow-ambient flex flex-col border border-surface-container-low overflow-hidden">
            <div className="p-4 border-b border-surface-container-low flex justify-between items-center bg-primary/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider">Chờ tiếp nhận</h3>
              </div>
              <span className="bg-white text-primary font-bold text-xs px-2.5 py-1 rounded-md shadow-sm">{waiting.length.toString().padStart(2, '0')}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-surface-container-lowest/50">
              {waiting.map(appt => (
                <div key={appt.appointmentId} className="bg-white rounded-xl p-4 border border-outline-variant/30 shadow-sm hover:border-primary/50 transition-colors group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-display font-bold text-on-surface">{appt.patientName}</p>
                      <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">{appt.appointmentCode}</p>
                    </div>
                    <span className="bg-primary-container/20 text-primary text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      STT: {appt.queueNum}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="font-body text-xs text-on-surface-variant flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                      <span className="font-semibold text-on-surface">Dịch vụ: {appt.feeName || 'Khám bệnh'}</span>
                    </p>
                    <p className="font-body text-xs text-on-surface-variant flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      {appt.doctorName}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => handleCheckIn(appt.appointmentId)}
                    className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white font-body font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Tiếp nhận
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              ))}
              {waiting.length === 0 && !loading && (
                <div className="h-full flex items-center justify-center text-on-surface-variant font-body text-sm italic">Hàng đợi trống</div>
              )}
            </div>
          </div>

          {/* Column 2: Examining */}
          <div className="flex-1 bg-surface-container-lowest rounded-[24px] shadow-ambient flex flex-col border border-surface-container-low overflow-hidden">
            <div className="p-4 border-b border-surface-container-low flex justify-between items-center bg-orange-500/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <h3 className="font-display font-bold text-sm text-orange-600 uppercase tracking-wider">Đang khám</h3>
              </div>
              <span className="bg-white text-orange-600 font-bold text-xs px-2.5 py-1 rounded-md shadow-sm">{examining.length.toString().padStart(2, '0')}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-surface-container-lowest/50">
               {examining.map(appt => (
                <div key={appt.appointmentId} className="bg-white rounded-xl p-4 border border-outline-variant/30 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-display font-bold text-on-surface">{appt.patientName}</p>
                      <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">{appt.appointmentCode}</p>
                    </div>
                    <span className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      STT: {appt.queueNum}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="font-body text-xs text-on-surface-variant flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                      <span className="font-semibold text-on-surface">{appt.feeName || 'Khám nội'}</span>
                    </p>
                    <p className="font-body text-xs text-on-surface-variant flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      {appt.doctorName}
                    </p>
                  </div>
                  
                  {/* Progress Bar (Fake for UI) */}
                  <div className="absolute bottom-0 left-0 h-1 bg-surface-container-low w-full">
                    <div className="h-full bg-orange-500 w-1/2"></div>
                  </div>
                </div>
              ))}
              {examining.length === 0 && !loading && (
                <div className="h-full flex items-center justify-center text-on-surface-variant font-body text-sm italic">Không có bệnh nhân đang khám</div>
              )}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="flex-1 bg-surface-container-lowest rounded-[24px] shadow-ambient flex flex-col border border-surface-container-low overflow-hidden">
            <div className="p-4 border-b border-surface-container-low flex justify-between items-center bg-emerald-500/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <h3 className="font-display font-bold text-sm text-emerald-600 uppercase tracking-wider">Đã hoàn thành</h3>
              </div>
              <span className="bg-white text-emerald-600 font-bold text-xs px-2.5 py-1 rounded-md shadow-sm">{completed.length.toString().padStart(2, '0')}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-surface-container-lowest/50">
               {completed.map(appt => (
                <div key={appt.appointmentId} className="bg-white rounded-xl p-4 border border-outline-variant/30 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-display font-bold text-on-surface">{appt.patientName}</p>
                      <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">{appt.appointmentCode}</p>
                    </div>
                    <span className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      STT: {appt.queueNum}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-2">
                    <p className="font-body text-xs text-on-surface-variant flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                      <span className="font-semibold text-on-surface">{appt.feeName || 'Khám bệnh'}</span>
                    </p>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-surface-container-low">
                      <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                        appt.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {appt.paymentStatus === 'PAID' ? 'ĐÃ THANH TOÁN' : 'CHỜ THANH TOÁN'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {completed.length === 0 && !loading && (
                <div className="h-full flex items-center justify-center text-on-surface-variant font-body text-sm italic">Chưa có ca hoàn thành</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Floating Action Button (FAB) - Add Walk-in */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center z-10 focus:outline-none focus:ring-4 focus:ring-primary/30"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
      </button>

      {/* Add Walk-in Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[28px] shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-primary/5">
              <h2 className="font-display text-xl font-bold text-primary">Đăng ký bệnh nhân mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                 <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleAddWalkIn} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase ml-1">Họ và tên bệnh nhân</label>
                <input 
                  required
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 font-body text-sm focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Nhập tên bệnh nhân..."
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase ml-1">Số điện thoại</label>
                  <input 
                    required
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 font-body text-sm focus:ring-2 focus:ring-primary transition-all"
                    placeholder="090..."
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase ml-1">Số CCCD</label>
                  <input 
                    className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 font-body text-sm focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Số định danh..."
                    value={formData.identityNum}
                    onChange={e => setFormData({...formData, identityNum: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase ml-1">Chọn bác sĩ/Lịch khám</label>
                <select 
                  required
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 font-body text-sm focus:ring-2 focus:ring-primary transition-all"
                  value={formData.doctorScheduleId}
                  onChange={e => setFormData({...formData, doctorScheduleId: e.target.value})}
                >
                  <option value="">-- Chọn lịch khám hiện có --</option>
                  {availableSchedules.map(s => (
                    <option key={s.doctorScheduleId} value={s.doctorScheduleId}>
                      {s.doctorName} - {s.shift} ({s.roomCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase ml-1">Lý do khám</label>
                <textarea 
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 font-body text-sm focus:ring-2 focus:ring-primary transition-all h-20 resize-none"
                  placeholder="Triệu chứng ban đầu..."
                  value={formData.visitReason}
                  onChange={e => setFormData({...formData, visitReason: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl font-body text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] bg-primary text-white px-6 py-3 rounded-xl font-body text-sm font-bold shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {submitting ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : 'Xác nhận Đăng ký'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientReceptionPage;


