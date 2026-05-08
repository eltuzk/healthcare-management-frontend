import React, { useState } from 'react';

const mockPatients = [
  {
    id: 'BN-20240502',
    name: 'Nguyễn Văn An',
    ageInfo: '1979 (45 tuổi)',
    gender: 'Nam',
    type: 'Nội trú',
    department: 'Hồi sức cấp cứu (ICU)',
    status: 'Chờ thanh toán',
    date: '08/05/2026 14:15',
    items: [
      { id: 1, category: 'Khám', name: 'Khám chuyên khoa Tim mạch', qty: 1, price: 150000, total: 150000 },
      { id: 2, category: 'Xét nghiệm', name: 'Tổng phân tích tế bào máu', qty: 1, price: 320000, total: 320000 },
      { id: 3, category: 'Chẩn đoán hình ảnh', name: 'X-Quang ngực thẳng', qty: 1, price: 280000, total: 280000 },
      { id: 4, category: 'Thuốc', name: 'Augmentin 1g', qty: 2, price: 185000, total: 370000 },
    ]
  },
  {
    id: 'BN-20240503',
    name: 'Lê Thị Hoa',
    ageInfo: '1985 (39 tuổi)',
    gender: 'Nữ',
    type: 'Ngoại trú',
    department: 'Khoa Phụ sản',
    status: 'Chờ thanh toán',
    date: '08/05/2026 14:05',
    items: [
      { id: 1, category: 'Khám', name: 'Khám chuyên khoa Phụ sản', qty: 1, price: 150000, total: 150000 },
      { id: 2, category: 'Siêu âm', name: 'Siêu âm thai 4D', qty: 1, price: 450000, total: 450000 },
      { id: 3, category: 'Thuốc', name: 'Vitamin Tổng hợp', qty: 1, price: 250000, total: 250000 },
    ]
  },
  {
    id: 'BN-20240504',
    name: 'Trần Khắc Việt',
    ageInfo: '1992 (32 tuổi)',
    gender: 'Nam',
    type: 'Ngoại trú',
    department: 'Tai Mũi Họng',
    status: 'Chờ thanh toán',
    date: '08/05/2026 13:45',
    items: [
      { id: 1, category: 'Khám', name: 'Khám chuyên khoa TMH', qty: 1, price: 150000, total: 150000 },
      { id: 2, category: 'Thủ thuật', name: 'Nội soi Tai Mũi Họng', qty: 1, price: 300000, total: 300000 },
    ]
  },
  {
    id: 'BN-20240505',
    name: 'Phạm Thị Mai',
    ageInfo: '1965 (59 tuổi)',
    gender: 'Nữ',
    type: 'Nội trú',
    department: 'Nội tiết',
    status: 'Chờ thanh toán',
    date: '08/05/2026 11:30',
    items: [
      { id: 1, category: 'Khám', name: 'Khám Nội tiết', qty: 1, price: 150000, total: 150000 },
      { id: 2, category: 'Xét nghiệm', name: 'Xét nghiệm đường huyết', qty: 1, price: 120000, total: 120000 },
    ]
  },
  {
    id: 'BN-20240506',
    name: 'Bùi Tuấn Anh',
    ageInfo: '2001 (23 tuổi)',
    gender: 'Nam',
    type: 'Ngoại trú',
    department: 'Da liễu',
    status: 'Đã thanh toán',
    date: '08/05/2026 10:15',
    items: [
      { id: 1, category: 'Khám', name: 'Khám Da liễu', qty: 1, price: 150000, total: 150000 },
      { id: 2, category: 'Thuốc', name: 'Thuốc bôi ngoài da', qty: 1, price: 210000, total: 210000 },
    ]
  }
];

