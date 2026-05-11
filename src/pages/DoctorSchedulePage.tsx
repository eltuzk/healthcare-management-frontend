import React, { useState, useEffect } from 'react';
import { getDoctorSchedules } from '../services/scheduleService';

// Format Date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

const getDayOfWeek = (dateString: string) => {
  const date = new Date(dateString);
  const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return days[date.getDay()];
};

const DoctorSchedulePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'Tuần' | 'Ngày'>('Tuần');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      // Gọi API lấy lịch trực
      const data = await getDoctorSchedules();
      // Data đã được unwrapped từ ApiResponse.result thông qua axios interceptor
      setSchedules(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Lỗi khi lấy lịch trực:", err);
      setError(err.message || 'Không thể tải lịch làm việc');
    } finally {
      setLoading(false);
    }
  };

  // Tạo mảng 7 ngày cho giao diện (tạm thời lấy 7 ngày gần nhất từ lịch lấy được, hoặc render tuần hiện tại)
  // Để đơn giản, ta sẽ gom nhóm schedules theo ngày.
  const groupedSchedules: Record<string, any[]> = {};
  schedules.forEach(schedule => {
    const dateStr = schedule.scheduleDate; // e.g., '2026-05-11'
    if (!groupedSchedules[dateStr]) {
      groupedSchedules[dateStr] = [];
    }
    groupedSchedules[dateStr].push(schedule);
  });

  // Tạo danh sách 7 ngày hiển thị (Bắt đầu từ hôm nay cho demo)
  const displayDays = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const current = new Date(today);
    current.setDate(today.getDate() + i);
    const dateKey = current.toISOString().split('T')[0];

    displayDays.push({
      dateKey,
      day: getDayOfWeek(dateKey),
      date: formatDate(dateKey),
      shifts: groupedSchedules[dateKey] || []
    });
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 h-full flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-on-surface tracking-tight leading-tight">Quản lý lịch trực</h1>
          <p className="font-body text-sm text-on-surface-variant mt-2 font-medium">
            <span className="text-primary font-bold">Tuần này</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchSchedules}
            className="bg-surface-container-low text-on-surface-variant hover:text-on-surface font-body font-bold text-sm px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Làm mới
          </button>
          <div className="flex bg-surface-container-low rounded-xl p-1">
            <button
              onClick={() => setViewMode('Tuần')}
              className={`px-4 py-2 text-sm font-bold font-body rounded-lg transition-all ${viewMode === 'Tuần' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Theo tuần
            </button>
            <button
              onClick={() => setViewMode('Ngày')}
              className={`px-4 py-2 text-sm font-bold font-body rounded-lg transition-all ${viewMode === 'Ngày' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Theo ngày
            </button>
          </div>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="bg-primary text-white font-body font-bold text-sm px-4 py-2 rounded-xl shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Nhập lịch (Excel)
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error-container/10 border border-error/20 rounded-xl text-error font-medium">
          {error}
        </div>
      )}

      {/* Calendar Grid */}
      <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient flex-1 overflow-hidden flex flex-col border border-surface-container-low relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex justify-center items-center z-10">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        )}
        <div className="grid grid-cols-7 border-b border-surface-container-low bg-surface-container-lowest">
          {displayDays.map((day, idx) => (
            <div key={idx} className={`p-4 text-center border-r border-surface-container-low last:border-r-0 ${idx === 0 ? 'bg-primary/5' : ''}`}>
              <p className={`font-body text-xs font-bold uppercase tracking-widest ${idx === 0 ? 'text-primary' : 'text-on-surface-variant'}`}>{day.day}</p>
              <p className={`font-display text-xl font-bold mt-1 ${idx === 0 ? 'text-primary' : 'text-on-surface'}`}>{day.date}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 flex-1 min-h-[500px]">
          {displayDays.map((day, idx) => (
            <div key={idx} className={`border-r border-surface-container-low last:border-r-0 p-3 flex flex-col gap-3 ${idx === 0 ? 'bg-primary/5' : ''}`}>
              {day.shifts.map((shift, sIdx) => (
                <div key={sIdx} className={`p-3 rounded-xl border ${shift.shift === 'MORNING' ? 'bg-emerald-50 border-emerald-200' :
                    shift.shift === 'AFTERNOON' ? 'bg-blue-50 border-blue-200' :
                      'bg-purple-50 border-purple-200'
                  } hover:shadow-md transition-shadow cursor-pointer`}>
                  <p className="font-body text-xs font-bold text-on-surface mb-1 truncate">{shift.doctorName}</p>
                  <p className="font-body text-[10px] text-on-surface-variant flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {shift.shiftStartTime || shift.shift}
                  </p>
                  <p className="font-body text-[10px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    {shift.roomCode}
                  </p>
                  <div className="mt-2 pt-2 border-t border-black/5 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-on-surface-variant">KHÁM: {shift.currentBookingCount}/{shift.maxCapacity}</span>
                  </div>
                </div>
              ))}

              {/* Add Shift Placeholder */}
              <button className="mt-auto w-full py-2 rounded-lg border border-dashed border-outline-variant text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Import Excel Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-surface-container-highest/80 backdrop-blur-sm" onClick={() => setIsImportModalOpen(false)}></div>

          <div className="relative w-full max-w-3xl bg-surface-container-lowest rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-surface-container-low">
              <h2 className="font-display text-xl font-bold text-on-surface">Nhập lịch từ Excel</h2>
              <button onClick={() => setIsImportModalOpen(false)} className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-error transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              {/* Drag & Drop Area */}
              <div className="w-full border-2 border-dashed border-primary/40 rounded-[20px] bg-primary/5 flex flex-col items-center justify-center py-10 hover:bg-primary/10 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-primary group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <h3 className="font-display text-lg font-bold text-on-surface mb-2">Kéo và thả tệp Excel của bạn ở đây</h3>
                <p className="font-body text-sm text-on-surface-variant mb-6">Hỗ trợ định dạng .xls, .xlsx tối đa 5MB</p>
                <button className="px-6 py-2.5 bg-white border border-outline-variant/30 text-on-surface font-body font-bold text-sm rounded-xl hover:bg-surface-container-low shadow-sm transition-colors">
                  Chọn tệp tin
                </button>
              </div>

              {/* Preview Table */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-body text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Xem trước dữ liệu (4 ca trực mới)</h4>
                  <button className="font-body text-xs font-bold text-error hover:underline">Hủy tất cả</button>
                </div>
                <div className="border border-surface-container-low rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-container-low/50 border-b border-surface-container-low">
                        <th className="py-3 px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tên bác sĩ</th>
                        <th className="py-3 px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Ngày trực</th>
                        <th className="py-3 px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Thời gian</th>
                        <th className="py-3 px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Phòng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-low/50">
                      {mockPreviewData.map((row) => (
                        <tr key={row.id} className="hover:bg-surface-container-low/30">
                          <td className="py-3 px-4 font-body text-sm font-bold text-on-surface">{row.doctor}</td>
                          <td className="py-3 px-4 font-body text-sm text-on-surface-variant">{row.date}</td>
                          <td className="py-3 px-4 font-body text-sm text-on-surface-variant">{row.time}</td>
                          <td className="py-3 px-4 font-body text-sm font-semibold text-on-surface">{row.room}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-surface-container-low bg-surface-container-lowest flex justify-end gap-3">
              <button onClick={() => setIsImportModalOpen(false)} className="px-6 py-3 rounded-xl font-body text-sm font-bold text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors">
                Hủy bỏ
              </button>
              <button onClick={() => setIsImportModalOpen(false)} className="px-6 py-3 rounded-xl font-body text-sm font-bold bg-primary text-white shadow-sm hover:opacity-90 transition-opacity">
                Xác nhận nhập dữ liệu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedulePage;
