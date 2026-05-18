import React, { useState, useEffect } from 'react';
import * as reportService from '../../services/reportService';
import { toast } from 'react-hot-toast';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const RevenueReportsPage: React.FC = () => {
  const [reportData, setReportData] = useState<reportService.RevenueReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchReport();
  }, [dateRange]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await reportService.getRevenueReport({
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate
      });
      setReportData(data);
    } catch (error) {
      toast.error('Không thể tải báo cáo doanh thu');
    } finally {
      setLoading(false);
    }
  };

  const summaryMetrics = [
    { 
      title: 'Tổng Doanh thu', 
      value: reportData ? formatCurrency(reportData.totalRevenue) : '0 ₫', 
      indicator: reportData ? `${reportData.transactionCount} giao dịch` : '0 giao dịch', 
      status: 'success' 
    },
    { 
      title: 'Doanh thu Lịch hẹn', 
      value: reportData?.revenueByOwnerType.find(r => r.key === 'APPOINTMENT')?.totalAmount 
        ? formatCurrency(reportData.revenueByOwnerType.find(r => r.key === 'APPOINTMENT')!.totalAmount) 
        : '0 ₫', 
      indicator: 'Khám bệnh', 
      status: 'info' 
    },
    { 
      title: 'Doanh thu Hồ sơ', 
      value: reportData?.revenueByOwnerType.find(r => r.key === 'MEDICAL_RECORD')?.totalAmount 
        ? formatCurrency(reportData.revenueByOwnerType.find(r => r.key === 'MEDICAL_RECORD')!.totalAmount) 
        : '0 ₫', 
      indicator: 'Điều trị', 
      status: 'warning' 
    },
    { 
      title: 'Cổng thanh toán', 
      value: reportData?.revenueByGateway.length ? `${reportData.revenueByGateway.length} cổng` : 'N/A', 
      indicator: reportData?.revenueByGateway.map(g => g.key).join(', ') || 'Chưa có dữ liệu', 
      status: 'info' 
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="font-display text-[2.5rem] font-black text-on-surface tracking-tight leading-tight">Báo cáo Doanh thu</h1>
          <p className="font-body text-sm text-on-surface-variant mt-2 font-medium">Dữ liệu tài chính thực tế từ hệ thống thanh toán</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center bg-white shadow-ambient rounded-2xl px-4 py-3 border border-outline-variant/10 text-on-surface text-sm font-bold font-body gap-4">
             <div className="flex items-center gap-2">
                <span className="text-[10px] text-on-surface-variant uppercase">Từ:</span>
                <input 
                  type="date" 
                  value={dateRange.fromDate} 
                  onChange={(e) => setDateRange(prev => ({ ...prev, fromDate: e.target.value }))}
                  className="outline-none bg-transparent"
                />
             </div>
             <div className="w-[1px] h-4 bg-outline-variant/30"></div>
             <div className="flex items-center gap-2">
                <span className="text-[10px] text-on-surface-variant uppercase">Đến:</span>
                <input 
                  type="date" 
                  value={dateRange.toDate} 
                  onChange={(e) => setDateRange(prev => ({ ...prev, toDate: e.target.value }))}
                  className="outline-none bg-transparent"
                />
             </div>
          </div>
          
          <button className="bg-primary text-white font-body font-bold text-sm px-6 py-3 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all">
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low animate-pulse">
              <div className="h-4 w-24 bg-surface-container-low rounded mb-4"></div>
              <div className="h-8 w-32 bg-surface-container-low rounded"></div>
            </div>
          ))
        ) : summaryMetrics.map((metric, idx) => (
          <div key={idx} className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low group hover:border-primary/20 transition-all">
            <h3 className="font-body text-[10px] font-black uppercase tracking-[0.15em] text-on-surface-variant/60 mb-3">{metric.title}</h3>
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
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-[24px] p-8 shadow-ambient border border-surface-container-low flex flex-col h-[450px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-display font-black text-xl text-on-surface">Biến động Doanh thu theo Ngày</h3>
          </div>
          <div className="flex-1 w-full bg-surface-container-low/20 rounded-[20px] border border-dashed border-outline-variant/30 flex items-center justify-center p-4">
             {loading ? (
               <div className="flex items-center gap-3">
                 <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                 <span className="font-body text-sm font-bold text-on-surface-variant">Đang tải biểu đồ...</span>
               </div>
             ) : reportData?.revenueByDate.length ? (
               <div className="w-full h-full flex items-end gap-2 px-4">
                  {reportData.revenueByDate.slice(-15).map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                       <div 
                         className="w-full bg-primary/20 group-hover:bg-primary transition-all rounded-t-lg" 
                         style={{ height: `${(d.totalAmount / (Math.max(...reportData.revenueByDate.map(x => x.totalAmount)) || 1)) * 100}%` }}
                       >
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                           {formatCurrency(d.totalAmount)}
                         </div>
                       </div>
                       <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter transform -rotate-45 origin-top-left">{d.key.split('-').slice(1).join('/')}</span>
                    </div>
                  ))}
               </div>
             ) : (
               <p className="font-body text-sm font-bold text-on-surface-variant/40">Không có dữ liệu trong khoảng thời gian này</p>
             )}
          </div>
        </div>

        {/* Bar Chart Placeholder */}
        <div className="lg:col-span-1 bg-surface-container-lowest rounded-[24px] p-8 shadow-ambient border border-surface-container-low flex flex-col h-[450px]">
          <h3 className="font-display font-black text-xl text-on-surface mb-8">Tỷ trọng Nguồn thu</h3>
          <div className="flex-1 flex flex-col justify-center gap-8">
            {reportData?.revenueByOwnerType.map((owner, i) => {
              const percentage = reportData.totalRevenue > 0 ? (owner.totalAmount / reportData.totalRevenue) * 100 : 0;
              const colors = ['bg-primary', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500'];
              const textColors = ['text-primary', 'text-emerald-500', 'text-purple-500', 'text-orange-500'];
              return (
                <div key={i}>
                  <div className="flex justify-between font-body text-[10px] font-black tracking-widest text-on-surface-variant/60 mb-2 uppercase">
                    <span>{owner.key === 'APPOINTMENT' ? 'KHÁM BỆNH (LỊCH HẸN)' : 'ĐIỀU TRỊ (HỒ SƠ)'}</span>
                    <span className={textColors[i % colors.length]}>{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-4 w-full bg-surface-container-low rounded-full overflow-hidden">
                    <div className={`h-full ${colors[i % colors.length]} rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
                  </div>
                  <p className="font-display text-sm font-bold text-on-surface mt-2">{formatCurrency(owner.totalAmount)}</p>
                </div>
              );
            }) || <div className="text-center text-on-surface-variant/40 font-body text-sm">Chưa có dữ liệu phân loại</div>}
          </div>
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className="bg-surface-container-lowest rounded-[32px] shadow-ambient overflow-hidden border border-outline-variant/10">
        <div className="p-8 border-b border-surface-container-low flex justify-between items-center">
          <div>
            <h3 className="font-display font-black text-xl text-on-surface">Phân bổ theo Cổng thanh toán</h3>
            <p className="font-body text-[10px] font-black text-on-surface-variant/50 tracking-[0.2em] uppercase mt-2">DỮ LIỆU THỰC TẾ TRÊN HỆ THỐNG</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/30 border-b border-outline-variant/10">
                <th className="py-6 px-8 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Cổng thanh toán</th>
                <th className="py-6 px-8 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Số giao dịch</th>
                <th className="py-6 px-8 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Tổng doanh thu</th>
                <th className="py-6 px-8 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] text-right">Tỷ trọng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {loading ? (
                 <tr><td colSpan={4} className="py-10 text-center text-on-surface-variant font-body">Đang tải dữ liệu bảng...</td></tr>
              ) : reportData?.revenueByGateway.length ? reportData.revenueByGateway.map((g, idx) => (
                <tr key={idx} className="group hover:bg-primary/[0.02] transition-colors">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center font-black text-primary text-xs">{g.key.charAt(0)}</div>
                      <p className="font-display font-bold text-on-surface group-hover:text-primary transition-colors">{g.key}</p>
                    </div>
                  </td>
                  <td className="py-5 px-8 font-body text-sm font-bold text-on-surface-variant">{g.transactionCount} lượt</td>
                  <td className="py-5 px-8 font-display font-black text-on-surface">{formatCurrency(g.totalAmount)}</td>
                  <td className="py-5 px-8 text-right">
                    <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-lg">
                      {((g.totalAmount / reportData.totalRevenue) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="py-20 text-center text-on-surface-variant/40 font-body">Không có dữ liệu thanh toán nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueReportsPage;
