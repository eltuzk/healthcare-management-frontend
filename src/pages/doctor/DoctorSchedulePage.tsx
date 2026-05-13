import React, { useEffect, useState } from 'react';
import { getDoctorSchedules } from '../../services/scheduleService';
import { getDoctorMe } from '../../services/doctorService';
import { toast } from 'react-hot-toast';

const DoctorSchedulePage: React.FC = () => {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [doctorInfo, setDoctorInfo] = useState<any>(null);
    
    // Filters
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(1); // Start of month
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        d.setDate(0); // End of month
        return d.toISOString().split('T')[0];
    });

    const [currentMonth, setCurrentMonth] = useState(new Date());

    const fetchData = async () => {
        setLoading(true);
        try {
            const docRes = await getDoctorMe();
            setDoctorInfo(docRes);
            
            const schedRes = await getDoctorSchedules({ 
                doctorId: docRes.doctorId,
                startDate,
                endDate
            });
            setSchedules(Array.isArray(schedRes) ? schedRes : schedRes.content || []);
        } catch (error) {
            console.error("Error fetching schedules:", error);
            toast.error("Không thể tải lịch trực");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    // Calendar Helper Functions
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const days = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    
    const calendarDays = [];
    // Padding for first day
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let i = 1; i <= days; i++) calendarDays.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));

    const getSchedulesForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return schedules.filter(s => s.scheduleDate === dateStr);
    };

    const nextMonth = () => {
        const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        setCurrentMonth(next);
        setStartDate(new Date(next.getFullYear(), next.getMonth(), 1).toISOString().split('T')[0]);
        setEndDate(new Date(next.getFullYear(), next.getMonth() + 1, 0).toISOString().split('T')[0]);
    };

    const prevMonth = () => {
        const prev = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        setCurrentMonth(prev);
        setStartDate(new Date(prev.getFullYear(), prev.getMonth(), 1).toISOString().split('T')[0]);
        setEndDate(new Date(prev.getFullYear(), prev.getMonth() + 1, 0).toISOString().split('T')[0]);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Lịch trực cá nhân</h1>
                    <p className="text-slate-500">Bác sĩ: <span className="font-bold text-primary">{doctorInfo?.fullName}</span></p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 px-3">
                        <span className="text-xs font-bold text-slate-400 uppercase">Từ</span>
                        <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="text-sm font-medium outline-none border-none focus:ring-0"
                        />
                    </div>
                    <div className="h-4 w-[1px] bg-slate-200"></div>
                    <div className="flex items-center gap-2 px-3">
                        <span className="text-xs font-bold text-slate-400 uppercase">Đến</span>
                        <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="text-sm font-medium outline-none border-none focus:ring-0"
                        />
                    </div>
                    <button 
                        onClick={fetchData}
                        className="bg-primary text-white p-2 rounded-xl hover:bg-primary-dark transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800 capitalize">
                        Tháng {currentMonth.getMonth() + 1}, {currentMonth.getFullYear()}
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button onClick={() => setCurrentMonth(new Date())} className="px-4 py-2 hover:bg-slate-200 rounded-xl transition-colors text-sm font-bold text-slate-600 border border-slate-300">
                            Hôm nay
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 border-b border-slate-100">
                    {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                        <div key={day} className="py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 grid-rows-5 min-h-[600px]">
                    {calendarDays.map((date, idx) => {
                        if (!date) return <div key={`empty-${idx}`} className="border-r border-b border-slate-50 bg-slate-50/20"></div>;
                        
                        const daySchedules = getSchedulesForDate(date);
                        const isToday = date.toDateString() === new Date().toDateString();
                        
                        return (
                            <div key={date.toISOString()} className={`border-r border-b border-slate-100 p-2 hover:bg-slate-50 transition-colors group min-h-[120px] ${isToday ? 'bg-primary/5' : ''}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-white' : 'text-slate-600 group-hover:text-primary'}`}>
                                        {date.getDate()}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    {daySchedules.map(s => (
                                        <div 
                                            key={s.doctorScheduleId}
                                            className={`text-[10px] p-1.5 rounded-lg border flex flex-col gap-0.5 ${
                                                s.shift === 'MORNING' 
                                                ? 'bg-amber-50 border-amber-100 text-amber-800' 
                                                : 'bg-indigo-50 border-indigo-100 text-indigo-800'
                                            }`}
                                        >
                                            <div className="flex justify-between font-bold">
                                                <span>{s.shift === 'MORNING' ? 'Sáng' : 'Chiều'}</span>
                                                <span>{s.room?.roomCode}</span>
                                            </div>
                                            <div className="flex justify-between opacity-80 font-medium">
                                                <span>{s.currentBookingCount}/{s.maxCapacity} BN</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DoctorSchedulePage;
