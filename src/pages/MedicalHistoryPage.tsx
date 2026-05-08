import React, { useState } from 'react';

const historyData = [
  {
    id: 1,
    date: '15/10/2023',
    diagnosis: 'Viêm Amidan Cấp Tính',
    status: 'CHO VỀ',
    symptoms: 'Sốt cao 38°C, đau rát họng, nuốt vướng',
    doctor: 'ThS. BS. Lê Minh Thuận',
    isExpanded: true,
    labResults: [
      { indicator: 'Glucose', result: '7.2 mmol/L', range: '3.9 - 6.1', status: 'CAO' },
      { indicator: 'WBC (Bạch cầu)', result: '12.5 G/L', range: '4.0 - 10.0', status: 'VIÊM' },
      { indicator: 'RBC (Hồng cầu)', result: '4.8 T/L', range: '4.0 - 5.8', status: 'BÌNH THƯỜNG' }
    ],
    attachments: ['Kết quả X-Quang.pdf', 'Đơn thuốc.pdf']
  },
  {
    id: 2,
    date: '02/08/2023',
    diagnosis: 'Kiểm tra định kỳ (Tiểu đường)',
    status: 'HOÀN THÀNH',
    symptoms: 'Khám sức khỏe tổng quát, theo dõi chỉ số đường huyết',
    doctor: 'BS. Phạm Minh Tuấn',
    isExpanded: false,
    labResults: [],
    attachments: ['Kết quả xét nghiệm máu.pdf']
  },
  {
    id: 3,
    date: '14/05/2023',
    diagnosis: 'Rối loạn tiêu hóa cấp',
    status: 'HOÀN THÀNH',
    symptoms: 'Đau bụng âm ỉ, buồn nôn, tiêu chảy',
    doctor: 'BS. Trần Thị B',
    isExpanded: false,
    labResults: [],
    attachments: ['Đơn thuốc.pdf']
  }
];

