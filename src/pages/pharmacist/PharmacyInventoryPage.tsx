import React, { useState } from 'react';

const mockInventory = [
  {
    id: 1,
    name: 'Amoxicillin 500mg',
    ingredient: 'Amoxicillin Trihydrate',
    unit: 'Viên nén',
    stock: 1500,
    maxStock: 2000,
    expiry: '15/08/2025',
    batch: 'LOT-2024-X1',
    status: 'good'
  },
  {
    id: 2,
    name: 'Paracetamol 500mg',
    ingredient: 'Acetaminophen',
    unit: 'Vỉ 10 viên',
    stock: 250,
    maxStock: 1000,
    expiry: '20/12/2024',
    batch: 'LOT-2024-Y2',
    status: 'warning'
  },
  {
    id: 3,
    name: 'Ceftriaxone 1g',
    ingredient: 'Ceftriaxone Sodium',
    unit: 'Lọ tiêm',
    stock: 45,
    maxStock: 500,
    expiry: '12/04/2024',
    batch: 'LOT-2023-Z3',
    status: 'critical'
  },
  {
    id: 4,
    name: 'Lisinopril 10mg',
    ingredient: 'Lisinopril',
    unit: 'Viên nén',
    stock: 850,
    maxStock: 1000,
    expiry: '30/11/2025',
    batch: 'LOT-2024-X4',
    status: 'good'
  },
  {
    id: 5,
    name: 'Metformin 500mg',
    ingredient: 'Metformin Hydrochloride',
    unit: 'Viên nén',
    stock: 120,
    maxStock: 800,
    expiry: '05/09/2024',
    batch: 'LOT-2024-M1',
    status: 'warning'
  }
];

const PharmacyInventoryPage: React.FC = () => {
  const [inventory] = useState(mockInventory);
  const [isLowStockOnly, setIsLowStockOnly] = useState(false);

  const filteredInventory = isLowStockOnly 
    ? inventory.filter(item => item.status === 'critical' || item.status === 'warning')
    : inventory;

  const getStockColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'critical': return 'bg-error';
      default: return 'bg-outline-variant';
    }
  };

  const getStockPercentage = (stock: number, maxStock: number) => {
    return Math.min(100, Math.max(0, (stock / maxStock) * 100));
  };

  const isNearExpiry = (dateString: string) => {
    // Simple mock logic: if year is 2024, consider it near or past expiry for visual effect
    return dateString.includes('2024');
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-on-surface tracking-tight leading-tight">Danh mục Dược phẩm</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">Quản lý kho thuốc, vật tư y tế và hạn sử dụng</p>
        </div>
        <button className="px-6 py-3 rounded-xl bg-primary text-white font-body font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Nhập lô thuốc
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest">Tổng SKU</h3>
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </span>
          </div>
          <div>
            <p className="font-display text-[2.5rem] font-bold text-on-surface leading-none">1,284</p>
            <p className="font-body text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              +12 <span className="text-on-surface-variant font-medium">tháng này</span>
            </p>
          </div>
        </div>

        <div className="bg-error-container/10 rounded-[24px] p-6 shadow-sm border border-error/20 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-body text-xs font-bold text-error uppercase tracking-widest">Sắp hết hàng</h3>
            <span className="bg-error/10 text-error font-bold text-[10px] px-2 py-1 rounded uppercase tracking-widest">Cảnh báo</span>
          </div>
          <div>
            <p className="font-display text-[2.5rem] font-bold text-error leading-none">42</p>
            <p className="font-body text-xs text-error font-medium mt-2">
              Yêu cầu nhập hàng ngay
            </p>
          </div>
        </div>

        <div className="bg-amber-50 rounded-[24px] p-6 shadow-sm border border-amber-200 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-body text-xs font-bold text-amber-700 uppercase tracking-widest">Sắp hết hạn</h3>
            <span className="w-8 h-8 rounded-full bg-amber-200 text-amber-700 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
          </div>
          <div>
            <p className="font-display text-[2.5rem] font-bold text-amber-700 leading-none">18</p>
            <p className="font-body text-xs text-amber-700 font-medium mt-2">
              Trong vòng 30 ngày tới
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Table Card */}
      <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient border border-surface-container-low flex flex-col overflow-hidden">
        
        {/* Filter Bar */}
        <div className="p-6 border-b border-surface-container-low flex flex-wrap gap-4 items-center justify-between bg-surface-container-lowest">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative w-72">
              <svg className="w-5 h-5 text-on-surface-variant absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Tìm kiếm tên thuốc, hoạt chất..." className="w-full bg-surface-container-low border border-transparent rounded-xl py-2.5 pl-11 pr-4 font-body text-sm text-on-surface focus:outline-none focus:border-primary transition-colors" />
            </div>
            
            <div className="h-6 w-px bg-outline-variant/30 hidden md:block"></div>

            <div className="flex items-center gap-2">
               <label className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hidden lg:block">Nhà cung cấp:</label>
               <select className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 font-body text-sm font-bold text-on-surface focus:outline-none focus:border-primary appearance-none">
                 <option>Tất cả</option>
                 <option>Dược Hậu Giang</option>
                 <option>Sanofi</option>
               </select>
            </div>

            <div className="flex items-center gap-2">
               <label className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hidden lg:block">Hạn dùng:</label>
               <select className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2.5 font-body text-sm font-bold text-on-surface focus:outline-none focus:border-primary appearance-none">
                 <option>Bất kỳ</option>
                 <option>{'<'} 30 ngày</option>
                 <option>{'<'} 90 ngày</option>
               </select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="font-body text-sm font-bold text-on-surface-variant">Tồn kho thấp</span>
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={isLowStockOnly} onChange={() => setIsLowStockOnly(!isLowStockOnly)} />
                <div className={`block w-10 h-6 rounded-full transition-colors ${isLowStockOnly ? 'bg-primary' : 'bg-outline-variant/50'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isLowStockOnly ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </label>
            <button className="p-2.5 rounded-xl border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low/50">
              <tr>
                <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Tên thuốc & Hoạt chất</th>
                <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Đơn vị</th>
                <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low w-48">Tồn kho</th>
                <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Hạn dùng</th>
                <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Lô nhập</th>
                <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-lowest/80 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-display text-sm font-bold text-on-surface">{item.name}</p>
                    <p className="font-body text-xs text-on-surface-variant mt-0.5">{item.ingredient}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-surface-container-low px-2.5 py-1 rounded-lg font-body text-xs font-bold text-on-surface-variant">{item.unit}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body text-sm font-bold text-on-surface">{item.stock.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStockColor(item.status)}`} 
                        style={{ width: `${getStockPercentage(item.stock, item.maxStock)}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`font-body text-sm font-bold ${isNearExpiry(item.expiry) ? 'text-error' : 'text-on-surface'}`}>
                      {item.expiry}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-body text-sm font-medium text-on-surface-variant">{item.batch}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant hover:text-primary transition-colors inline-flex">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-surface-container-low flex justify-between items-center bg-surface-container-lowest/50">
          <span className="font-body text-xs text-on-surface-variant font-medium">Hiển thị 1-10 trong số 1,284 thuốc</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-on-surface-variant disabled:opacity-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-body text-sm font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-on-surface font-body text-sm font-medium">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-on-surface font-body text-sm font-medium">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-on-surface-variant">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PharmacyInventoryPage;
