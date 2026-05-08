import React, { useState } from 'react';

const mockWaitingList = [
  { id: '#RX-2023-9921', patient: 'Nguyễn Văn An', time: '14:25 Hôm nay', doctor: 'BS. Trần Thị Thu', itemsCount: 4, active: true },
  { id: '#RX-2023-9922', patient: 'Lê Minh Khang', time: '14:10 Hôm nay', doctor: 'BS. Phạm Minh Tuấn', itemsCount: 2, active: false },
  { id: '#RX-2023-9923', patient: 'Trần Thị Mai', time: '13:55 Hôm nay', doctor: 'BS. Lê Hoàng Long', itemsCount: 5, active: false },
  { id: '#RX-2023-9924', patient: 'Phạm Văn Hùng', time: '13:30 Hôm nay', doctor: 'BS. Trần Thị Thu', itemsCount: 1, active: false },
];

const mockPrescriptionItems = [
  { id: 1, name: 'Amlodipine 5mg', instruction: 'Viên nén • Ngày uống 1 lần', requestQty: 30, unit: 'Viên', stock: 1240, stockStatus: 'Đủ hàng', note: '' },
  { id: 2, name: 'Atorvastatin 20mg', instruction: 'Viên nén • Ngày uống 1 lần (Tối)', requestQty: 30, unit: 'Viên', stock: 500, stockStatus: 'Đủ hàng', note: '' },
  { id: 3, name: 'Telmisartan 40mg', instruction: 'Viên nén • Ngày uống 1 lần', requestQty: 30, unit: 'Viên', stock: 12, stockStatus: 'Sắp hết', note: 'Thiếu 18 viên' },
  { id: 4, name: 'Aspirin 81mg', instruction: 'Viên nén • Ngày uống 1 lần', requestQty: 30, unit: 'Viên', stock: 850, stockStatus: 'Đủ hàng', note: '' },
];

