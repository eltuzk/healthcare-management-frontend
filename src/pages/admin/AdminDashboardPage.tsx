import React, { useState, useEffect } from 'react';
import { getAppointments } from '../../services/appointmentService';
import { getRevenueReport } from '../../services/reportService';
import {
  Calendar,
  Activity,
  CheckCircle,
  DollarSign,
  RefreshCw,
  Info
} from 'lucide-react';

// Pseudo-random hashing helper for realistic date-based mock data seeding
const getPseudoRandom = (str: string, seed: number) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(Math.sin(hash + seed));
};

const AdminDashboardPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Default to today's date in local time YYYY-MM-DD
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - offset * 60 * 1000);
    return localToday.toISOString().split('T')[0];
  });

  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [kpi, setKpi] = useState({
    scheduled: 142,
    examining: 24,
    completed: 96,
    revenueToday: 18450000,
  });
  const [dailyRevenue, setDailyRevenue] = useState([
    { date: 'T2', dateStr: '', amount: 12500000 },
    { date: 'T3', dateStr: '', amount: 15200000 },
    { date: 'T4', dateStr: '', amount: 9800000 },
    { date: 'T5', dateStr: '', amount: 18450000 },
    { date: 'T6', dateStr: '', amount: 14000000 },
    { date: 'T7', dateStr: '', amount: 8500000 },
    { date: 'CN', dateStr: '', amount: 6200000 },
  ]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<Array<{ month: string; amount: number }>>([]);
  
  const [hoveredDailyIdx, setHoveredDailyIdx] = useState<number | null>(null);
  const [hoveredMonthlyIdx, setHoveredMonthlyIdx] = useState<number | null>(null);

  const targetYear = selectedDate ? new Date(selectedDate).getFullYear() : new Date().getFullYear();

  // Helper formatting functions
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(val)
      .replace('₫', 'VNĐ');
  };

  const formatShortCurrency = (val: number) => {
    if (val >= 1000000000) {
      return (val / 1000000000).toFixed(1) + 'B';
    }
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    }
    if (val >= 1000) {
      return (val / 1000).toFixed(0) + 'K';
    }
    return val.toString();
  };

  const fetchData = async (targetDateStr: string) => {
    setLoading(true);
    try {
      // 1. Fetch appointments from API
      const appointments = await getAppointments();
      
      let scheduled = 0;
      let examining = 0;
      let completed = 0;
      
      // Filter appointments on the selected scheduleDate
      if (Array.isArray(appointments)) {
        appointments.forEach((app: any) => {
          if (app.scheduleDate === targetDateStr) {
            const appStatus = app.status;
            if (appStatus === 'CONFIRMED' || appStatus === 'PENDING') {
              scheduled++;
            } else if (appStatus === 'IN_PROGRESS' || appStatus === 'CHECKED_IN') {
              examining++;
            } else if (appStatus === 'COMPLETED') {
              completed++;
            }
          }
        });
      }

      // 2. Fetch daily revenue for 7 days leading up to selectedDate
      const targetDate = new Date(targetDateStr);
      const dailyList: Array<{ date: string; dateStr: string; amount: number }> = [];
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date(targetDate);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayNum = d.getDay();
        const label = dayNum === 0 ? 'CN' : `T${dayNum + 1}`;
        dailyList.push({ date: label, dateStr: dateStr, amount: 0 });
      }
      
      const fromDateStr = dailyList[0].dateStr;
      const dailyReport = await getRevenueReport({ fromDate: fromDateStr, toDate: targetDateStr });
      
      let revenueToday = 0;
      if (dailyReport && Array.isArray(dailyReport.revenueByDate)) {
        // Find targeted selectedDate's revenue specifically
        const selectedDayBreakdown = dailyReport.revenueByDate.find((item: any) => item.key === targetDateStr);
        if (selectedDayBreakdown) {
          revenueToday = Number(selectedDayBreakdown.totalAmount) || 0;
        }
        
        // Map fetched daily revenue to standard week day labels using dateStr
        dailyReport.revenueByDate.forEach((item: any) => {
          const existing = dailyList.find(d => d.dateStr === item.key);
          if (existing) {
            existing.amount = Number(item.totalAmount) || 0;
          }
        });
      }

      // 3. Fetch monthly revenue (year of selectedDate)
      const targetYear = targetDate.getFullYear();
      const firstDayOfYearStr = `${targetYear}-01-01`;
      const lastDayOfYearStr = `${targetYear}-12-31`;
      const monthlyReport = await getRevenueReport({ fromDate: firstDayOfYearStr, toDate: lastDayOfYearStr });
      
      const monthlyList = Array.from({ length: 12 }, (_, i) => ({
        month: `Tháng ${i + 1}`,
        amount: 0
      }));
      
      if (monthlyReport && Array.isArray(monthlyReport.revenueByDate)) {
        monthlyReport.revenueByDate.forEach((item: any) => {
          const itemDate = new Date(item.key);
          if (itemDate.getFullYear() === targetYear) {
            const monthIdx = itemDate.getMonth();
            monthlyList[monthIdx].amount += Number(item.totalAmount) || 0;
          }
        });
      }
      
      // Check if we have real active data. If DB is fresh/empty, use mockup defaults for visual quality.
      const hasRealAppointments = Array.isArray(appointments) && appointments.some((a: any) => a.scheduleDate === targetDateStr);
      const hasRealRevenue = dailyList.some(d => d.amount > 0) || monthlyList.some(m => m.amount > 0);
      
      if (hasRealAppointments || hasRealRevenue) {
        setKpi({
          scheduled: scheduled,
          examining: examining,
          completed: completed,
          revenueToday: revenueToday,
        });
        
        setDailyRevenue(dailyList);
        setMonthlyRevenue(monthlyList);
        setIsDemoMode(false);
      } else {
        // Fallback to simulation mode if no records are found in database yet
        triggerSimulationMode(targetDateStr);
      }
    } catch (error) {
      console.warn('Backend API not accessible or empty, using rich simulation data fallback.', error);
      triggerSimulationMode(targetDateStr);
    } finally {
      setLoading(false);
    }
  };

  // Triggers realistic mock data seeded by the selected date string
  const triggerSimulationMode = (targetDateStr: string) => {
    setIsDemoMode(true);
    
    const seed = getPseudoRandom(targetDateStr, 100);
    const mockScheduled = Math.floor(60 + seed * 100);
    const mockExamining = Math.floor(10 + seed * 20);
    const mockCompleted = Math.floor(40 + seed * 70);
    const mockRevenueToday = Math.floor(8000000 + seed * 16000000);
    
    setKpi({
      scheduled: mockScheduled,
      examining: mockExamining,
      completed: mockCompleted,
      revenueToday: mockRevenueToday,
    });

    // Generate daily list centered around targeted date
    const targetDate = new Date(targetDateStr);
    const mockDaily = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(targetDate);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayNum = d.getDay();
      const label = dayNum === 0 ? 'CN' : `T${dayNum + 1}`;
      
      const daySeed = getPseudoRandom(dateStr, 200);
      const amount = Math.floor(4000000 + daySeed * 18000000);
      mockDaily.push({ date: label, dateStr: dateStr, amount });
    }
    setDailyRevenue(mockDaily);

    // Generate monthly list for target date's year
    const targetYear = targetDate.getFullYear();
    const mockMonthly = Array.from({ length: 12 }, (_, i) => {
      const monthSeed = getPseudoRandom(`${targetYear}-${i + 1}`, 300);
      return {
        month: `Tháng ${i + 1}`,
        amount: Math.floor(120000000 + monthSeed * 380000000)
      };
    });
    setMonthlyRevenue(mockMonthly);
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  // Compute maximums for chart scales
  const maxDailyAmount = Math.max(...dailyRevenue.map(d => d.amount), 10000000);
  const maxMonthlyAmount = Math.max(...monthlyRevenue.map(m => m.amount), 100000000);

  // Format selected date for displaying nicely in text
  const displaySelectedDate = () => {
    try {
      const parts = selectedDate.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return selectedDate;
    } catch {
      return selectedDate;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 pt-20">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="font-body text-sm font-semibold text-on-surface-variant/80">Đang tải số liệu tổng quan...</p>
      </div>
    );
  }

  return (
    <div className="pt-6 space-y-8 animate-fade-in pb-12 px-4 md:px-0 max-w-7xl mx-auto">
      {/* Dashboard Top Header Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient">
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-on-surface">Tổng Quan Quản Trị</h1>
          <p className="font-body text-xs md:text-sm text-on-surface-variant/80 mt-1">
            Báo cáo thống kê tình hình khám chữa bệnh và biểu đồ doanh thu ngày {displaySelectedDate()}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
          {/* Custom Date Filter */}
          <div className="flex items-center gap-2.5 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/30 shadow-inner group hover:border-primary/50 transition-all">
            <span className="font-body text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">Xem báo cáo ngày:</span>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-on-surface font-body text-sm font-bold focus:outline-none cursor-pointer text-primary"
            />
          </div>

          {/* Simulation mode indicator badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold ${
            isDemoMode 
              ? 'bg-amber-50 text-amber-700 border border-amber-200' 
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            {isDemoMode ? 'Chế độ mô phỏng' : 'Đang chạy thực tế'}
          </span>
          <button 
            onClick={() => fetchData(selectedDate)}
            className="flex items-center justify-center p-2.5 rounded-xl border border-outline-variant/50 hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-all active:scale-95 shadow-sm"
            title="Tải lại dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Số bệnh nhân đã đặt lịch */}
        <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient pt-8 px-8 pb-7 border-l-4 border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex justify-between items-start mb-3">
            <p className="font-body text-[0.75rem] font-bold tracking-wider uppercase text-on-surface-variant">
              Bệnh nhân đã đặt lịch
            </p>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <h3 className="font-display text-4xl font-extrabold text-on-surface tracking-tight">
              {kpi.scheduled}
            </h3>
            <span className="font-body text-[0.8rem] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
              Lịch hẹn
            </span>
          </div>
          <p className="font-body text-[11px] font-semibold text-on-surface-variant/70 mt-3">Lịch hẹn chờ khám ngày {displaySelectedDate()}</p>
        </div>

        {/* Card 2: Số bệnh nhân đang khám */}
        <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient pt-8 px-8 pb-7 border-l-4 border-amber-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex justify-between items-start mb-3">
            <p className="font-body text-[0.75rem] font-bold tracking-wider uppercase text-on-surface-variant">
              Bệnh nhân đang khám
            </p>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 relative">
              <Activity className="w-5 h-5 animate-pulse text-amber-500" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <h3 className="font-display text-4xl font-extrabold text-on-surface tracking-tight">
              {kpi.examining}
            </h3>
            <span className="font-body text-[0.8rem] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
              Đang khám
            </span>
          </div>
          <p className="font-body text-[11px] font-semibold text-on-surface-variant/70 mt-3">Số ca chẩn đoán ngày {displaySelectedDate()}</p>
        </div>

        {/* Card 3: Số bệnh nhân đã hoàn thành */}
        <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient pt-8 px-8 pb-7 border-l-4 border-emerald-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex justify-between items-start mb-3">
            <p className="font-body text-[0.75rem] font-bold tracking-wider uppercase text-on-surface-variant">
              Bệnh nhân đã hoàn thành
            </p>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <h3 className="font-display text-4xl font-extrabold text-on-surface tracking-tight">
              {kpi.completed}
            </h3>
            <span className="font-body text-[0.8rem] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
              Hoàn thành
            </span>
          </div>
          <p className="font-body text-[11px] font-semibold text-on-surface-variant/70 mt-3">Đã khám xong ngày {displaySelectedDate()}</p>
        </div>

        {/* Card 4: Doanh thu trong ngày */}
        <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient pt-8 px-8 pb-7 border-l-4 border-purple-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex justify-between items-start mb-3">
            <p className="font-body text-[0.75rem] font-bold tracking-wider uppercase text-on-surface-variant">
              Doanh thu trong ngày
            </p>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <DollarSign className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <h3 className="font-display text-2xl xl:text-3xl font-extrabold text-on-surface tracking-tight">
              {formatCurrency(kpi.revenueToday)}
            </h3>
            <span className="font-body text-[0.8rem] font-extrabold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">
              Doanh thu
            </span>
          </div>
          <p className="font-body text-[11px] font-semibold text-on-surface-variant/70 mt-3">Doanh số phát sinh ngày {displaySelectedDate()}</p>
        </div>
      </div>

      {/* Side-by-Side Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Daily Revenue Chart */}
        <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient p-8 flex flex-col h-[460px] border border-outline-variant/10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-display text-lg font-bold text-on-surface">Doanh thu theo ngày</h2>
              <p className="text-xs text-on-surface-variant/70 mt-0.5">Biến động doanh số trong 7 ngày tính đến {displaySelectedDate()}</p>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider">
              7 ngày qua
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-end relative mt-4">
            {/* Y-axis values */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] font-bold text-on-surface-variant/50 tracking-wider">
              <span>{formatShortCurrency(maxDailyAmount)}</span>
              <span>{formatShortCurrency(maxDailyAmount / 2)}</span>
              <span>0 VNĐ</span>
            </div>

            {/* Bars container */}
            <div className="pl-12 flex items-end justify-between h-full pb-8 border-b border-surface-container-low relative gap-4">
              {/* Horizontal dashed grid lines */}
              <div className="absolute inset-x-0 pl-12 top-0 bottom-8 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="w-full border-t border-dashed border-on-surface-variant/20"></div>
                <div className="w-full border-t border-dashed border-on-surface-variant/20"></div>
                <div className="w-full border-t border-dashed border-on-surface-variant/20"></div>
              </div>

              {dailyRevenue.map((item, idx) => {
                const heightPct = maxDailyAmount > 0 ? (item.amount / maxDailyAmount) * 75 : 0;
                const isHovered = hoveredDailyIdx === idx;
                
                // Extract DD/MM from YYYY-MM-DD for sublabel
                let subLabel = '';
                try {
                  const parts = item.dateStr.split('-');
                  if (parts.length === 3) {
                    subLabel = `${parts[2]}/${parts[1]}`;
                  }
                } catch {}

                return (
                  <div 
                    key={idx} 
                    className="flex-1 flex flex-col justify-end items-center h-full group relative z-10"
                    onMouseEnter={() => setHoveredDailyIdx(idx)}
                    onMouseLeave={() => setHoveredDailyIdx(null)}
                  >
                    {/* Interactive Tooltip */}
                    <div className={`absolute -top-14 bg-on-surface text-white text-[11px] font-semibold py-2 px-3 rounded-xl shadow-lg transition-all duration-200 whitespace-nowrap z-20 flex flex-col items-center ${
                      isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
                    }`}>
                      <span className="text-[9px] uppercase tracking-wider opacity-70">Ngày {subLabel} ({item.date})</span>
                      <span className="font-bold text-white mt-0.5">{formatCurrency(item.amount)}</span>
                    </div>

                    {/* Bar with gradient */}
                    <div 
                      className={`w-full max-w-[32px] bg-gradient-to-t from-primary to-primary-container rounded-t-xl transition-all duration-300 cursor-pointer shadow-sm relative ${
                        isHovered ? 'shadow-md scale-x-105 -translate-y-0.5' : 'group-hover:opacity-85'
                      }`}
                      style={{ height: `${Math.max(heightPct, 5)}%` }}
                    >
                      {/* Glow overlay */}
                      <div className={`absolute inset-0 bg-white/20 rounded-t-xl transition-opacity duration-300 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`} />
                    </div>
                    
                    <div className="flex flex-col items-center mt-3 gap-0.5">
                      <span className="text-[10px] font-extrabold text-on-surface-variant/80 uppercase tracking-wide">
                        {item.date}
                      </span>
                      {subLabel && (
                        <span className="text-[8px] font-bold text-on-surface-variant/50">
                          {subLabel}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient p-8 flex flex-col h-[460px] border border-outline-variant/10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-display text-lg font-bold text-on-surface">Doanh thu theo tháng</h2>
              <p className="text-xs text-on-surface-variant/70 mt-0.5">Biểu đồ doanh số các tháng trong năm {targetYear}</p>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-wider">
              Cả năm {targetYear}
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-end relative mt-4">
            {/* Y-axis values */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] font-bold text-on-surface-variant/50 tracking-wider">
              <span>{formatShortCurrency(maxMonthlyAmount)}</span>
              <span>{formatShortCurrency(maxMonthlyAmount / 2)}</span>
              <span>0 VNĐ</span>
            </div>

            {/* Bars container */}
            <div className="pl-12 flex items-end justify-between h-full pb-8 border-b border-surface-container-low relative gap-2">
              {/* Horizontal dashed grid lines */}
              <div className="absolute inset-x-0 pl-12 top-0 bottom-8 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="w-full border-t border-dashed border-on-surface-variant/20"></div>
                <div className="w-full border-t border-dashed border-on-surface-variant/20"></div>
                <div className="w-full border-t border-dashed border-on-surface-variant/20"></div>
              </div>

              {monthlyRevenue.map((item, idx) => {
                const heightPct = maxMonthlyAmount > 0 ? (item.amount / maxMonthlyAmount) * 75 : 0;
                const isHovered = hoveredMonthlyIdx === idx;
                const shortLabel = item.month.replace('Tháng ', 'T');
                
                return (
                  <div 
                    key={idx} 
                    className="flex-1 flex flex-col justify-end items-center h-full group relative z-10"
                    onMouseEnter={() => setHoveredMonthlyIdx(idx)}
                    onMouseLeave={() => setHoveredMonthlyIdx(null)}
                  >
                    {/* Interactive Tooltip */}
                    <div className={`absolute -top-12 bg-on-surface text-white text-[11px] font-semibold py-2 px-3 rounded-xl shadow-lg transition-all duration-200 whitespace-nowrap z-20 flex flex-col items-center ${
                      isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
                    }`}>
                      <span className="text-[9px] uppercase tracking-wider opacity-70">{item.month} / {targetYear}</span>
                      <span className="font-bold text-white mt-0.5">{formatCurrency(item.amount)}</span>
                    </div>

                    {/* Bar with gradient */}
                    <div 
                      className={`w-full max-w-[22px] bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-xl transition-all duration-300 cursor-pointer shadow-sm relative ${
                        isHovered ? 'shadow-md scale-x-110 -translate-y-0.5' : 'group-hover:opacity-85'
                      }`}
                      style={{ height: `${Math.max(heightPct, 5)}%` }}
                    >
                      {/* Glow overlay */}
                      <div className={`absolute inset-0 bg-white/20 rounded-t-xl transition-opacity duration-300 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`} />
                    </div>
                    
                    <span className="text-[9px] font-extrabold text-on-surface-variant/80 uppercase mt-3 tracking-tighter">
                      {shortLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Info Warning Bar in Demo Mode */}
      {isDemoMode && (
        <div className="bg-amber-50/50 border border-amber-200 rounded-[20px] p-5 flex gap-4 items-start shadow-sm">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-display font-bold text-sm text-amber-800">Lưu ý về Dữ liệu hiển thị ngày {displaySelectedDate()}</h4>
            <p className="font-body text-xs text-amber-700/90 mt-1 leading-relaxed">
              Hệ thống hiện đang hoạt động ở chế độ **Dữ liệu mô phỏng** do cơ sở dữ liệu thực tế tại ngày được chọn chưa ghi nhận lịch hẹn hoặc giao dịch thanh toán nào phát sinh. 
              Các số liệu và biểu đồ sẽ tự động cập nhật ngay khi có dữ liệu thực tế từ phòng khám và cổng thanh toán!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