const HospitalFeeCollectionPage: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'card'>('cash');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('all');
  
  const handleSelectPatient = (id: string) => {
    setSelectedPatientId(id);
    setView('detail');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedPatientId(null);
  };

  if (view === 'list') {
    const filteredPatients = mockPatients.filter(p => filterType === 'all' ? true : p.type === filterType);
    
    return (
      <div className="flex flex-col h-full animate-fade-in pb-12">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="font-display text-[2rem] font-bold text-on-surface tracking-tight leading-tight">Danh sách Thu viện phí</h1>
            <p className="font-body text-sm text-on-surface-variant mt-1">Quản lý bệnh nhân chờ thanh toán</p>
          </div>
          
          <div className="flex gap-4">
             <div className="relative">
               <svg className="w-5 h-5 text-on-surface-variant absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               <input 
                 type="text" 
                 placeholder="Tìm kiếm mã BN, tên..." 
                 className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-3 pl-11 pr-4 font-body text-sm font-medium text-on-surface focus:outline-none focus:border-primary shadow-sm min-w-[300px]"
               />
             </div>
             <select 
               value={filterType}
               onChange={(e) => setFilterType(e.target.value)}
               className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm font-bold text-on-surface focus:outline-none focus:border-primary shadow-sm appearance-none"
             >
               <option value="all">Tất cả đối tượng</option>
               <option value="Nội trú">Nội trú</option>
               <option value="Ngoại trú">Ngoại trú</option>
             </select>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient border border-surface-container-low overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/50 sticky top-0 z-10">
                <tr>
                  <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Mã BN</th>
                  <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Họ và tên</th>
                  <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Đối tượng</th>
                  <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Khoa</th>
                  <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Thời gian</th>
                  <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low text-right">Tổng tiền</th>
                  <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low text-center">Trạng thái</th>
                  <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {filteredPatients.map(patient => {
                  const total = patient.items.reduce((sum, item) => sum + item.total, 0);
                  const isPaid = patient.status === 'Đã thanh toán';
                  return (
                    <tr key={patient.id} className={`hover:bg-surface-container-lowest/80 transition-colors ${isPaid ? 'opacity-60' : ''}`}>
                      <td className="py-4 px-6 font-body text-sm font-bold text-on-surface">{patient.id}</td>
                      <td className="py-4 px-6">
                        <p className="font-display text-sm font-bold text-on-surface">{patient.name}</p>
                        <p className="font-body text-xs text-on-surface-variant mt-0.5">{patient.ageInfo} • {patient.gender}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-body text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded uppercase tracking-widest border border-primary/20">
                          {patient.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-body text-sm text-on-surface-variant font-medium">{patient.department}</td>
                      <td className="py-4 px-6 font-body text-sm text-on-surface-variant">{patient.date}</td>
                      <td className="py-4 px-6 font-body text-sm font-bold text-primary text-right">{total.toLocaleString()} đ</td>
                      <td className="py-4 px-6 text-center">
                         <span className={`font-body text-xs font-bold px-2.5 py-1 rounded-full ${
                           isPaid ? 'bg-surface-container-highest text-on-surface-variant' : 'bg-amber-100 text-amber-700'
                         }`}>
                           {patient.status}
                         </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => handleSelectPatient(patient.id)}
                          className="font-body text-xs font-bold bg-surface-container-low hover:bg-primary/10 text-primary px-4 py-2 rounded-lg transition-colors"
                        >
                          {isPaid ? 'Xem chi tiết' : 'Thu tiền'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Detail View
  const selectedPatient = mockPatients.find(p => p.id === selectedPatientId) || mockPatients[0];
  const totalAmount = selectedPatient.items.reduce((sum, item) => sum + item.total, 0);
  const insuranceCoverage = totalAmount * 0.8; // 80% coverage
  const finalAmount = totalAmount - insuranceCoverage;

  return (
    <div className="flex flex-col animate-fade-in pb-12">
      
      {/* Header & Back Action */}
      <div className="mb-6">
        <button 
          onClick={handleBackToList}
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-body text-sm font-bold transition-colors mb-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Quay lại danh sách
        </button>
        <h1 className="font-display text-[2rem] font-bold text-on-surface tracking-tight leading-tight">Chi tiết Thu viện phí</h1>
        <p className="font-body text-sm text-on-surface-variant mt-1">Hoàn tất thanh toán cho bệnh nhân {selectedPatient.name}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Patient Services */}
        <div className="flex-1 space-y-6">
          
          {/* Patient Card */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shadow-sm">
                 {selectedPatient.name.split(' ').pop()?.[0]}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="font-display text-xl font-bold text-on-surface">{selectedPatient.name}</h2>
                  <span className="font-body text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded uppercase tracking-widest border border-primary/20">
                    {selectedPatient.type}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-body text-sm text-on-surface-variant">
                  <span className="font-bold text-on-surface">{selectedPatient.id}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/50"></span>
                  <span>{selectedPatient.ageInfo}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/50"></span>
                  <span>{selectedPatient.gender}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Khoa điều trị</p>
              <p className="font-body text-sm font-bold text-on-surface">{selectedPatient.department}</p>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient border border-surface-container-low overflow-hidden flex flex-col">
            <div className="p-5 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-display font-bold text-lg text-on-surface">Chi tiết Dịch vụ & Đơn thuốc</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low/50">
                  <tr>
                    <th className="py-3 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Phân mục</th>
                    <th className="py-3 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Nội dung dịch vụ</th>
                    <th className="py-3 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low text-center">SL</th>
                    <th className="py-3 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low text-right">Đơn giá</th>
                    <th className="py-3 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {selectedPatient.items.map(item => (
                    <tr key={item.id} className="hover:bg-surface-container-lowest/80 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container-low px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-display text-sm font-bold text-on-surface">{item.name}</p>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-body text-sm font-medium text-on-surface">{item.qty}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-body text-sm text-on-surface-variant">{item.price.toLocaleString()} đ</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-body text-sm font-bold text-on-surface">{item.total.toLocaleString()} đ</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>

        {/* Right Column: Payment Actions */}
        <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col space-y-6">
          
          <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low sticky top-6">
            <h3 className="font-display font-bold text-xl text-on-surface mb-6">Tóm tắt thanh toán</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-on-surface-variant font-medium">Tổng phí dịch vụ</span>
                <span className="font-body text-sm font-bold text-on-surface">{totalAmount.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-body text-sm text-on-surface-variant font-medium">Bảo hiểm Y tế (BHYT)</span>
                  <span className="font-body text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">80%</span>
                </div>
                <span className="font-body text-sm font-bold text-emerald-600">- {insuranceCoverage.toLocaleString()} đ</span>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/30 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-body text-sm font-bold text-on-surface-variant">Thành tiền phải trả</span>
                <span className="font-display text-4xl font-black text-primary tracking-tight">{finalAmount.toLocaleString()} đ</span>
              </div>
            </div>

            {selectedPatient.status === 'Đã thanh toán' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <svg className="w-8 h-8 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="font-body font-bold text-emerald-800">Đã hoàn tất thanh toán</p>
                <button className="mt-3 w-full py-2 rounded-lg border-2 border-emerald-500 text-emerald-600 font-body font-bold text-sm hover:bg-emerald-100 transition-colors">
                  In lại hóa đơn
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h4 className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Phương thức thanh toán</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'cash' 
                          ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                          : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/50'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      <span className="font-body text-xs font-bold">Tiền mặt</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('transfer')}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'transfer' 
                          ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                          : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/50'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                      <span className="font-body text-xs font-bold">Chuyển khoản</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'card' 
                          ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                          : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/50'
                      }`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      <span className="font-body text-xs font-bold">Thẻ</span>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleBackToList}
                  className="w-full py-4 rounded-xl bg-primary text-white font-body font-bold text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  Ghi nhận giao dịch & In hóa đơn
                </button>
                <p className="font-body text-[11px] text-on-surface-variant text-center mt-4">
                  Hóa đơn điện tử sẽ được gửi qua email.<br/>Hồ sơ bệnh án được cập nhật tự động.
                </p>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HospitalFeeCollectionPage;
