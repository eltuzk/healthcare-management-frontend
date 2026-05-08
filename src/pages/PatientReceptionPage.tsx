import React from 'react';

// Mock Data
const waitingPatients = [
  { id: 'BN-001', name: 'Nguyễn Văn An', timeWait: '12 Phút', type: 'Khám Tổng quát', doctor: 'Bs. Lê Hoàng Nam' },
  { id: 'BN-002', name: 'Trần Thị Mỹ Linh', timeWait: '05 Phút', type: 'Khám Tai Mũi Họng', doctor: 'Bs. Nguyễn Văn An' },
];

const examiningPatients = [
  { id: 'BN-003', name: 'Lê Hoàng Nam', startTime: '10:15 AM', type: 'Khám Nội Tim Mạch', doctor: 'Bs. Phạm Minh Tuấn', progress: 60 },
  { id: 'BN-004', name: 'Phạm Thu Trang', startTime: '10:30 AM', type: 'Khám Tổng quát', doctor: 'Bs. Trần Thị B', progress: 30 },
];

const completedPatients = [
  { id: 'BN-005', name: 'Đoàn Nhật Minh', endTime: '09:45 AM', type: 'Khám Da Liễu', status: 'ĐÃ THANH TOÁN' },
  { id: 'BN-006', name: 'Lý Nhã Kỳ', endTime: '09:10 AM', type: 'Khám Tổng quát', status: 'CHỜ THANH TOÁN' },
];

const PatientReceptionPage: React.FC = () => {
  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-6 animate-fade-in relative pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-on-surface tracking-tight leading-tight">Điều phối Tiếp nhận</h1>
          <p className="font-body text-sm text-on-surface-variant mt-2 flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            HÔM NAY: <span className="font-bold text-on-surface">48 CA</span>
          </p>
        </div>
        
        <div className="flex bg-surface-container-low rounded-xl p-1">
            <button className="px-6 py-2.5 text-sm font-bold font-body rounded-lg transition-all bg-surface-container-lowest text-primary shadow-sm">
              Hôm nay
            </button>
            <button className="px-6 py-2.5 text-sm font-bold font-body rounded-lg transition-all text-on-surface-variant hover:text-on-surface">
              Ngày mai
            </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <div className="flex gap-6 min-w-[1000px] h-full pb-4">
          
          {/* Column 1: Waiting */}
          <div className="flex-1 bg-surface-container-lowest rounded-[24px] shadow-ambient flex flex-col border border-surface-container-low overflow-hidden">
            <div className="p-4 border-b border-surface-container-low flex justify-between items-center bg-primary/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider">Chờ tiếp nhận</h3>
              </div>
              <span className="bg-white text-primary font-bold text-xs px-2.5 py-1 rounded-md shadow-sm">06</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-surface-container-lowest/50">
              {waitingPatients.map(patient => (
                <div key={patient.id} className="bg-white rounded-xl p-4 border border-outline-variant/30 shadow-sm hover:border-primary/50 transition-colors group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-display font-bold text-on-surface">{patient.name}</p>
                      <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">{patient.id}</p>
                    </div>
                    <span className="bg-error-container/20 text-error text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {patient.timeWait}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="font-body text-xs text-on-surface-variant flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                      <span className="font-semibold text-on-surface">{patient.type}</span>
                    </p>
                    <p className="font-body text-xs text-on-surface-variant flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      {patient.doctor}
                    </p>
                  </div>
                  
                  <button className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white font-body font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                    Tiếp nhận
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Examining */}
          <div className="flex-1 bg-surface-container-lowest rounded-[24px] shadow-ambient flex flex-col border border-surface-container-low overflow-hidden">
            <div className="p-4 border-b border-surface-container-low flex justify-between items-center bg-orange-500/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <h3 className="font-display font-bold text-sm text-orange-600 uppercase tracking-wider">Đang khám</h3>
              </div>
              <span className="bg-white text-orange-600 font-bold text-xs px-2.5 py-1 rounded-md shadow-sm">04</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-surface-container-lowest/50">
               {examiningPatients.map(patient => (
                <div key={patient.id} className="bg-white rounded-xl p-4 border border-outline-variant/30 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-display font-bold text-on-surface">{patient.name}</p>
                      <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">{patient.id}</p>
                    </div>
                    <span className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      Bắt đầu: {patient.startTime}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="font-body text-xs text-on-surface-variant flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                      <span className="font-semibold text-on-surface">{patient.type}</span>
                    </p>
                    <p className="font-body text-xs text-on-surface-variant flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      {patient.doctor}
                    </p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 h-1 bg-surface-container-low w-full">
                    <div className="h-full bg-orange-500" style={{ width: `${patient.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Completed */}
          <div className="flex-1 bg-surface-container-lowest rounded-[24px] shadow-ambient flex flex-col border border-surface-container-low overflow-hidden">
            <div className="p-4 border-b border-surface-container-low flex justify-between items-center bg-emerald-500/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <h3 className="font-display font-bold text-sm text-emerald-600 uppercase tracking-wider">Đã hoàn thành</h3>
              </div>
              <span className="bg-white text-emerald-600 font-bold text-xs px-2.5 py-1 rounded-md shadow-sm">38</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-surface-container-lowest/50">
               {completedPatients.map(patient => (
                <div key={patient.id} className="bg-white rounded-xl p-4 border border-outline-variant/30 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-display font-bold text-on-surface">{patient.name}</p>
                      <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">{patient.id}</p>
                    </div>
                    <span className="bg-surface-container-low text-on-surface-variant text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      Hoàn thành: {patient.endTime}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-2">
                    <p className="font-body text-xs text-on-surface-variant flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                      <span className="font-semibold text-on-surface">{patient.type}</span>
                    </p>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-surface-container-low">
                      <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                        patient.status === 'ĐÃ THANH TOÁN' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {patient.status}
                      </span>
                      <button className="text-primary font-body text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                        Xem bệnh án
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button className="absolute bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center z-10 focus:outline-none focus:ring-4 focus:ring-primary/30">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
      </button>

    </div>
  );
};

export default PatientReceptionPage;
