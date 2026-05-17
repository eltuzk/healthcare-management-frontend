import React, { useState, useEffect } from 'react';
import { 
  getRooms, 
  getBedsByRoomId, 
  getAdmissionRequests,
  createBed,
  updateBed,
  deleteBed
} from '../services/admissionService';
import toast from 'react-hot-toast';

type BedStatus = 'occupied' | 'empty' | 'maintenance';

interface Bed {
  id: string;
  dbId: number;
  status: BedStatus;
  patient?: {
    name: string;
    admission: string;
  };
  price: number;
  roomId: number;
}

interface Room {
  id: string;
  dbId: number;
  name: string;
  type: 'VIP' | 'Tiêu chuẩn';
  roomTypeName: string;
  beds: Bed[];
  floor?: number;
  specialtyName?: string;
}

const InpatientBedMapPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [icuBeds, setIcuBeds] = useState<Bed[]>([]);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Custom price input modal state
  const [priceModal, setPriceModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    defaultValue: string;
    onSubmit: (price: number) => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    defaultValue: '',
    onSubmit: () => {}
  });
  
  // Dynamic filter states
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [floors, setFloors] = useState<number[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [selectedFloor, setSelectedFloor] = useState<string>('ALL');

  const userRole = localStorage.getItem('role') ?? '';
  const isAdmin = userRole === 'ADMIN' || userRole === 'RECEPTIONIST';

  // Handle Add Bed
  const handleAddBed = (roomId: number, roomName: string) => {
    setPriceModal({
      isOpen: true,
      title: 'Thêm giường mới',
      description: `Nhập đơn giá dịch vụ cho giường mới tại ${roomName} (VND):`,
      defaultValue: '150000',
      onSubmit: async (price: number) => {
        try {
          await createBed(roomId, { price });
          toast.success(`Đã thêm giường mới thành công tại ${roomName}!`);
          loadBedMapData();
        } catch (err: any) {
          toast.error(err.message || "Không thể thêm giường mới");
        }
      }
    });
  };

  // Handle Update Bed Price
  const handleUpdateBedPrice = (bed: Bed) => {
    setPriceModal({
      isOpen: true,
      title: 'Cập nhật đơn giá giường',
      description: `Cập nhật đơn giá dịch vụ cho giường ${bed.id} (VND):`,
      defaultValue: bed.price.toString(),
      onSubmit: async (price: number) => {
        try {
          await updateBed(bed.dbId, { price });
          toast.success(`Đã cập nhật đơn giá dịch vụ giường ${bed.id} thành công!`);
          setSelectedBed({ ...bed, price });
          loadBedMapData();
        } catch (err: any) {
          toast.error(err.message || "Không thể cập nhật đơn giá giường");
        }
      }
    });
  };

  // Handle Delete Bed
  const handleDeleteBed = async (bed: Bed) => {
    if (bed.status === 'occupied') {
      toast.error("Không thể xóa giường đang có bệnh nhân điều trị!");
      return;
    }
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa giường ${bed.id} khỏi hệ thống?`);
    if (!confirmDelete) return;

    try {
      await deleteBed(bed.dbId);
      toast.success(`Đã xóa giường ${bed.id} thành công!`);
      setSelectedBed(null);
      loadBedMapData();
    } catch (err: any) {
      toast.error(err.message || "Không thể xóa giường");
    }
  };

  // Handle Set Maintenance Mode
  const handleToggleMaintenance = async (bed: Bed, toMaintenance: boolean) => {
    try {
      const nextStatus = toMaintenance ? 'MAINTENANCE' : 'AVAILABLE';
      await updateBed(bed.dbId, { price: bed.price, status: nextStatus });
      toast.success(toMaintenance ? `Đã chuyển giường ${bed.id} sang chế độ bảo trì!` : `Giường ${bed.id} đã hoàn tất bảo trì, sẵn sàng phục vụ!`);
      setSelectedBed({ ...bed, status: toMaintenance ? 'maintenance' : 'empty' });
      loadBedMapData();
    } catch (err: any) {
      toast.error(err.message || "Không thể thay đổi trạng thái bảo trì");
    }
  };

  const getStatusColor = (status: BedStatus) => {
    switch (status) {
      case 'occupied': return 'bg-indigo-600 border-indigo-600 text-white shadow-md hover:bg-indigo-700';
      case 'maintenance': return 'bg-amber-500 border-amber-500 text-white shadow-md hover:bg-amber-600';
      case 'empty': return 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300';
    }
  };

  const getStatusLabel = (status: BedStatus) => {
    switch (status) {
      case 'occupied': return 'Đang dùng';
      case 'maintenance': return 'Bảo trì';
      case 'empty': return 'Trống';
    }
  };

  const loadBedMapData = async () => {
    try {
      setLoading(true);
      // 1. Fetch rooms
      const rawRooms = await getRooms();
      const roomsData = rawRooms.filter((r: any) => {
        const typeUpper = (r.roomTypeName || '').toUpperCase();
        return typeUpper.includes('NỘI TRÚ') || typeUpper.includes('NOI TRU') || typeUpper.includes('ICU') || typeUpper.includes('HỒI SỨC') || typeUpper.includes('HOI SUC');
      });
      
      // 2. Fetch admission requests to map patients
      const admissionsData = await getAdmissionRequests();
      const activeAdmissions = admissionsData.filter((a: any) => a.status === 'ADMITTED');

      // 3. Extract unique specialties and floors for dropdown filters
      const uniqueSpecs = Array.from(new Set(roomsData.map((r: any) => r.specialtyName).filter(Boolean))) as string[];
      const uniqueFloors = Array.from(new Set(roomsData.map((r: any) => r.floor).filter((f: any) => f !== null && f !== undefined))) as number[];
      setSpecialties(uniqueSpecs);
      setFloors(uniqueFloors.sort((a, b) => a - b));

      // 4. Fetch beds for each room in parallel
      const roomsWithBeds: Room[] = await Promise.all(
        roomsData.map(async (room: any) => {
          let bedsData: any[] = [];
          try {
            bedsData = await getBedsByRoomId(room.roomId);
          } catch (bedErr) {
            console.error(`Error fetching beds for room ${room.roomId}:`, bedErr);
          }

          const mappedBeds: Bed[] = bedsData.map((bed: any) => {
            const activeAdmission = activeAdmissions.find((a: any) => a.bedId === bed.bedId);
            
            let status: BedStatus = 'empty';
            if (bed.status === 'MAINTENANCE') {
              status = 'maintenance';
            } else if (bed.status === 'OCCUPIED' || activeAdmission) {
              status = 'occupied';
            }

            return {
              id: `${room.roomCode}.${bed.bedId}`,
              dbId: bed.bedId,
              status,
              patient: activeAdmission ? {
                name: activeAdmission.patientFullName,
                admission: activeAdmission.admissionDate 
                  ? new Date(activeAdmission.admissionDate).toLocaleDateString('vi-VN') 
                  : ''
              } : undefined,
              price: bed.price || 0,
              roomId: bed.roomId
            };
          });

          return {
            id: room.roomId.toString(),
            dbId: room.roomId,
            name: `Phòng ${room.roomCode}`,
            type: room.roomTypeName === 'VIP' ? 'VIP' : 'Tiêu chuẩn',
            roomTypeName: room.roomTypeName || '',
            beds: mappedBeds,
            floor: room.floor,
            specialtyName: room.specialtyName
          };
        })
      );

      // Separate Normal Rooms vs ICU rooms (ICU rooms are flattened into a single panel)
      const icuRoomsList = roomsWithBeds.filter(
        (r) => r.roomTypeName?.toUpperCase().includes('ICU') || r.name?.toUpperCase().includes('ICU')
      );

      const icuBedsList = icuRoomsList.flatMap((r) => r.beds);

      setRooms(roomsWithBeds); // Keep all in rooms state for filtering
      setIcuBeds(icuBedsList);

      // Set initial selected bed
      if (roomsWithBeds.length > 0 && roomsWithBeds[0].beds.length > 0) {
        setSelectedBed(roomsWithBeds[0].beds[0]);
      } else if (icuBedsList.length > 0) {
        setSelectedBed(icuBedsList[0]);
      }

    } catch (err: any) {
      console.error("Error loading bed map:", err);
      toast.error("Không thể tải thông tin sơ đồ giường");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBedMapData();
  }, []);

  // Filtered rooms based on selected floor and specialty
  const filteredRooms = rooms.filter((room) => {
    // Exclude ICU rooms from normal layout
    const isICU = room.roomTypeName?.toUpperCase().includes('ICU') || room.name?.toUpperCase().includes('ICU');
    if (isICU) return false;

    const matchSpecialty = selectedSpecialty === 'ALL' || room.specialtyName === selectedSpecialty;
    const matchFloor = selectedFloor === 'ALL' || room.floor?.toString() === selectedFloor;

    return matchSpecialty && matchFloor;
  });

  // Calculate real-time stats
  const allBeds = [...rooms.flatMap(r => r.beds), ...icuBeds];
  const totalBedsCount = allBeds.length;
  const occupiedBedsCount = allBeds.filter(b => b.status === 'occupied').length;
  const emptyBedsCount = allBeds.filter(b => b.status === 'empty').length;
  const maintenanceBedsCount = allBeds.filter(b => b.status === 'maintenance').length;

  return (
    <div className="flex flex-col animate-fade-in relative text-slate-800 pb-12">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="font-display text-[2.5rem] font-black text-slate-900 tracking-tight leading-none">Sơ đồ Giường Nội trú</h1>
          <p className="font-body text-slate-500 mt-2 font-bold">Quản lý sức chứa, phân bổ phòng & bệnh nhân thời gian thực</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Capacity Stats Card */}
          <div className="bg-white rounded-2xl border border-slate-150 px-5 py-3 flex items-center gap-4 shadow-sm">
             <div className="flex flex-col">
               <span className="font-body text-[10px] font-black text-slate-400 uppercase tracking-widest">Hiệu suất sử dụng</span>
               <span className="font-display text-2xl font-black text-indigo-600 leading-tight">
                 {occupiedBedsCount} <span className="text-sm text-slate-400 font-bold">/ {totalBedsCount} Giường</span>
               </span>
             </div>
          </div>

          {/* Specialty Filter */}
          <select 
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="bg-white border-2 border-slate-150 rounded-2xl px-4 py-3.5 font-body text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600 shadow-sm appearance-none cursor-pointer"
          >
            <option value="ALL">Tất cả Chuyên khoa</option>
            {specialties.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>

          {/* Floor Filter */}
          <select 
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            className="bg-white border-2 border-slate-150 rounded-2xl px-4 py-3.5 font-body text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-600 shadow-sm appearance-none cursor-pointer"
          >
            <option value="ALL">Tất cả các Tầng</option>
            {floors.map(floor => (
              <option key={floor} value={floor}>Tầng {floor}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đang tải sơ đồ giường...</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Main Map Area */}
          <div className="flex-1 flex flex-col gap-8 pr-2">
            
            {/* Legend */}
            <div className="flex items-center gap-6 bg-white py-3.5 px-6 rounded-2xl border border-slate-150 shadow-sm">
              <span className="font-body text-xs font-black text-slate-400 uppercase tracking-widest">Trạng thái:</span>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-indigo-600"></div>
                <span className="font-body text-xs font-bold text-slate-700">Đang dùng</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-slate-50 border border-slate-200"></div>
                <span className="font-body text-xs font-bold text-slate-700">Trống</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-amber-500"></div>
                <span className="font-body text-xs font-bold text-slate-700">Bảo trì</span>
              </div>
            </div>

            {/* Area A: Normal Rooms */}
            <section>
              <h2 className="font-display font-black text-lg text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                🏠 Phòng bệnh thường
              </h2>
              {filteredRooms.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-400">
                  Không tìm thấy phòng bệnh phù hợp bộ lọc.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in duration-300">
                  {filteredRooms.map(room => (
                    <div key={room.id} className="bg-white rounded-3xl border border-slate-150 shadow-sm p-5 flex flex-col hover:shadow-md transition-all">
                      <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-display font-black text-base text-slate-800">{room.name}</h3>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleAddBed(room.dbId, room.name); }}
                                className="p-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-md transition-all flex items-center justify-center border border-indigo-100 shadow-sm"
                                title="Thêm giường mới"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                              </button>
                            )}
                          </div>
                          {room.specialtyName && (
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{room.specialtyName}</span>
                          )}
                        </div>
                        <span className="bg-indigo-50 text-indigo-600 font-black text-[9px] px-2 py-1 rounded-lg uppercase tracking-widest border border-indigo-100">{room.type}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 flex-1">
                        {room.beds.length === 0 ? (
                          <div className="col-span-2 py-6 px-4 text-center text-slate-400 text-xs font-bold border-2 border-dashed border-slate-150 rounded-2xl flex flex-col items-center justify-center gap-2 bg-slate-50/50">
                            <span>Chưa có giường bệnh nào</span>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => handleAddBed(room.dbId, room.name)}
                                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl font-black text-[9px] uppercase tracking-wider transition-all shadow-sm active:scale-95"
                              >
                                + Khởi tạo nhanh
                              </button>
                            )}
                          </div>
                        ) : (
                          room.beds.map(bed => {
                            const isSelected = selectedBed?.dbId === bed.dbId;
                            return (
                              <button 
                                key={bed.id}
                                type="button"
                                onClick={() => setSelectedBed(bed)}
                                className={`relative rounded-2xl border-2 p-3.5 text-left transition-all active:scale-98 ${
                                  isSelected 
                                    ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-md scale-[1.02]' 
                                    : 'border-transparent shadow-sm'
                                } ${getStatusColor(bed.status)}`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-body font-black text-xs">G.{bed.id.split('.').pop()}</span>
                                  <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12h18M3 6h18M3 18h18" /></svg>
                                </div>
                                {bed.status === 'occupied' && bed.patient && (
                                  <div className="mt-1">
                                    <p className="font-body text-[10px] font-black opacity-90 truncate leading-none">{bed.patient.name}</p>
                                  </div>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ICU Area */}
            {icuBeds.length > 0 && (
              <section className="animate-in fade-in duration-300">
                <h2 className="font-display font-black text-lg text-red-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  🚨 Phòng hồi sức tập trung (ICU)
                </h2>
                <div className="bg-red-50/50 rounded-3xl border border-red-150 p-6 shadow-sm">
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                     {icuBeds.map(bed => {
                       const isSelected = selectedBed?.dbId === bed.dbId;
                       return (
                          <button 
                            key={bed.id}
                            type="button"
                            onClick={() => setSelectedBed(bed)}
                            className={`relative rounded-2xl border-2 p-3.5 text-left transition-all active:scale-98 ${
                              isSelected 
                                ? 'border-red-600 ring-4 ring-red-50 shadow-md scale-[1.02]' 
                                : 'border-transparent shadow-sm'
                            } ${getStatusColor(bed.status)}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-body font-black text-xs">{bed.id}</span>
                              <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            {bed.status === 'occupied' && bed.patient && (
                              <div className="mt-1">
                                <p className="font-body text-[10px] font-black opacity-90 truncate leading-none">{bed.patient.name}</p>
                              </div>
                            )}
                          </button>
                       );
                     })}
                   </div>
                </div>
              </section>
            )}

          </div>

          {/* Side Panel: Bed Details */}
          <div className="w-full lg:w-[340px] sticky top-4 h-auto lg:h-[calc(100vh-140px)] flex-shrink-0 flex flex-col bg-white rounded-3xl shadow-sm border border-slate-150 overflow-hidden">
            {selectedBed ? (
              <>
                <div className="p-6 border-b border-slate-100 bg-white relative">
                  <span className="font-body text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Chi tiết Giường bệnh</span>
                  <div className="flex justify-between items-center">
                    <h3 className="font-display font-black text-2xl text-slate-900">Giường {selectedBed.id}</h3>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      selectedBed.status === 'occupied' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 
                      selectedBed.status === 'maintenance' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                      'bg-slate-50 text-slate-500 border border-slate-200'
                    }`}>
                      {getStatusLabel(selectedBed.status)}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  
                  <div className="space-y-5 mb-8">
                    <div>
                      <p className="font-body text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đơn giá dịch vụ / Ngày</p>
                      <div className="flex items-center justify-between">
                        <p className="font-display text-xl font-black text-indigo-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedBed.price)}
                        </p>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleUpdateBedPrice(selectedBed)}
                            className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-lg transition-all border border-transparent hover:border-slate-200"
                            title="Sửa đơn giá"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {selectedBed.status === 'occupied' && selectedBed.patient && (
                      <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4">
                        <div className="mb-3">
                          <p className="font-body text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Bệnh nhân đang nằm</p>
                          <p className="font-display font-black text-lg text-slate-900">{selectedBed.patient.name}</p>
                        </div>
                        <div>
                          <p className="font-body text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Ngày nhập viện</p>
                          <p className="font-body text-xs font-bold text-slate-700">{selectedBed.patient.admission}</p>
                        </div>
                      </div>
                    )}

                    {selectedBed.status === 'maintenance' && (
                      <div className="bg-amber-50 border border-amber-150 rounded-2xl p-4">
                        <p className="font-body text-xs font-black text-amber-800 uppercase tracking-widest">Đang bảo trì thiết bị</p>
                        <p className="font-body text-xs text-amber-700/80 mt-1 font-semibold">Tạm ngưng tiếp nhận ca nội trú mới để bảo dưỡng giường máy.</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    {selectedBed.status === 'occupied' ? (
                      <>
                        <button 
                          onClick={() => toast.success("Đang mở hồ sơ bệnh án...")}
                          className="w-full py-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                          Xem hồ sơ bệnh án
                        </button>
                        <button 
                          onClick={() => toast.success("Chức năng điều chuyển giường đang được chuẩn bị...")}
                          className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                        >
                          Điều chuyển giường
                        </button>
                      </>
                    ) : selectedBed.status === 'empty' ? (
                      <>
                        {userRole === 'RECEPTIONIST' && (
                          <button 
                            onClick={() => toast.success("Đang chuyển hướng sang luồng tiếp nhận nội trú...")}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm"
                          >
                            Tiếp nhận ca nội trú
                          </button>
                        )}
                        <button 
                          onClick={() => handleToggleMaintenance(selectedBed, true)}
                          className="w-full py-3 border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                        >
                          Bảo trì giường
                        </button>
                        {isAdmin && (
                          <button 
                            onClick={() => handleDeleteBed(selectedBed)}
                            className="w-full py-3 border border-red-200 bg-red-50 hover:bg-red-100 text-red-750 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                          >
                            Xóa giường
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleToggleMaintenance(selectedBed, false)}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm"
                        >
                          Kết thúc bảo trì
                        </button>
                        {isAdmin && (
                          <button 
                            onClick={() => handleDeleteBed(selectedBed)}
                            className="w-full py-3 border border-red-200 bg-red-50 hover:bg-red-100 text-red-750 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                          >
                            Xóa giường
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6 text-center text-slate-400">
                 <p className="text-xs font-bold uppercase tracking-wider">Vui lòng chọn một giường để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats Sticky Panel */}
      {!loading && (
        <div className="fixed bottom-6 right-24 bg-white/95 backdrop-blur-md border border-slate-150 rounded-2xl shadow-xl px-6 py-3 flex gap-8 z-30">
           <div className="flex flex-col items-center">
              <span className="font-display text-xl font-black text-slate-800">{emptyBedsCount}</span>
              <span className="font-body text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Giường trống</span>
           </div>
           <div className="w-px bg-slate-100"></div>
           <div className="flex flex-col items-center">
              <span className="font-display text-xl font-black text-indigo-600">{occupiedBedsCount}</span>
              <span className="font-body text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Đang dùng</span>
           </div>
           <div className="w-px bg-slate-100"></div>
           <div className="flex flex-col items-center">
              <span className="font-display text-xl font-black text-amber-500">{maintenanceBedsCount}</span>
              <span className="font-body text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Bảo trì</span>
           </div>
        </div>
      )}

      {/* Custom price modal */}
      {priceModal.isOpen && (
        <PriceInputModal
          title={priceModal.title}
          description={priceModal.description}
          defaultValue={priceModal.defaultValue}
          onClose={() => setPriceModal(prev => ({ ...prev, isOpen: false }))}
          onSubmit={priceModal.onSubmit}
        />
      )}

    </div>
  );
};

interface PriceInputModalProps {
  title: string;
  description: string;
  defaultValue: string;
  onClose: () => void;
  onSubmit: (price: number) => void;
}

const PriceInputModal: React.FC<PriceInputModalProps> = ({
  title,
  description,
  defaultValue,
  onClose,
  onSubmit
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(inputValue);
    if (isNaN(price) || price < 0 || inputValue.trim() === '') {
      setError('Đơn giá giường không hợp lệ!');
      return;
    }
    onSubmit(price);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#001D3D]/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-slate-100 transform scale-100 transition-all">
        <h3 className="font-display font-black text-xl text-slate-900 mb-2">{title}</h3>
        <p className="font-body text-xs text-slate-500 font-bold mb-6">{description}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-body text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Đơn giá (VND)</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError('');
              }}
              placeholder="Ví dụ: 150000"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 rounded-2xl font-bold text-slate-700 outline-none transition-all"
              autoFocus
            />
            {error && <p className="font-body text-xs text-red-500 font-bold mt-2">{error}</p>}
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-body font-bold text-xs uppercase tracking-wider transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-body font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-indigo-100 active:scale-98"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InpatientBedMapPage;
