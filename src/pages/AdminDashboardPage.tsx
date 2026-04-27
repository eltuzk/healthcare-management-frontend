import React from 'react';

// Mock Data based on Stitch Screen 3d234322aaa944e791bf2b5fe4ff4dd5
const kpiData = [
  { label: 'Tổng bệnh nhân', value: '1,284', change: '+12%', positive: true },
  { label: 'Lịch hẹn chờ', value: '42', change: '-5%', positive: false },
  { label: 'Doanh thu tháng', value: '4.28B VNĐ', change: '+24%', positive: true },
  { label: 'Nhân sự đang trực', value: '156', status: 'Online', positive: true },
];

const todayAppointments = [
  { id: 1, patient: 'Nguyễn Văn A', doctor: 'Bs. Lê Minh', time: '08:30 AM', status: 'Đã đến', statusColor: 'bg-emerald-100 text-emerald-700' },
  { id: 2, patient: 'Trần Thị B', doctor: 'Bs. Robert Smith', time: '09:15 AM', status: 'Chờ khám', statusColor: 'bg-orange-100 text-orange-700' },
  { id: 3, patient: 'Lê Hoàng C', doctor: 'Bs. Sarah J.', time: '10:00 AM', status: 'Chờ khám', statusColor: 'bg-orange-100 text-orange-700' },
  { id: 4, patient: 'Phạm Minh D', doctor: 'Bs. Lê Minh', time: '10:45 AM', status: 'Hủy bỏ', statusColor: 'bg-red-100 text-red-700' },
];

const recentActivities = [
  { id: 1, action: 'Lịch hẹn mới được tạo', user: 'Lễ tân', time: '10:45 AM', type: 'info' },
  { id: 2, action: 'Thanh toán hoàn tất - INV-092', user: 'Thu ngân', time: '10:30 AM', type: 'success' },
  { id: 3, action: 'Cảnh báo kho: Vắc-xin sắp hết', user: 'Hệ thống', time: '09:15 AM', type: 'warning' },
  { id: 4, action: 'Đã tải lên kết quả XN BN #128', user: 'Khoa XN', time: '08:45 AM', type: 'info' },
];

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header Placeholder (Header.tsx already handles the main header, 
          but we might add secondary breadcrumbs or actions here if needed) */}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-surface-container-lowest rounded-[24px] shadow-ambient pt-8 px-8 pb-7 transition-all duration-300 hover:shadow-lg">
            <p className="font-body text-[0.75rem] font-bold tracking-wider uppercase text-on-surface-variant mb-3">
              {kpi.label}
            </p>
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-4xl font-bold text-on-surface tracking-tight">
                {kpi.value}
              </h3>
              {kpi.change && (
                <span className={`font-body text-[0.8rem] font-bold px-2 py-0.5 rounded-full ${kpi.positive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {kpi.change}
                </span>
              )}
              {kpi.status && (
                <span className="flex items-center gap-1.5 font-body text-[0.8rem] font-bold text-primary">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  {kpi.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Bar Chart (6 months) */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-[24px] shadow-ambient p-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-display text-xl font-bold text-on-surface">Doanh thu 6 tháng gần nhất</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-xs font-bold rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest transition-colors">Xuất file</button>
              <button className="px-4 py-2 text-xs font-bold rounded-lg bg-primary text-white shadow-sm hover:opacity-90 transition-opacity">Chi tiết</button>
            </div>
          </div>
          
          <div className="h-[280px] flex items-end justify-between gap-4 border-b border-surface-container-low pb-6 relative group">
             {/* Y-axis (mockup) */}
             <div className="absolute -left-2 top-0 bottom-6 flex flex-col justify-between text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest h-full">
               <span>5B</span>
               <span>2.5B</span>
               <span>0</span>
             </div>
             
             {/* Chart Bars (Months 5-10) */}
             <div className="pl-12 flex w-full items-end justify-between h-full gap-6">
               {[35, 52, 48, 70, 85, 95].map((val, idx) => (
                 <div key={idx} className="flex-1 flex flex-col justify-end h-full">
                   <div 
                     className="w-full bg-primary rounded-t-xl transition-all duration-500 shadow-sm relative group-hover:opacity-40 hover:!opacity-100 cursor-pointer" 
                     style={{ height: `${val}%` }}
                   >
                     {/* Tooltip on hover */}
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:group-hover:opacity-100 transition-opacity whitespace-nowrap">
                       {(val / 20).toFixed(2)}B VNĐ
                     </div>
                   </div>
                   <span className="text-center mt-4 text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-tighter">Tháng {idx + 5}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Patient Distribution Donut Chart (Mockup) */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-[24px] shadow-ambient p-8 flex flex-col">
          <h2 className="font-display text-xl font-bold text-on-surface mb-8">Phân bổ bệnh nhân</h2>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* CSS-only Donut Mockup */}
            <div className="relative w-40 h-40 rounded-full border-[16px] border-surface-container-low flex items-center justify-center">
               <div className="text-center">
                 <p className="text-2xl font-bold text-on-surface">1,284</p>
                 <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tổng cộng</p>
               </div>
               {/* Decorative segments */}
               <div className="absolute inset-[-16px] rounded-full border-[16px] border-transparent border-t-primary border-r-primary-container" style={{ transform: 'rotate(15deg)' }}></div>
            </div>
            
            <div className="mt-10 w-full space-y-4">
              {[
                { label: 'Quận 1', value: '45%', color: 'bg-primary' },
                { label: 'Quận 7', value: '30%', color: 'bg-primary-container' },
                { label: 'Bình Thạnh', value: '25%', color: 'bg-surface-container-highest' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Appointments Table */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-[24px] shadow-ambient p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-xl font-bold text-on-surface">Lịch hẹn hôm nay</h2>
            <button className="text-sm font-bold text-primary hover:underline">Xem tất cả</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-surface-container-low">
                  <th className="pb-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Bệnh nhân</th>
                  <th className="pb-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Bác sĩ</th>
                  <th className="pb-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Thời gian</th>
                  <th className="pb-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low/50">
                {todayAppointments.map((app) => (
                  <tr key={app.id} className="group hover:bg-surface-container-low/30 transition-colors">
                    <td className="py-4 font-body text-sm font-bold text-on-surface">{app.patient}</td>
                    <td className="py-4 font-body text-sm text-on-surface-variant">{app.doctor}</td>
                    <td className="py-4 font-body text-sm text-on-surface-variant">{app.time}</td>
                    <td className="py-4 text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${app.statusColor}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-[24px] shadow-ambient p-8">
          <h2 className="font-display text-xl font-bold text-on-surface mb-8">Hoạt động hệ thống</h2>
          <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-low">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-6 relative">
                <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  activity.type === 'success' ? 'bg-emerald-500 text-white' : 
                  activity.type === 'warning' ? 'bg-orange-500 text-white' : 
                  'bg-primary text-white'
                }`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d={
                      activity.type === 'success' ? 'M5 13l4 4L19 7' : 
                      activity.type === 'warning' ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' : 
                      'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    } />
                  </svg>
                </div>
                <div>
                  <p className="font-body text-sm font-bold text-on-surface leading-tight">{activity.action}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{activity.user}</span>
                    <span className="w-1 h-1 rounded-full bg-on-surface-variant/30"></span>
                    <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 rounded-xl border-2 border-surface-container-low text-on-surface-variant font-bold text-[10px] uppercase tracking-[0.15em] hover:bg-surface-container-low hover:text-on-surface transition-all">
            Xem tất cả lịch sử
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
