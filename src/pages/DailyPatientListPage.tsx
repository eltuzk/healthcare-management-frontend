import React, { useState } from 'react';

// Mock Data
const patientQueue = [
  { id: 'BN-992031', queueNo: '102', name: 'Trần Minh Quân', age: 45, gender: 'Nam', reason: 'Đau tức ngực, hơi khó thở', status: 'ĐANG KHÁM', time: '10:15 AM' },
  { id: 'BN-992032', queueNo: '103', name: 'Lê Thị Thanh', age: 32, gender: 'Nữ', reason: 'Sốt cao liên tục 2 ngày', status: 'CHỜ', time: '10:30 AM' },
  { id: 'BN-992033', queueNo: '104', name: 'Phạm Văn Hùng', age: 58, gender: 'Nam', reason: 'Khám định kỳ huyết áp', status: 'CHỜ', time: '10:45 AM' },
  { id: 'BN-992030', queueNo: '101', name: 'Nguyễn Thị Hoa', age: 29, gender: 'Nữ', reason: 'Đau bụng âm ỉ', status: 'XONG', time: '09:45 AM' },
];

const vitals = {
  heartRate: '78 bpm',
  temperature: '36.8 °C',
  bloodPressure: '120/80 mmHg'
};

const DailyPatientListPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'MINE'>('ALL');
  const [selectedPatient, setSelectedPatient] = useState(patientQueue[0]);

  const nextPatient = patientQueue.find(p => p.status === 'CHỜ');

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] animate-fade-in pb-10">
      
      {/* Left Main Area: Patient Queue Table */}
      <div className="flex-1 bg-surface-container-lowest rounded-[24px] shadow-ambient border border-surface-container-low flex flex-col overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="p-6 border-b border-surface-container-low flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="font-display font-bold text-xl text-on-surface">Hàng đợi khám</h2>
            <p className="font-body text-sm text-on-surface-variant mt-1">Tổng cộng 24 bệnh nhân đang chờ</p>
          </div>
          
          <div className="flex bg-surface-container-low p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('ALL')}
              className={`px-6 py-2 text-sm font-bold font-body rounded-lg transition-all ${activeTab === 'ALL' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              TẤT CẢ
            </button>
            <button 
              onClick={() => setActiveTab('MINE')}
              className={`px-6 py-2 text-sm font-bold font-body rounded-lg transition-all ${activeTab === 'MINE' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              CỦA TÔI
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-surface-container-lowest sticky top-0 z-10 shadow-sm">
              <tr className="border-b border-surface-container-low">
                <th className="py-4 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest w-12">STT</th>
                <th className="py-4 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest w-20">SỐ TT</th>
                <th className="py-4 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Bệnh nhân</th>
                <th className="py-4 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest w-16">Tuổi</th>
                <th className="py-4 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest w-1/3">Lý do khám</th>
                <th className="py-4 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest w-28 text-center">Trạng thái</th>
                <th className="py-4 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest w-24 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low/50">
              {patientQueue.map((patient, index) => (
                <tr 
                  key={patient.id} 
                  onClick={() => setSelectedPatient(patient)}
                  className={`group cursor-pointer transition-colors ${selectedPatient.id === patient.id ? 'bg-primary/5' : 'hover:bg-surface-container-low/30'}`}
                >
                  <td className="py-4 px-6 font-body text-sm text-on-surface-variant font-medium">{(index + 1).toString().padStart(2, '0')}</td>
                  <td className="py-4 px-6">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-sm">
                      {patient.queueNo}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-body text-sm font-bold text-on-surface">{patient.name}</p>
                        <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{patient.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-body text-sm font-medium text-on-surface-variant">{patient.age}</td>
                  <td className="py-4 px-6 font-body text-sm text-on-surface-variant truncate max-w-[200px]">{patient.reason}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                      ${patient.status === 'ĐANG KHÁM' ? 'bg-orange-50 text-orange-600' : ''}
                      ${patient.status === 'CHỜ' ? 'bg-primary/10 text-primary' : ''}
                      ${patient.status === 'XONG' ? 'bg-surface-container-low text-on-surface-variant' : ''}
                    `}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Panel: Patient Detail */}
      <div className="w-full lg:w-[380px] bg-surface-container-lowest rounded-[24px] shadow-ambient border border-surface-container-low flex flex-col flex-shrink-0 overflow-hidden">
        {/* Detail Header */}
        <div className="p-6 border-b border-surface-container-low relative">
          <div className="absolute top-6 right-6">
            <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                ${selectedPatient.status === 'ĐANG KHÁM' ? 'bg-orange-50 text-orange-600' : ''}
                ${selectedPatient.status === 'CHỜ' ? 'bg-primary/10 text-primary' : ''}
                ${selectedPatient.status === 'XONG' ? 'bg-surface-container-low text-on-surface-variant' : ''}
              `}>
                {selectedPatient.status}
            </span>
          </div>
          <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold text-xl mb-4">
            {selectedPatient.name.charAt(0)}
          </div>
          <h3 className="font-display font-bold text-2xl text-on-surface">{selectedPatient.name}</h3>
          <div className="flex gap-4 mt-2">
            <span className="font-body text-sm text-on-surface-variant font-medium">Giới tính: <strong className="text-on-surface">{selectedPatient.gender}</strong></span>
            <span className="font-body text-sm text-on-surface-variant font-medium">Tuổi: <strong className="text-on-surface">{selectedPatient.age}</strong></span>
          </div>
        </div>

        {/* Vitals Summary */}
        <div className="p-6 flex-1">
          <h4 className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Chỉ số sinh tồn</h4>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-surface-container-low/50 rounded-xl p-4">
              <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1 flex items-center gap-1">
                <svg className="w-3 h-3 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                Nhịp tim
              </p>
              <p className="font-display font-bold text-lg text-on-surface">{vitals.heartRate}</p>
            </div>
            <div className="bg-surface-container-low/50 rounded-xl p-4">
              <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1 flex items-center gap-1">
                <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                Nhiệt độ
              </p>
              <p className="font-display font-bold text-lg text-on-surface">{vitals.temperature}</p>
            </div>
            <div className="bg-surface-container-low/50 rounded-xl p-4 col-span-2">
              <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1 flex items-center gap-1">
                <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Huyết áp
              </p>
              <p className="font-display font-bold text-lg text-on-surface">{vitals.bloodPressure}</p>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="space-y-3">
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-body font-bold text-sm py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              Bắt đầu chẩn đoán
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
            <button className="w-full border border-outline-variant/50 hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface font-body font-bold text-sm py-3.5 rounded-xl transition-colors">
              Xem lịch sử y tế
            </button>
          </div>
        </div>

        {/* Next Up Footer */}
        {nextPatient && (
          <div className="p-4 bg-surface-container-low border-t border-surface-container-low">
            <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">TIẾP THEO</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary font-bold text-xs shadow-sm">
                {nextPatient.queueNo}
              </div>
              <div>
                <p className="font-body text-sm font-bold text-on-surface">{nextPatient.name}</p>
                <p className="font-body text-[10px] text-on-surface-variant">Lúc {nextPatient.time}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyPatientListPage;
