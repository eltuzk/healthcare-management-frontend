import React, { useState } from 'react';

const LabResultEntryPage: React.FC = () => {
  const [results, setResults] = useState({
    glucose: '7.2',
    cholesterol: '',
    triglycerides: '3.5',
  });

  const [notes, setNotes] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Bình thường': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Bất thường': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Nguy hiểm': return 'text-error bg-error-container/20 border-error/30';
      default: return 'text-on-surface-variant bg-surface-container-low border-transparent';
    }
  };

  const getInputBorder = (status: string) => {
    switch (status) {
      case 'Bất thường': return 'border-amber-400 focus:ring-amber-400';
      case 'Nguy hiểm': return 'border-error focus:ring-error';
      default: return 'border-outline-variant/50 focus:border-primary focus:ring-primary';
    }
  };

  return (
    <div className="flex flex-col animate-fade-in pb-[100px]">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-[2rem] font-bold text-on-surface tracking-tight leading-tight">Nhập kết quả Xét nghiệm</h1>
        <p className="font-body text-sm text-on-surface-variant mt-1">Cập nhật chỉ số lâm sàng cho bệnh nhân</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          
          {/* Patient Info Card */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shadow-sm">
                 NA
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-on-surface mb-1">Nguyễn Văn An</h2>
                <div className="flex items-center gap-3 font-body text-sm text-on-surface-variant">
                  <span className="font-bold text-primary">BN-95201</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/50"></span>
                  <span>1979 - 45 tuổi</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/50"></span>
                  <span>Nam</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-8 text-right font-body text-sm">
              <div>
                <p className="text-on-surface-variant mb-1">Bác sĩ chỉ định</p>
                <p className="font-bold text-on-surface">BS. Lê Mạnh Hùng</p>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">Nội tổng quát</p>
              </div>
              <div className="w-px bg-outline-variant/30"></div>
              <div>
                <p className="text-on-surface-variant mb-1">Thời gian lấy mẫu</p>
                <p className="font-bold text-on-surface">14:30, 24/10/2023</p>
              </div>
            </div>
          </div>

          {/* Test List Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-body text-sm font-bold text-on-surface uppercase tracking-widest">Danh sách chỉ số xét nghiệm (Sinh hóa máu)</h3>
              <div className="flex items-center gap-4 text-xs font-body font-bold">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Bình thường</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Bất thường</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-error"></span> Nguy hiểm</div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Glucose Row */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-low shadow-sm flex items-center gap-6">
                <div className="w-1/3">
                  <h4 className="font-display font-bold text-on-surface text-lg">Glucose</h4>
                  <p className="font-body text-xs text-on-surface-variant mt-1">Đường huyết lúc đói</p>
                </div>
                <div className="flex-1">
                  <div className="relative w-48">
                    <input 
                      type="number" 
                      value={results.glucose}
                      onChange={(e) => setResults({...results, glucose: e.target.value})}
                      className={`w-full bg-surface-container-low border rounded-xl py-3 pl-4 pr-16 font-body text-lg font-bold text-on-surface focus:outline-none focus:ring-1 transition-all ${getInputBorder('Bất thường')}`} 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-sm text-on-surface-variant font-medium pointer-events-none">mmol/L</span>
                  </div>
                </div>
                <div className="w-48 text-center">
                  <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Ngưỡng tham chiếu</p>
                  <p className="font-body text-sm font-medium text-on-surface">3.9 - 6.4</p>
                </div>
                <div className="w-40 text-right">
                  <select className={`w-full appearance-none border rounded-xl px-4 py-3 font-body text-sm font-bold focus:outline-none cursor-pointer ${getStatusColor('Bất thường')}`}>
                    <option value="Bình thường">Bình thường</option>
                    <option value="Bất thường" selected>Bất thường</option>
                    <option value="Nguy hiểm">Nguy hiểm</option>
                  </select>
                </div>
              </div>

              {/* Cholesterol Row */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-low shadow-sm flex items-center gap-6">
                <div className="w-1/3">
                  <h4 className="font-display font-bold text-on-surface text-lg">Cholesterol</h4>
                  <p className="font-body text-xs text-on-surface-variant mt-1">Cholesterol toàn phần</p>
                </div>
                <div className="flex-1">
                  <div className="relative w-48">
                    <input 
                      type="number" 
                      placeholder="Nhập kết quả"
                      value={results.cholesterol}
                      onChange={(e) => setResults({...results, cholesterol: e.target.value})}
                      className={`w-full bg-surface-container-low border rounded-xl py-3 pl-4 pr-16 font-body text-lg font-bold text-on-surface focus:outline-none focus:ring-1 transition-all ${getInputBorder('Bình thường')}`} 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-sm text-on-surface-variant font-medium pointer-events-none">mmol/L</span>
                  </div>
                </div>
                <div className="w-48 text-center">
                  <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Ngưỡng tham chiếu</p>
                  <p className="font-body text-sm font-medium text-on-surface">{'< 5.2'}</p>
                </div>
                <div className="w-40 text-right">
                  <select className={`w-full appearance-none border rounded-xl px-4 py-3 font-body text-sm font-bold focus:outline-none cursor-pointer ${getStatusColor(results.cholesterol ? 'Bình thường' : '')}`}>
                    <option value="">Chọn trạng thái</option>
                    <option value="Bình thường">Bình thường</option>
                    <option value="Bất thường">Bất thường</option>
                    <option value="Nguy hiểm">Nguy hiểm</option>
                  </select>
                </div>
              </div>

              {/* Triglycerides Row */}
              <div className="bg-error-container/5 rounded-2xl p-5 border border-error/20 shadow-sm flex items-center gap-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error"></div>
                <div className="w-1/3 pl-2">
                  <h4 className="font-display font-bold text-on-surface text-lg">Triglycerides</h4>
                  <p className="font-body text-xs text-on-surface-variant mt-1">Chỉ số chất béo trong máu</p>
                </div>
                <div className="flex-1">
                  <div className="relative w-48">
                    <input 
                      type="number" 
                      value={results.triglycerides}
                      onChange={(e) => setResults({...results, triglycerides: e.target.value})}
                      className={`w-full bg-surface-container-lowest border rounded-xl py-3 pl-4 pr-16 font-body text-lg font-bold text-error focus:outline-none focus:ring-1 transition-all ${getInputBorder('Nguy hiểm')}`} 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-sm text-on-surface-variant font-medium pointer-events-none">mmol/L</span>
                  </div>
                </div>
                <div className="w-48 text-center">
                  <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Ngưỡng tham chiếu</p>
                  <p className="font-body text-sm font-medium text-on-surface">0.45 - 1.88</p>
                </div>
                <div className="w-40 text-right">
                  <select className={`w-full appearance-none border rounded-xl px-4 py-3 font-body text-sm font-bold focus:outline-none cursor-pointer ${getStatusColor('Nguy hiểm')}`}>
                    <option value="Bình thường">Bình thường</option>
                    <option value="Bất thường">Bất thường</option>
                    <option value="Nguy hiểm" selected>Nguy hiểm</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* Notes */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low">
             <label className="block font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Ghi chú của Kỹ thuật viên (Tùy chọn)</label>
             <textarea 
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 font-body text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 transition-all min-h-[120px] resize-y"
               placeholder="Nhập ghi chú hoặc quan sát thêm trong quá trình xét nghiệm..."
             ></textarea>
          </div>

        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-64 right-0 border-t border-surface-container-low p-4 bg-surface-container-lowest/90 backdrop-blur-md flex justify-between items-center z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2 text-on-surface-variant font-body text-sm font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Dữ liệu được lưu tự động lúc 14:55
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-3 rounded-xl border border-outline-variant/50 text-on-surface font-body font-bold text-sm hover:bg-surface-container-low transition-colors">
            Lưu kết quả
          </button>
          <button className="px-8 py-3 rounded-xl bg-primary text-white font-body font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
            Hoàn tất & Gửi bác sĩ
          </button>
        </div>
      </div>

    </div>
  );
};

export default LabResultEntryPage;
