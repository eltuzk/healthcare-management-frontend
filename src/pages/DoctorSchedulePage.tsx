import React, { useState } from 'react';

// Mock Data
const mockSchedule = [
  { day: 'Thứ 2', date: '16/10', shifts: [{ doctor: 'Bs. Lê Hoàng Nam', time: '07:00 - 11:00', room: 'Phòng 102', type: 'Sáng' }, { doctor: 'Bs. Nguyễn Văn An', time: '13:00 - 17:00', room: 'Phòng 105', type: 'Chiều' }] },
  { day: 'Thứ 3', date: '17/10', shifts: [{ doctor: 'Bs. Trần Thị B', time: '07:00 - 11:00', room: 'Phòng 101', type: 'Sáng' }] },
  { day: 'Thứ 4', date: '18/10', shifts: [{ doctor: 'Bs. Phạm Minh Tuấn', time: '13:00 - 17:00', room: 'Phòng 203', type: 'Chiều' }, { doctor: 'Bs. Lê Hoàng Nam', time: '17:00 - 21:00', room: 'Phòng 102', type: 'Tối' }] },
  { day: 'Thứ 5', date: '19/10', shifts: [] },
  { day: 'Thứ 6', date: '20/10', shifts: [{ doctor: 'Bs. Nguyễn Văn An', time: '07:00 - 11:00', room: 'Phòng 105', type: 'Sáng' }] },
  { day: 'Thứ 7', date: '21/10', shifts: [{ doctor: 'Bs. Trần Thị B', time: '07:00 - 11:00', room: 'Phòng 101', type: 'Sáng' }] },
  { day: 'Chủ Nhật', date: '22/10', shifts: [] },
];

const mockPreviewData = [
  { id: 1, doctor: 'Bs. Lê Hoàng Nam', date: '23/10/2023', time: '07:00 - 11:00', room: '102' },
  { id: 2, doctor: 'Bs. Nguyễn Văn An', date: '23/10/2023', time: '13:00 - 17:00', room: '105' },
  { id: 3, doctor: 'Bs. Trần Thị B', date: '24/10/2023', time: '07:00 - 11:00', room: '101' },
  { id: 4, doctor: 'Bs. Phạm Minh Tuấn', date: '25/10/2023', time: '17:00 - 21:00', room: '203' },
];

const DoctorSchedulePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'Tuần' | 'Ngày'>('Tuần');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in pb-12 h-full flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-on-surface tracking-tight leading-tight">Quản lý lịch trực</h1>
          <p className="font-body text-sm text-on-surface-variant mt-2 font-medium">
            <span className="text-primary font-bold">Tuần 42</span> - Từ 16 Tháng 10 - 22 Tháng 10, 2023
          </p>
        </div>
        <div className="flex gap-3">
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
          <button className="bg-surface-container-low text-on-surface-variant hover:text-on-surface font-body font-bold text-sm px-4 py-2 rounded-xl transition-colors flex items-center gap-2 border border-outline-variant/30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Bộ lọc
          </button>
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="bg-primary text-white font-body font-bold text-sm px-4 py-2 rounded-xl shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Nhập lịch (Excel)
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient flex-1 overflow-hidden flex flex-col border border-surface-container-low">
        <div className="grid grid-cols-7 border-b border-surface-container-low bg-surface-container-lowest">
          {mockSchedule.map((day, idx) => (
            <div key={idx} className={`p-4 text-center border-r border-surface-container-low last:border-r-0 ${idx === 0 ? 'bg-primary/5' : ''}`}>
              <p className={`font-body text-xs font-bold uppercase tracking-widest ${idx === 0 ? 'text-primary' : 'text-on-surface-variant'}`}>{day.day}</p>
              <p className={`font-display text-xl font-bold mt-1 ${idx === 0 ? 'text-primary' : 'text-on-surface'}`}>{day.date}</p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 flex-1 min-h-[500px]">
          {mockSchedule.map((day, idx) => (
            <div key={idx} className={`border-r border-surface-container-low last:border-r-0 p-3 flex flex-col gap-3 ${idx === 0 ? 'bg-primary/5' : ''}`}>
              {day.shifts.map((shift, sIdx) => (
                <div key={sIdx} className={`p-3 rounded-xl border ${
                  shift.type === 'Sáng' ? 'bg-emerald-50 border-emerald-200' :
                  shift.type === 'Chiều' ? 'bg-blue-50 border-blue-200' :
                  'bg-purple-50 border-purple-200'
                }`}>
                  <p className="font-body text-xs font-bold text-on-surface mb-1 truncate">{shift.doctor}</p>
                  <p className="font-body text-[10px] text-on-surface-variant flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {shift.time}
                  </p>
                  <p className="font-body text-[10px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    {shift.room}
                  </p>
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