const PrescriptionDispensingPage: React.FC = () => {
  const [dispenseValues, setDispenseValues] = useState<{ [key: number]: number }>({
    1: 30,
    2: 30,
    3: 12, // Automatically limited by low stock
    4: 30
  });
  const [autoPrint, setAutoPrint] = useState(true);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col relative animate-fade-in pb-[90px]">
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-on-surface tracking-tight leading-tight">Cấp phát Đơn thuốc</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">Quản lý hàng đợi và cấp phát thuốc cho bệnh nhân</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        
        {/* Left Column: Waiting Queue */}
        <div className="w-full lg:w-[360px] flex-shrink-0 flex flex-col bg-surface-container-lowest rounded-[24px] shadow-ambient border border-surface-container-low overflow-hidden">
          <div className="p-5 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest sticky top-0 z-10">
            <h3 className="font-display font-bold text-lg text-on-surface">Danh sách chờ</h3>
            <span className="bg-primary/10 text-primary font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest">12 Đơn mới</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
            {mockWaitingList.map(item => (
              <div 
                key={item.id} 
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  item.active 
                    ? 'border-primary bg-primary/5 shadow-sm relative' 
                    : 'border-outline-variant/30 bg-surface-container-lowest hover:border-primary/50'
                }`}
              >
                {item.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"></div>}
                <div className="flex justify-between items-start mb-2">
                  <span className="font-body text-xs font-bold text-primary">{item.id}</span>
                  <span className="font-body text-xs text-on-surface-variant">{item.time}</span>
                </div>
                <h4 className="font-display font-bold text-on-surface text-base mb-1">{item.patient}</h4>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-body text-xs text-on-surface-variant">{item.doctor}</span>
                  <span className="font-body text-[10px] font-bold text-on-surface-variant bg-surface-container-low px-2 py-1 rounded uppercase tracking-widest">{item.itemsCount} loại thuốc</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed View */}
        <div className="flex-1 bg-surface-container-lowest rounded-[24px] shadow-ambient border border-surface-container-low flex flex-col overflow-y-auto custom-scrollbar">
          
          <div className="p-6 space-y-6">
            
            {/* Warning Banner */}
            <div className="bg-error-container/20 border border-error/30 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-error mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <div>
                <p className="font-body text-sm font-bold text-error">Cảnh báo tồn kho</p>
                <p className="font-body text-xs text-error/80 mt-1">Một số loại thuốc sắp hết hàng. Vui lòng kiểm tra lại số lượng trước khi xác nhận.</p>
              </div>
            </div>

            {/* Patient Card */}
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30">
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-outline-variant/30">
                 <div>
                   <span className="font-body text-xs font-bold text-primary mb-1 block">#RX-2023-9921</span>
                   <h2 className="font-display text-xl font-bold text-on-surface">Nguyễn Văn An</h2>
                   <p className="font-body text-xs text-on-surface-variant mt-1">Nam, 45 tuổi</p>
                 </div>
                 <div className="text-right">
                   <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Bác sĩ chỉ định</p>
                   <p className="font-body text-sm font-bold text-on-surface">BS. Trần Thị Thu</p>
                   <p className="font-body text-xs text-on-surface-variant mt-0.5">Khoa Nội Tim Mạch</p>
                 </div>
              </div>
              <div>
                <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Chẩn đoán</p>
                <p className="font-body text-sm font-bold text-on-surface">ICD-10: I10 - Cao huyết áp</p>
              </div>
            </div>

            {/* Prescription Table */}
            <div className="border border-outline-variant/30 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low/50 border-b border-outline-variant/30">
                  <tr>
                    <th className="py-3 px-4 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tên thuốc</th>
                    <th className="py-3 px-4 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Yêu cầu</th>
                    <th className="py-3 px-4 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Tồn kho</th>
                    <th className="py-3 px-4 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center w-32">Cấp phát</th>
                    <th className="py-3 px-4 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {mockPrescriptionItems.map(item => (
                    <tr key={item.id} className={item.stockStatus === 'Sắp hết' ? 'bg-error-container/5' : ''}>
                      <td className="py-4 px-4">
                        <p className="font-display text-sm font-bold text-on-surface">{item.name}</p>
                        <p className="font-body text-[10px] text-on-surface-variant mt-1">{item.instruction}</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-body text-base font-bold text-on-surface">{item.requestQty}</span>
                        <span className="font-body text-[10px] text-on-surface-variant ml-1 uppercase tracking-widest">{item.unit}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-body text-sm font-bold ${item.stockStatus === 'Sắp hết' ? 'text-error' : 'text-emerald-600'}`}>
                          {item.stockStatus === 'Sắp hết' ? `Kho: ${item.stock}` : item.stock.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <input 
                          type="number" 
                          value={dispenseValues[item.id]}
                          onChange={(e) => setDispenseValues({...dispenseValues, [item.id]: parseInt(e.target.value) || 0})}
                          className={`w-full text-center bg-surface-container-lowest border rounded-lg py-2 font-body text-sm font-bold focus:outline-none transition-all ${
                            item.stockStatus === 'Sắp hết' 
                              ? 'border-error text-error focus:ring-1 focus:ring-error' 
                              : 'border-outline-variant/50 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary'
                          }`}
                        />
                      </td>
                      <td className="py-4 px-4">
                        {item.note ? (
                          <span className="font-body text-[10px] font-bold text-error uppercase tracking-widest bg-error-container/20 px-2 py-1 rounded">
                            {item.note}
                          </span>
                        ) : (
                          <button className="text-on-surface-variant hover:text-primary transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>

      {/* Sticky Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-surface-container-low p-4 bg-surface-container-lowest/80 backdrop-blur-md flex justify-between items-center rounded-b-[24px]">
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={autoPrint} 
            onChange={(e) => setAutoPrint(e.target.checked)}
            className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
          />
          <span className="font-body text-sm font-medium text-on-surface">Tự động in nhãn thuốc sau khi xác nhận</span>
        </label>
        
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-xl text-on-surface-variant font-body font-bold text-sm hover:bg-surface-container-low transition-colors">
            Tạm hoãn
          </button>
          <button className="px-8 py-3 rounded-xl bg-primary text-white font-body font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            Xác nhận cấp phát
          </button>
        </div>
      </div>

    </div>
  );
};

export default PrescriptionDispensingPage;
