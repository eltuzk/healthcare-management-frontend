import React, { useState } from 'react';

type BedStatus = 'occupied' | 'empty' | 'maintenance';

interface Bed {
  id: string;
  status: BedStatus;
  patient?: {
    name: string;
    admission: string;
  };
  price: number;
}

interface Room {
  id: string;
  name: string;
  type: 'VIP' | 'Tiêu chuẩn';
  beds: Bed[];
}

const mockRooms: Room[] = [
  {
    id: 'R301',
    name: 'Phòng 301',
    type: 'VIP',
    beds: [
      { id: '301.1', status: 'occupied', patient: { name: 'Nguyễn Văn An', admission: '14/10/2023' }, price: 1200000 },
      { id: '301.2', status: 'empty', price: 1200000 },
    ]
  },
  {
    id: 'R302',
    name: 'Phòng 302',
    type: 'Tiêu chuẩn',
    beds: [
      { id: '302.1', status: 'occupied', patient: { name: 'Lê Thị Bình', admission: '15/10/2023' }, price: 450000 },
      { id: '302.2', status: 'occupied', patient: { name: 'Trần Minh Cường', admission: '16/10/2023' }, price: 450000 },
      { id: '302.3', status: 'maintenance', price: 450000 },
      { id: '302.4', status: 'empty', price: 450000 },
    ]
  },
  {
    id: 'R303',
    name: 'Phòng 303',
    type: 'Tiêu chuẩn',
    beds: [
      { id: '303.1', status: 'empty', price: 450000 },
      { id: '303.2', status: 'empty', price: 450000 },
      { id: '303.3', status: 'empty', price: 450000 },
      { id: '303.4', status: 'empty', price: 450000 },
    ]
  }
];

const mockICUBeds: Bed[] = [
  { id: 'ICU.1', status: 'occupied', patient: { name: 'Phạm Đức Dũng', admission: '10/10/2023' }, price: 3500000 },
  { id: 'ICU.2', status: 'occupied', patient: { name: 'Võ Thị Em', admission: '12/10/2023' }, price: 3500000 },
  { id: 'ICU.3', status: 'occupied', patient: { name: 'Hoàng Kim', admission: '13/10/2023' }, price: 3500000 },
  { id: 'ICU.4', status: 'empty', price: 3500000 },
  { id: 'ICU.5', status: 'maintenance', price: 3500000 },
  { id: 'ICU.6', status: 'empty', price: 3500000 },
];