const MedicalHistoryPage: React.FC = () => {
  const [timeline, setTimeline] = useState(historyData);

  const toggleExpand = (id: number) => {
    setTimeline(timeline.map(item => 
      item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
    ));
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in pb-12">
      
      {/* Patient Identity Header */}
      <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shadow-sm">
             NA
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-display text-2xl font-bold text-on-surface">Nguyễn Văn An</h1>
              <span className="bg-surface-container-low text-on-surface-variant font-bold text-xs px-2.5 py-1 rounded-md">#89284-VA</span>
            </div>
            <div className="flex items-center gap-4 font-body text-sm text-on-surface-variant">
              <span>Nam</span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/50"></span>
              <span>65 Tuổi</span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/50"></span>
              <span>SĐT: 0901 234 567</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 font-body text-sm font-bold text-on-surface focus:outline-none focus:border-primary">
            <option>Lọc theo: Tất cả thời gian</option>
            <option>6 tháng gần nhất</option>
            <option>1 năm gần nhất</option>
          </select>
          <button className="px-5 py-2.5 rounded-xl border border-outline-variant/50 text-on-surface-variant font-body font-bold text-sm hover:bg-surface-container-low transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            In báo cáo
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-primary text-white font-body font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Tạo lượt khám mới
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column: Vertical Timeline */}
        <div className="flex-1 space-y-6 w-full">
          <div className="relative pl-8 border-l-2 border-surface-container-high space-y-8 ml-4">
            
            {timeline.map((visit, index) => (
              <div key={visit.id} className="relative">
                {/* Timeline Dot */}
                <div className={`absolute -left-[41px] top-4 w-5 h-5 rounded-full border-4 border-surface-container-lowest ${visit.isExpanded ? 'bg-primary' : 'bg-surface-container-high'}`}></div>
                
                <div className={`bg-surface-container-lowest rounded-[24px] shadow-ambient border transition-colors overflow-hidden ${visit.isExpanded ? 'border-primary/30' : 'border-surface-container-low hover:border-outline-variant/30'}`}>
                  
                  {/* Card Header (Clickable) */}
                  <div 
                    className="p-5 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpand(visit.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <span className="font-display font-bold text-primary text-lg">{visit.date}</span>
                      <h3 className="font-body font-bold text-on-surface text-base">{visit.diagnosis}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container-low text-on-surface-variant">
                        {visit.status}
                      </span>
                    </div>
                    <button className="text-on-surface-variant">
                      <svg className={`w-5 h-5 transition-transform ${visit.isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {visit.isExpanded && (
                    <div className="p-5 border-t border-surface-container-low bg-surface-container-lowest/50 space-y-6 animate-fade-in">
                      
                      {/* Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Triệu chứng</p>
                          <p className="font-body text-sm text-on-surface">{visit.symptoms}</p>
                        </div>
                        <div>
                          <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Bác sĩ phụ trách</p>
                          <p className="font-body text-sm text-on-surface">{visit.doctor}</p>
                        </div>
                      </div>

                      {/* Lab Results Table */}
                      {visit.labResults.length > 0 && (
                        <div>
                          <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">Kết quả lâm sàng</p>
                          <div className="border border-outline-variant/30 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                              <thead className="bg-surface-container-low/50 border-b border-outline-variant/30">
                                <tr>
                                  <th className="py-2.5 px-4 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Chỉ số</th>
                                  <th className="py-2.5 px-4 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Kết quả</th>
                                  <th className="py-2.5 px-4 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">CSBT</th>
                                  <th className="py-2.5 px-4 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Trạng thái</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-outline-variant/30">
                                {visit.labResults.map((lab, i) => (
                                  <tr key={i}>
                                    <td className="py-2.5 px-4 font-body text-sm font-bold text-on-surface">{lab.indicator}</td>
                                    <td className="py-2.5 px-4 font-body text-sm text-on-surface">{lab.result}</td>
                                    <td className="py-2.5 px-4 font-body text-sm text-on-surface-variant">{lab.range}</td>
                                    <td className="py-2.5 px-4">
                                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                        lab.status === 'BÌNH THƯỜNG' ? 'bg-emerald-50 text-emerald-600' : 'bg-error-container/30 text-error'
                                      }`}>
                                        {lab.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Attachments */}
                      {visit.attachments.length > 0 && (
                        <div>
                          <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">Tài liệu đính kèm</p>
                          <div className="flex flex-wrap gap-3">
                            {visit.attachments.map((file, i) => (
                              <button key={i} className="flex items-center gap-2 px-3 py-2 bg-surface-container-low hover:bg-surface-container-high rounded-lg font-body text-xs text-on-surface-variant transition-colors border border-outline-variant/30">
                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                {file}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              </div>
            ))}
            
          </div>
        </div>

        {/* Right Column: Summary Widgets */}
        <div className="w-full lg:w-[340px] flex-shrink-0 space-y-6">
          
          {/* Critical Alerts Card */}
          <div className="bg-error-container/20 rounded-[24px] p-6 shadow-ambient border border-error/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 rounded-bl-full -mr-4 -mt-4"></div>
            <h3 className="font-body text-xs font-bold text-error uppercase tracking-widest flex items-center gap-2 mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Cảnh báo quan trọng
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Dị ứng thuốc</p>
                <p className="font-display font-bold text-error text-lg">Penicillin</p>
              </div>
              <div className="h-px bg-error/10 w-full"></div>
              <div>
                <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Bệnh nền</p>
                <p className="font-body font-bold text-on-surface text-base">Tiểu đường Type 2</p>
              </div>
            </div>
          </div>

          {/* Current Prescription */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest">Đơn thuốc đang dùng</h3>
              <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Hết hạn: 22/10/2023</span>
            </div>
            <ul className="space-y-3 mb-4">
              <li className="flex flex-col border-b border-surface-container-low pb-2">
                <span className="font-body font-bold text-sm text-on-surface">Amoxicillin 500mg</span>
                <span className="font-body text-xs text-on-surface-variant">Sáng 1 viên, Tối 1 viên (Sau ăn)</span>
              </li>
              <li className="flex flex-col border-b border-surface-container-low pb-2">
                <span className="font-body font-bold text-sm text-on-surface">Paracetamol 500mg</span>
                <span className="font-body text-xs text-on-surface-variant">Chỉ uống khi sốt {'>'} 38.5°C</span>
              </li>
              <li className="flex flex-col">
                <span className="font-body font-bold text-sm text-on-surface">Alpha Choay</span>
                <span className="font-body text-xs text-on-surface-variant">Ngậm dưới lưỡi, 2 lần/ngày</span>
              </li>
            </ul>
            <button className="w-full py-2.5 rounded-xl border border-primary text-primary font-body font-bold text-sm hover:bg-primary/5 transition-colors">
              Tái cấp đơn thuốc
            </button>
          </div>

          {/* Latest Lab Vitals */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low">
            <h3 className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Chỉ số xét nghiệm gần nhất</h3>
            <div className="space-y-4 mb-4">
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="font-body text-sm font-bold text-on-surface">Glucose</span>
                  <span className="font-body text-xs font-bold text-error">7.2 <span className="text-on-surface-variant font-normal">mmol/L</span></span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-error" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="font-body text-sm font-bold text-on-surface">WBC</span>
                  <span className="font-body text-xs font-bold text-error">12.5 <span className="text-on-surface-variant font-normal">G/L</span></span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-error" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-1">
                  <span className="font-body text-sm font-bold text-on-surface">Cholesterol</span>
                  <span className="font-body text-xs font-bold text-emerald-600">4.5 <span className="text-on-surface-variant font-normal">mmol/L</span></span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
            <button className="w-full text-center text-primary font-body text-xs font-bold hover:underline transition-colors mt-2">
              Xem toàn bộ kết quả →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryPage;
