import React from 'react';

// Mock Data
const summaryMetrics = [
  { title: 'Tổng Doanh thu', value: '2.450.000.000 ₫', indicator: '+12.5%', status: 'success' },
  { title: 'Đã thu', value: '1.980.000.000 ₫', indicator: '85%', status: 'info' },
  { title: 'Chờ thu', value: '320.000.000 ₫', indicator: 'Cần xử lý', status: 'error' },
  { title: 'Bảo hiểm Y tế', value: '150.000.000 ₫', indicator: 'Tạm tính', status: 'warning' },
];

const branchesData = [
  { id: 1, name: 'Chi nhánh Quận 1', isHQ: true, revenue: '1.240.000.000 ₫', visits: '4,520', growth: '+14.2%' },
  { id: 2, name: 'Chi nhánh Quận 7', isHQ: false, revenue: '850.000.000 ₫', visits: '3,100', growth: '+8.5%' },
  { id: 3, name: 'Chi nhánh Bình Thạnh', isHQ: false, revenue: '360.000.000 ₫', visits: '1,250', growth: '-2.1%' },
];

const RevenueReportsPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-on-surface tracking-tight leading-tight">Báo cáo Doanh thu</h1>
          <p className="font-body text-sm text-on-surface-variant mt-2">Dữ liệu tài chính tổng hợp từ tất cả các chi nhánh</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-surface-container-low rounded-xl p-1 flex">
            <button className="px-4 py-2 text-sm font-bold font-body rounded-lg bg-surface-container-lowest text-primary shadow-sm transition-all">Tháng</button>
            <button className="px-4 py-2 text-sm font-bold font-body rounded-lg text-on-surface-variant hover:text-on-surface transition-all">Quý</button>
            <button className="px-4 py-2 text-sm font-bold font-body rounded-lg text-on-surface-variant hover:text-on-surface transition-all">Năm</button>
          </div>
          
          <div className="flex items-center bg-surface-container-low rounded-xl px-4 py-2 border border-outline-variant/30 text-on-surface-variant text-sm font-bold font-body gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            01/01/2024 - 31/03/2024
          </div>
          
          <div className="flex gap-2">
            <button className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-body font-bold text-sm px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Excel
            </button>
            <button className="bg-error-container/30 text-error hover:bg-error-container/50 font-body font-bold text-sm px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryMetrics.map((metric, idx) => (
          <div key={idx} className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low group hover:border-outline-variant/30 transition-colors">
            <h3 className="font-body text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">{metric.title}</h3>
            <p className="font-display text-2xl font-bold text-on-surface mb-4">{metric.value}</p>
            <div className="flex items-center gap-2">
              <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                metric.status === 'success' ? 'bg-emerald-500/10 text-emerald-600' :
                metric.status === 'error' ? 'bg-error-container/30 text-error' :
                metric.status === 'warning' ? 'bg-orange-500/10 text-orange-600' :
                'bg-primary/10 text-primary'
              }`}>
                {metric.indicator}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart Placeholder */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-lg text-on-surface">Biến động Doanh thu</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div><span className="font-body text-xs text-on-surface-variant font-medium">Khám</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="font-body text-xs text-on-surface-variant font-medium">XN</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div><span className="font-body text-xs text-on-surface-variant font-medium">Thuốc</span></div>
            </div>
          </div>
          {/* Mock Chart Area */}
          <div className="flex-1 w-full bg-surface-container-low/30 rounded-xl border border-dashed border-outline-variant/50 flex items-center justify-center relative overflow-hidden">
             {/* Simple visual mock of a chart */}
             <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-outline-variant/30"></div>
             <div className="absolute bottom-0 left-0 w-full flex items-end justify-between px-4 h-3/4 opacity-30 pointer-events-none">
                <div className="w-1/6 h-full border-b border-primary relative"><div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full transform translate-x-1.5 -translate-y-1.5"></div></div>
                <div className="w-1/6 h-3/4 border-b border-primary relative"><div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full transform translate-x-1.5 -translate-y-1.5"></div></div>
                <div className="w-1/6 h-5/6 border-b border-primary relative"><div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full transform translate-x-1.5 -translate-y-1.5"></div></div>
                <div className="w-1/6 h-1/2 border-b border-primary relative"><div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full transform translate-x-1.5 -translate-y-1.5"></div></div>
                <div className="w-1/6 h-full border-b border-primary relative"><div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full transform translate-x-1.5 -translate-y-1.5"></div></div>
             </div>
             <p className="font-body text-sm font-bold text-on-surface-variant/50">Biểu đồ đang tải dữ liệu...</p>
          </div>
        </div>

        {/* Bar Chart Placeholder */}
        <div className="lg:col-span-1 bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low flex flex-col h-[400px]">
          <h3 className="font-display font-bold text-lg text-on-surface mb-6">Tỷ trọng Dịch vụ</h3>
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div>
              <div className="flex justify-between font-body text-xs font-bold text-on-surface-variant mb-2">
                <span>KHÁM LÂM SÀNG</span>
                <span className="text-primary">42%</span>
              </div>
              <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between font-body text-xs font-bold text-on-surface-variant mb-2">
                <span>XÉT NGHIỆM & CĐHA</span>
                <span className="text-emerald-500">21%</span>
              </div>
              <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '21%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between font-body text-xs font-bold text-on-surface-variant mb-2">
                <span>NHÀ THUỐC</span>
                <span className="text-purple-500">18%</span>
              </div>
              <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between font-body text-xs font-bold text-on-surface-variant mb-2">
                <span>NỘI TRÚ & THỦ THUẬT</span>
                <span className="text-orange-500">9%</span>
              </div>
              <div className="h-3 w-full bg-surface-container-low rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '9%' }}></div>
              </div>
            </div>
          </div>
          <button className="mt-4 text-primary font-body text-sm font-bold flex items-center justify-center gap-2 hover:underline">
            Xem chi tiết báo cáo
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient overflow-hidden border border-surface-container-low">
        <div className="p-6 border-b border-surface-container-low flex justify-between items-center">
          <div>
            <h3 className="font-display font-bold text-lg text-on-surface">Chi tiết theo Chi nhánh</h3>
            <p className="font-body text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mt-1">DỮ LIỆU THỰC TẾ THỜI GIAN THỰC</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-surface-container-low">
                <th className="py-4 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest w-2/5">Chi nhánh</th>
                <th className="py-4 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tổng doanh thu</th>
                <th className="py-4 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Lượt khám</th>
                <th className="py-4 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tăng trưởng</th>
                <th className="py-4 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low/50">
              {branchesData.map((branch) => (
                <tr key={branch.id} className="group hover:bg-surface-container-low/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <p className="font-body text-sm font-bold text-on-surface">{branch.name}</p>
                      {branch.isHQ && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider rounded-md">Trụ sở chính</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 font-display font-bold text-on-surface">{branch.revenue}</td>
                  <td className="py-4 px-6 font-body text-sm font-medium text-on-surface-variant">{branch.visits}</td>
                  <td className="py-4 px-6">
                    <span className={`font-body text-xs font-bold ${branch.growth.startsWith('+') ? 'text-emerald-600' : 'text-error'}`}>
                      {branch.growth}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueReportsPage;
