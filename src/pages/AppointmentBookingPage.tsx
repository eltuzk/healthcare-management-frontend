import React, { useState } from 'react';

const AppointmentBookingPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState('Khám tổng quát');
  const [selectedDate, setSelectedDate] = useState('24');
  const [selectedTime, setSelectedTime] = useState('09:00 SA');

  const services = [
    { id: 'S1', name: 'Khám tổng quát', price: '200.000đ' },
    { id: 'S2', name: 'Khám chuyên khoa Tim mạch', price: '300.000đ' },
    { id: 'S3', name: 'Khám chuyên khoa Tiêu hóa', price: '300.000đ' },
  ];

  const dates = [
    { day: 'T2', date: '23' },
    { day: 'T3', date: '24' },
    { day: 'T4', date: '25' },
    { day: 'T5', date: '26' },
    { day: 'T6', date: '27' },
    { day: 'T7', date: '28' },
    { day: 'CN', date: '29' },
  ];

  const morningSlots = ['08:00 SA', '08:30 SA', '09:00 SA', '09:30 SA', '10:00 SA', '10:30 SA'];
  const afternoonSlots = ['01:30 CH', '02:00 CH', '02:30 CH', '03:00 CH', '03:30 CH', '04:00 CH'];

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col relative animate-fade-in pb-[90px]">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-[2rem] font-bold text-on-surface tracking-tight leading-tight">Đặt lịch hẹn</h1>
        <p className="font-body text-sm text-on-surface-variant mt-1">Sắp xếp lịch khám cho bệnh nhân</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        
        {/* Left Column: Patient & Service */}
        <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
          
          {/* Patient Selection */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest">Thông tin Bệnh nhân</h3>
               <button className="text-primary font-body text-xs font-bold flex items-center gap-1 hover:underline">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                 Tạo hồ sơ mới
               </button>
             </div>
             
             {/* Search input mock */}
             <div className="relative mb-4">
               <svg className="w-5 h-5 text-on-surface-variant absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               <input type="text" placeholder="Tìm kiếm bệnh nhân (Tên, SĐT, Mã...)" className="w-full bg-surface-container-low border border-transparent rounded-xl py-3 pl-10 pr-4 font-body text-sm text-on-surface focus:outline-none focus:border-primary transition-colors" value="Nguyễn Văn An" readOnly />
             </div>

             {/* Selected Patient Card */}
             <div className="bg-surface-container-low rounded-xl p-4 border border-primary/20">
               <div className="flex gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-xl">
                   NA
                 </div>
                 <div>
                   <h4 className="font-display font-bold text-on-surface">Nguyễn Văn An</h4>
                   <p className="font-body text-[10px] text-on-surface-variant uppercase tracking-widest mt-0.5">Mã: BN-20230405</p>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-y-2 mt-4 pt-4 border-t border-outline-variant/30 font-body text-xs">
                 <p className="text-on-surface-variant">Giới tính: <strong className="text-on-surface">Nam</strong></p>
                 <p className="text-on-surface-variant">Tuổi: <strong className="text-on-surface">42</strong></p>
                 <p className="text-on-surface-variant">Nhóm máu: <strong className="text-on-surface">O+</strong></p>
                 <p className="text-on-surface-variant">SĐT: <strong className="text-on-surface">0901***789</strong></p>
               </div>
               <div className="mt-4 flex flex-wrap gap-2">
                 <span className="bg-error-container/20 text-error px-2 py-1 rounded text-[10px] font-bold tracking-wider">Cao huyết áp</span>
                 <span className="bg-error-container/20 text-error px-2 py-1 rounded text-[10px] font-bold tracking-wider">Dị ứng Penicillin</span>
               </div>
             </div>
          </div>

          {/* Service Selection */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low">
            <h3 className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Dịch vụ yêu cầu</h3>
            <div className="space-y-3">
              {services.map(service => (
                <div 
                  key={service.id}
                  onClick={() => setSelectedService(service.name)}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                    selectedService === service.name ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/50'
                  }`}
                >
                  <span className={`font-body text-sm font-bold ${selectedService === service.name ? 'text-primary' : 'text-on-surface'}`}>
                    {service.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-body text-xs text-on-surface-variant font-medium">{service.price}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedService === service.name ? 'border-primary bg-primary' : 'border-outline-variant'
                    }`}>
                      {selectedService === service.name && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Scheduling */}
        <div className="flex-1 bg-surface-container-lowest rounded-[24px] shadow-ambient border border-surface-container-low flex flex-col p-6 overflow-y-auto custom-scrollbar">
           
           {/* Doctor Selection */}
           <div className="mb-8">
             <h3 className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Chọn Bác sĩ</h3>
             <select className="w-full bg-surface-container-low border border-transparent rounded-xl p-4 font-body text-sm font-bold text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none">
               <option>BS. Phạm Minh Hoàng (Tim mạch)</option>
               <option>BS. Lê Minh Thuận (Tổng quát)</option>
             </select>
           </div>

           {/* Date Selection */}
           <div className="mb-8">
             <div className="flex justify-between items-end mb-4">
               <h3 className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest">Tháng 10, 2023</h3>
               <div className="flex gap-2">
                 <button className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                 </button>
                 <button className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                 </button>
               </div>
             </div>
             <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
               {dates.map(d => (
                 <button 
                   key={d.date}
                   onClick={() => setSelectedDate(d.date)}
                   className={`flex-1 min-w-[70px] flex flex-col items-center p-3 rounded-xl border transition-all ${
                     selectedDate === d.date ? 'bg-primary border-primary text-white shadow-md' : 'bg-surface-container-lowest border-outline-variant/30 hover:border-primary/50 text-on-surface'
                   }`}
                 >
                   <span className={`font-body text-[10px] font-bold uppercase tracking-widest mb-1 ${selectedDate === d.date ? 'text-white/80' : 'text-on-surface-variant'}`}>{d.day}</span>
                   <span className="font-display text-xl font-bold">{d.date}</span>
                 </button>
               ))}
             </div>
           </div>

           {/* Time Selection */}
           <div className="mb-8 flex-1">
             <h3 className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Chọn giờ khám</h3>
             
             <div className="mb-6">
               <h4 className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-3">
                 <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                 Buổi sáng
               </h4>
               <div className="grid grid-cols-3 gap-3">
                 {morningSlots.map(time => (
                   <button 
                     key={time}
                     onClick={() => setSelectedTime(time)}
                     className={`py-2.5 rounded-lg font-body text-sm font-bold border transition-all ${
                       selectedTime === time ? 'bg-primary border-primary text-white shadow-md' : 'bg-surface-container-low border-transparent hover:border-outline-variant text-on-surface'
                     }`}
                   >
                     {time}
                   </button>
                 ))}
               </div>
             </div>

             <div>
               <h4 className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-3">
                 <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                 Buổi chiều
               </h4>
               <div className="grid grid-cols-3 gap-3">
                 {afternoonSlots.map(time => (
                   <button 
                     key={time}
                     onClick={() => setSelectedTime(time)}
                     className={`py-2.5 rounded-lg font-body text-sm font-bold border transition-all ${
                       selectedTime === time ? 'bg-primary border-primary text-white shadow-md' : 'bg-surface-container-low border-transparent hover:border-outline-variant text-on-surface'
                     }`}
                   >
                     {time}
                   </button>
                 ))}
               </div>
             </div>
           </div>

           {/* Confirmation Box */}
           <div className="mt-auto bg-primary/10 rounded-xl p-4 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
             <p className="font-body text-sm text-primary font-medium text-center sm:text-left">
               XÁC NHẬN LỊCH HẸN: <br/>
               <strong className="font-display text-lg font-bold">Thứ Ba, {selectedDate} Tháng 10 @ {selectedTime}</strong>
             </p>
           </div>
        </div>

      </div>

      {/* Sticky Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-surface-container-low p-4 bg-surface-container-lowest/80 backdrop-blur-md flex justify-between items-center rounded-b-[24px]">
         <div className="flex items-center gap-4 hidden sm:flex">
           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">NA</div>
           <div>
             <p className="font-display font-bold text-on-surface">Nguyễn Văn An</p>
             <p className="font-body text-xs text-on-surface-variant">{selectedService}</p>
           </div>
         </div>
         <div className="flex gap-3 w-full sm:w-auto">
           <button className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-surface-container-low text-on-surface font-body font-bold text-sm hover:bg-surface-container-high transition-colors">
             Hủy bỏ
           </button>
           <button className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-primary text-white font-body font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
             Xác nhận đặt lịch
           </button>
         </div>
      </div>
    </div>
  );
};

export default AppointmentBookingPage;