const InpatientBedMapPage: React.FC = () => {
  const [selectedBed, setSelectedBed] = useState<Bed | null>(mockRooms[0].beds[0]);

  const getStatusColor = (status: BedStatus) => {
    switch (status) {
      case 'occupied': return 'bg-primary border-primary text-white';
      case 'maintenance': return 'bg-amber-400 border-amber-400 text-white';
      case 'empty': return 'bg-surface-container-highest border-outline-variant/30 text-on-surface-variant';
    }
  };

  const getStatusLabel = (status: BedStatus) => {
    switch (status) {
      case 'occupied': return 'Đang dùng';
      case 'maintenance': return 'Bảo trì';
      case 'empty': return 'Trống';
    }
  };

  return (
    <div className="flex flex-col animate-fade-in relative">
      
      {/* Header & Filters */}
      <div className="flex justify-between items-end mb-6 sticky top-0 z-20 bg-[#f8fafc] pb-2">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-on-surface tracking-tight leading-tight">Sơ đồ Giường Nội trú</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">Quản lý sức chứa và phân bổ bệnh nhân</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-low px-4 py-2 flex items-center gap-4 shadow-sm">
             <div className="flex flex-col">
               <span className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tổng sức chứa</span>
               <span className="font-display text-xl font-bold text-primary">42 <span className="text-sm text-on-surface-variant font-medium">/ 60</span></span>
             </div>
          </div>
          <select className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm font-bold text-on-surface focus:outline-none focus:border-primary shadow-sm appearance-none">
            <option>Khoa Nội Tổng Hợp</option>
            <option>Khoa Ngoại Thần Kinh</option>
            <option>Khoa Nhi</option>
          </select>
          <select className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm font-bold text-on-surface focus:outline-none focus:border-primary shadow-sm appearance-none">
            <option>Tầng 3</option>
            <option>Tầng 4</option>
            <option>Tầng 5</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        
        {/* Main Map Area */}
        <div className="flex-1 flex flex-col gap-8 pb-20 pr-2">
          
          {/* Legend */}
          <div className="flex items-center gap-6 bg-surface-container-lowest py-3 px-5 rounded-2xl border border-surface-container-low shadow-sm">
            <span className="font-body text-sm font-bold text-on-surface-variant">Chú giải:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary"></div>
              <span className="font-body text-sm text-on-surface">Đang dùng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-surface-container-highest border border-outline-variant/30"></div>
              <span className="font-body text-sm text-on-surface">Trống</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-400"></div>
              <span className="font-body text-sm text-on-surface">Bảo trì</span>
            </div>
          </div>

          {/* Area A: Normal Rooms */}
          <section>
            <h2 className="font-display font-bold text-xl text-on-surface mb-4 flex items-center gap-2">
              Khu vực A: Dãy Phòng 301 - 308
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {mockRooms.map(room => (
                <div key={room.id} className="bg-surface-container-lowest rounded-2xl border border-surface-container-low shadow-ambient p-5 flex flex-col">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-surface-container-low">
                    <h3 className="font-display font-bold text-lg text-on-surface">{room.name}</h3>
                    <span className="bg-primary/10 text-primary font-bold text-[10px] px-2 py-1 rounded uppercase tracking-widest">{room.type}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    {room.beds.map(bed => (
                      <button 
                        key={bed.id}
                        onClick={() => setSelectedBed(bed)}
                        className={`relative rounded-xl border-2 p-3 text-left transition-all hover:scale-[1.02] ${
                          selectedBed?.id === bed.id 
                            ? 'border-primary ring-2 ring-primary/20 shadow-md' 
                            : 'border-transparent'
                        } ${getStatusColor(bed.status)}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-body font-bold text-sm">{bed.id}</span>
                          <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M3 6h18M3 18h18" /></svg>
                        </div>
                        {bed.status === 'occupied' && bed.patient && (
                          <div className="mt-1">
                            <p className="font-body text-xs font-medium opacity-90 truncate">{bed.patient.name}</p>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ICU Area */}
          <section>
            <h2 className="font-display font-bold text-xl text-error mb-4 flex items-center gap-2">
              Cách ly đặc biệt: Phòng Hồi sức Tập trung
            </h2>
            <div className="bg-error-container/5 rounded-2xl border border-error/20 p-6">
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                 {mockICUBeds.map(bed => (
                    <button 
                      key={bed.id}
                      onClick={() => setSelectedBed(bed)}
                      className={`relative rounded-xl border-2 p-3 text-left transition-all hover:scale-[1.02] ${
                        selectedBed?.id === bed.id 
                          ? 'border-error ring-2 ring-error/20 shadow-md' 
                          : 'border-transparent'
                      } ${getStatusColor(bed.status)}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-body font-bold text-sm">{bed.id}</span>
                        <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                      {bed.status === 'occupied' && bed.patient && (
                        <div className="mt-1">
                          <p className="font-body text-xs font-medium opacity-90 truncate">{bed.patient.name}</p>
                        </div>
                      )}
                    </button>
                 ))}
               </div>
            </div>
          </section>

        </div>

        {/* Side Panel: Bed Details */}
        <div className="w-[340px] sticky top-[100px] h-[calc(100vh-140px)] flex-shrink-0 flex flex-col bg-surface-container-lowest rounded-[24px] shadow-ambient border border-surface-container-low overflow-hidden">
          {selectedBed ? (
            <>
              <div className="p-6 border-b border-surface-container-low bg-surface-container-lowest relative">
                <span className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Chi tiết Giường bệnh</span>
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-3xl text-on-surface">Giường {selectedBed.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedBed.status === 'occupied' ? 'bg-primary/10 text-primary' : 
                    selectedBed.status === 'maintenance' ? 'bg-amber-100 text-amber-700' : 
                    'bg-surface-container-highest text-on-surface-variant'
                  }`}>
                    {getStatusLabel(selectedBed.status)}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                
                <div className="space-y-5 mb-8">
                  <div>
                    <p className="font-body text-xs text-on-surface-variant font-medium mb-1">Đơn giá / ngày</p>
                    <p className="font-body text-lg font-bold text-on-surface">{selectedBed.price.toLocaleString()} VND</p>
                  </div>

                  {selectedBed.status === 'occupied' && selectedBed.patient && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <div className="mb-3">
                        <p className="font-body text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Thông tin Bệnh nhân</p>
                        <p className="font-display font-bold text-xl text-on-surface">{selectedBed.patient.name}</p>
                      </div>
                      <div>
                        <p className="font-body text-xs text-on-surface-variant font-medium mb-0.5">Ngày nhập viện</p>
                        <p className="font-body text-sm font-bold text-on-surface">{selectedBed.patient.admission}</p>
                      </div>
                    </div>
                  )}

                  {selectedBed.status === 'maintenance' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="font-body text-sm font-bold text-amber-800">Đang trong thời gian bảo trì</p>
                      <p className="font-body text-xs text-amber-700/80 mt-1">Dự kiến hoàn thành: Hôm nay</p>
                    </div>
                  )}
                </div>

                <div className="mt-auto space-y-3">
                  {selectedBed.status === 'occupied' ? (
                    <>
                      <button className="w-full py-3.5 rounded-xl bg-primary text-white font-body font-bold text-sm shadow-md hover:shadow-lg transition-all">
                        Xem hồ sơ BN
                      </button>
                      <button className="w-full py-3.5 rounded-xl border-2 border-primary text-primary font-body font-bold text-sm hover:bg-primary/5 transition-colors">
                        Điều chuyển
                      </button>
                    </>
                  ) : selectedBed.status === 'empty' ? (
                    <button className="w-full py-3.5 rounded-xl bg-primary text-white font-body font-bold text-sm shadow-md hover:shadow-lg transition-all">
                      Xếp bệnh nhân vào
                    </button>
                  ) : (
                    <button className="w-full py-3.5 rounded-xl border-2 border-outline-variant/50 text-on-surface-variant font-body font-bold text-sm hover:bg-surface-container-low transition-colors">
                      Kết thúc bảo trì
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
               <p className="font-body text-sm text-on-surface-variant">Vui lòng chọn một giường để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="fixed bottom-0 right-[380px] bg-surface-container-lowest/90 backdrop-blur-md border border-surface-container-low rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-6 py-4 flex gap-8 z-30">
         <div className="flex flex-col items-center">
            <span className="font-body text-2xl font-bold text-on-surface">08</span>
            <span className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Giường trống</span>
         </div>
         <div className="w-px bg-outline-variant/30"></div>
         <div className="flex flex-col items-center">
            <span className="font-body text-2xl font-bold text-emerald-600">04</span>
            <span className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Xuất viện h.nay</span>
         </div>
         <div className="w-px bg-outline-variant/30"></div>
         <div className="flex flex-col items-center">
            <span className="font-body text-2xl font-bold text-amber-600">02</span>
            <span className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">Bảo trì</span>
         </div>
      </div>

    </div>
  );
};

export default InpatientBedMapPage;
