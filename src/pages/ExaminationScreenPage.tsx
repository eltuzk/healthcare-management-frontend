import React, { useState } from 'react';

const ExaminationScreenPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Khám lâm sàng');

  const tabs = ['Khám lâm sàng', 'Xét nghiệm', 'Dịch vụ CLS', 'Đơn thuốc', 'Chỉ định NV'];

  const prescriptions = [
    { id: 1, name: 'Amlodipine 5mg', quantity: 30, dosage: 'Sáng 01 viên, uống sau ăn' },
    { id: 2, name: 'Atorvastatin 20mg', quantity: 30, dosage: 'Tối 01 viên, uống sau ăn' }
  ];

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col animate-fade-in relative pb-10 gap-6">
      
      {/* Header Info */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-on-surface tracking-tight leading-tight">Khám bệnh</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">Phòng khám số 04 - Bác sĩ Lê Hoàng Nam</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        {/* Left Column: Patient Summary */}
        <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
          {/* Profile Card */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low flex flex-col items-center text-center">
             <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold text-3xl mb-4 shadow-sm border-4 border-white">
                N
             </div>
             <h2 className="font-display font-bold text-xl text-on-surface">Nguyễn Văn An</h2>
             <div className="flex gap-3 mt-2 font-body text-sm font-bold text-on-surface-variant">
               <span className="bg-surface-container-low px-3 py-1 rounded-full">45 Tuổi</span>
               <span className="bg-surface-container-low px-3 py-1 rounded-full text-primary">NAM</span>
             </div>
          </div>

          {/* Allergy Alert */}
          <div className="bg-error-container/20 border border-error/30 rounded-[20px] p-5">
            <h3 className="font-body text-[10px] font-bold text-error uppercase tracking-widest flex items-center gap-2 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Cảnh báo dị ứng
            </h3>
            <p className="font-display font-bold text-error text-lg">Penicillin</p>
          </div>

          {/* Medical History */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low">
            <h3 className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Tiền sử bệnh</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                <p className="font-body text-sm font-medium text-on-surface">Tăng huyết áp (2018)</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5"></div>
                <p className="font-body text-sm font-medium text-on-surface">Rối loạn Lipid máu</p>
              </li>
            </ul>
          </div>

          {/* Insurance */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low">
             <h3 className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Thông tin BHYT</h3>
             <div className="space-y-2">
               <p className="font-body text-xs text-on-surface-variant">Số thẻ</p>
               <p className="font-display font-bold text-on-surface text-lg">604 791 234 567 89</p>
               <p className="font-body text-xs text-on-surface-variant mt-2 flex justify-between">
                 Hạn mức: <strong className="text-primary">80%</strong>
               </p>
               <p className="font-body text-xs text-on-surface-variant flex justify-between">
                 Hạn sử dụng: <strong className="text-on-surface">31/12/2024</strong>
               </p>
             </div>
          </div>
        </div>

        {/* Right Column: Examination Workspace */}
        <div className="flex-1 bg-surface-container-lowest rounded-[24px] shadow-ambient border border-surface-container-low flex flex-col overflow-hidden">
          
          {/* Tabs */}
          <div className="flex border-b border-surface-container-low px-4 pt-4 overflow-x-auto custom-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-body font-bold text-sm whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {activeTab === 'Khám lâm sàng' && (
              <>
                {/* Triệu chứng */}
                <div>
                  <label className="block font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Triệu chứng (Lý do khám)</label>
                  <textarea 
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 font-body text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[100px] resize-y"
                    placeholder="Nhập triệu chứng của bệnh nhân..."
                    defaultValue="Bệnh nhân than đau tức ngực trái, mệt mỏi, khó thở nhẹ khi vận động mạnh. Tình trạng kéo dài 3 ngày nay."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chẩn đoán */}
                  <div>
                    <label className="block font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Chẩn đoán sơ bộ</label>
                    <textarea 
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 font-body text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[120px] resize-y"
                      placeholder="Nhập chẩn đoán..."
                      defaultValue="Theo dõi Cơn đau thắt ngực ổn định / Tăng huyết áp."
                    ></textarea>
                  </div>
                  {/* Hướng điều trị */}
                  <div>
                    <label className="block font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Kết luận & Hướng điều trị</label>
                    <textarea 
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 font-body text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[120px] resize-y"
                      placeholder="Nhập hướng điều trị..."
                      defaultValue="Chỉ định đo điện tâm đồ (ECG), siêu âm tim. Duy trì đơn thuốc huyết áp cũ, thêm thuốc giảm đau thắt ngực."
                    ></textarea>
                  </div>
                </div>

                {/* Đơn thuốc chỉ định */}
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="block font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest">Đơn thuốc chỉ định</label>
                    <button className="text-primary font-body text-sm font-bold flex items-center gap-2 hover:underline">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                      Thêm thuốc mới
                    </button>
                  </div>
                  <div className="border border-outline-variant/30 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-surface-container-low/50 border-b border-outline-variant/30">
                        <tr>
                          <th className="py-3 px-4 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tên thuốc</th>
                          <th className="py-3 px-4 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest w-24">Số lượng</th>
                          <th className="py-3 px-4 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Liều lượng & Cách dùng</th>
                          <th className="py-3 px-4 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest w-12 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/30">
                        {prescriptions.map(med => (
                          <tr key={med.id}>
                            <td className="py-3 px-4 font-body text-sm font-bold text-on-surface">{med.name}</td>
                            <td className="py-3 px-4 font-body text-sm text-on-surface-variant">{med.quantity}</td>
                            <td className="py-3 px-4 font-body text-sm text-on-surface-variant">{med.dosage}</td>
                            <td className="py-3 px-4 text-center">
                              <button className="text-error/70 hover:text-error transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Lời dặn */}
                <div>
                  <label className="block font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Lời dặn bác sĩ</label>
                  <textarea 
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 font-body text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all min-h-[80px] resize-y"
                    placeholder="Nhập lời dặn dò bệnh nhân..."
                    defaultValue="Hạn chế vận động mạnh, ăn nhạt, tái khám sau 1 tháng hoặc khi có triệu chứng đau ngực dữ dội."
                  ></textarea>
                </div>
              </>
            )}
            
            {activeTab !== 'Khám lâm sàng' && (
              <div className="flex flex-col items-center justify-center h-full text-on-surface-variant opacity-50">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                <p className="font-body font-bold">Khu vực {activeTab} đang được phát triển.</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-surface-container-low p-4 bg-surface-container-lowest/80 backdrop-blur-md flex justify-between items-center">
             <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Auto-saved 1m ago</span>
             <div className="flex gap-3">
               <button className="px-6 py-2.5 rounded-xl border border-outline-variant/50 text-on-surface-variant font-body font-bold text-sm hover:bg-surface-container-low transition-colors">
                 Lưu nháp
               </button>
               <button className="px-6 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body font-bold text-sm hover:bg-surface-container-high transition-colors">
                 Lưu bệnh án
               </button>
               <button className="px-6 py-2.5 rounded-xl bg-primary text-white font-body font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                 Kết thúc ca khám
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
               </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExaminationScreenPage;
