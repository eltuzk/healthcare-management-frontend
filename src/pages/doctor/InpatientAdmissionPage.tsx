import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMedicalRecords } from '../../services/medicalRecordService';
import { getRooms, getBedsByRoomId, createAdmissionRequest } from '../../services/admissionService';
import { toast } from 'react-hot-toast';

const formatLocalISO = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const InpatientAdmissionPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [records, setRecords] = useState<any[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [rooms, setRooms] = useState<any[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [beds, setBeds] = useState<any[]>([]);
    const [selectedBedId, setSelectedBedId] = useState<number | null>(null);

    // Admission form state
    const [admissionDate, setAdmissionDate] = useState(() => formatLocalISO(new Date()));
    const [dischargeDate, setDischargeDate] = useState('');
    
    // UI states
    const [loadingRecords, setLoadingRecords] = useState(true);
    const [loadingBeds, setLoadingBeds] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSelectRecord = (record: any) => {
        setSelectedRecord(record);
        setSelectedRoomId('');
        setBeds([]);
        setSelectedBedId(null);
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. Get medical records
                const recRes = await getMedicalRecords();
                const allRecords = Array.isArray(recRes) ? recRes : recRes.content || [];
                const completedRecords = allRecords.filter((rec: any) => rec.status === 'COMPLETED' || rec.status === 'LOCKED');
                setRecords(completedRecords);

                // 2. Get rooms
                const roomRes = await getRooms();
                // Filter to show inpatient rooms (or all rooms)
                setRooms(Array.isArray(roomRes) ? roomRes : roomRes.content || []);

                // Check for pre-selected record from URL parameter
                const medicalRecordIdParam = searchParams.get('medicalRecordId');
                if (medicalRecordIdParam) {
                    const matchedRecord = completedRecords.find((rec: any) => rec.medicalRecordId === Number(medicalRecordIdParam));
                    if (matchedRecord) {
                        handleSelectRecord(matchedRecord);
                    }
                }
            } catch (error) {
                console.error("Error loading admission data:", error);
                toast.error("Không thể tải thông tin phòng bệnh");
            } finally {
                setLoadingRecords(false);
            }
        };
        fetchInitialData();
    }, [searchParams]);

    // Fetch beds when selecting a room
    useEffect(() => {
        if (!selectedRoomId) {
            setBeds([]);
            setSelectedBedId(null);
            return;
        }

        const fetchBeds = async () => {
            setLoadingBeds(true);
            try {
                const bedRes = await getBedsByRoomId(Number(selectedRoomId));
                setBeds(Array.isArray(bedRes) ? bedRes : []);
                setSelectedBedId(null);
            } catch (error) {
                console.error("Error fetching room beds:", error);
                toast.error("Không thể tải danh sách giường");
            } finally {
                setLoadingBeds(false);
            }
        };
        fetchBeds();
    }, [selectedRoomId]);

    const handleSelectBed = (bedId: number, status: string) => {
        if (status === 'occupied') {
            toast.error("Giường này hiện đã có bệnh nhân nằm điều trị");
            return;
        }
        setSelectedBedId(bedId);
    };

    const handleSubmitAdmission = async () => {
        if (!selectedRecord) {
            toast.error("Vui lòng chọn bệnh nhân cần nhập viện");
            return;
        }
        if (!selectedBedId) {
            toast.error("Vui lòng chọn một giường bệnh còn trống");
            return;
        }
        if (!admissionDate) {
            toast.error("Vui lòng chọn ngày nhập viện");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                patientId: selectedRecord.patientId,
                medRecordId: selectedRecord.medicalRecordId,
                bedId: selectedBedId,
                admissionDate,
                dischargeDate: dischargeDate || null
            };

            await createAdmissionRequest(payload);
            toast.success("Yêu cầu nhập viện nội trú đã được tạo thành công!");
            
            // Reset page state
            setSelectedRecord(null);
            setSelectedRoomId('');
            setBeds([]);
            setSelectedBedId(null);
        } catch (error) {
            console.error("Error creating admission request:", error);
            toast.error("Lỗi khi tạo yêu cầu nhập viện nội trú. Vui lòng kiểm tra lại!");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            {/* Header info */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Chỉ Định Nhập Viện Nội Trú</h1>
                <p className="text-slate-500 font-medium font-display">Tạo hồ sơ bệnh án điều trị nội trú, tra cứu buồng bệnh và phân phối giường trống</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: Patient list */}
                <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm h-fit">
                    <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Bệnh nhân chờ nhập viện ({records.length})
                    </h3>

                    {loadingRecords ? (
                        <div className="py-10 text-center text-slate-400 font-medium animate-pulse">Đang tải bệnh án...</div>
                    ) : (
                        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                            {records.map((rec) => {
                                const isSelected = selectedRecord?.medicalRecordId === rec.medicalRecordId;
                                return (
                                    <button
                                        key={rec.medicalRecordId}
                                        onClick={() => handleSelectRecord(rec)}
                                        className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-1.5 ${
                                            isSelected
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                                            : 'bg-slate-50/50 border-slate-200/60 hover:bg-slate-100/50 text-slate-700'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <span className="font-bold text-sm tracking-tight">{rec.patientName}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                isSelected 
                                                ? 'bg-white/20 text-white' 
                                                : rec.status === 'COMPLETED' 
                                                ? 'bg-emerald-100 text-emerald-800' 
                                                : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {rec.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang khám'}
                                            </span>
                                        </div>
                                        <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-400'} font-medium`}>
                                            Mã BA: #{rec.medicalRecordId} • Chẩn đoán: {rec.initialDiagnosis || 'Chưa cập nhật'}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right side: Admission detail form */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
                    {selectedRecord ? (
                        <div className="space-y-6">
                            {/* Selected context */}
                            <div className="border-b border-slate-100 pb-5">
                                <h3 className="text-lg font-black text-slate-800">
                                    Hồ sơ nhập viện: <span className="text-indigo-600">{selectedRecord.patientName}</span>
                                </h3>
                                <p className="text-slate-400 text-xs font-semibold mt-1">MÃ BỆNH ÁN: #{selectedRecord.medicalRecordId} | CHẨN ĐOÁN: {selectedRecord.initialDiagnosis}</p>
                            </div>

                            {/* Dates settings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Ngày nhập viện *</label>
                                    <input 
                                        type="date"
                                        value={admissionDate}
                                        onChange={(e) => setAdmissionDate(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-sm text-slate-800 focus:border-indigo-600 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Ngày ra viện (Dự kiến)</label>
                                    <input 
                                        type="date"
                                        value={dischargeDate}
                                        onChange={(e) => setDischargeDate(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-sm text-slate-800 focus:border-indigo-600 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Room selection */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Chọn buồng / phòng điều trị nội trú</label>
                                <select
                                    value={selectedRoomId}
                                    onChange={(e) => setSelectedRoomId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white font-bold text-sm text-slate-800 focus:border-indigo-600 outline-none"
                                >
                                    <option value="">-- Chọn buồng bệnh nội trú --</option>
                                    {rooms.map(room => (
                                        <option key={room.roomId} value={room.roomId}>
                                            Phòng {room.roomCode} ({room.specialty?.specialtyName || 'Khoa Nội'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Visual Bed Selection Grid */}
                            {selectedRoomId && (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Sơ đồ giường trống của phòng
                                    </h4>

                                    {loadingBeds ? (
                                        <div className="py-10 text-center text-slate-400 font-medium animate-pulse">Đang tải danh sách giường...</div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {beds.map((bed) => {
                                                const isSelected = selectedBedId === bed.bedId;
                                                const isOccupied = bed.status === 'occupied';
                                                
                                                return (
                                                    <button
                                                        key={bed.bedId}
                                                        type="button"
                                                        onClick={() => handleSelectBed(bed.bedId, bed.status)}
                                                        className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2.5 transition-all active:scale-95 ${
                                                            isOccupied
                                                            ? 'bg-rose-50 border-rose-100 text-rose-500 cursor-not-allowed opacity-60'
                                                            : isSelected
                                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                                                            : 'bg-slate-50 border-slate-200/50 hover:bg-slate-100/50 text-slate-700'
                                                        }`}
                                                    >
                                                        {/* Bed icon representation */}
                                                        <svg className={`w-8 h-8 ${isOccupied ? 'text-rose-400' : isSelected ? 'text-white' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                                        </svg>
                                                        <div className="text-center">
                                                            <span className="block font-black text-xs">Giường #{bed.bedId}</span>
                                                            <span className="block text-[9px] font-bold uppercase tracking-wider opacity-85 mt-0.5">
                                                                {isOccupied ? 'Đang nằm' : isSelected ? 'Đã chọn' : 'Trống'}
                                                            </span>
                                                        </div>
                                                    </button>
                                                );
                                            })}

                                            {beds.length === 0 && (
                                                <p className="col-span-full text-center text-slate-400 py-6 italic text-sm">Không có giường nào được tìm thấy trong phòng này.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Submit area */}
                            <div className="flex justify-end pt-6 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleSubmitAdmission}
                                    disabled={submitting || !selectedBedId}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-95 transition-all text-sm shadow-lg shadow-indigo-600/10 flex items-center gap-2"
                                >
                                    {submitting ? 'Đang gửi...' : 'Chỉ định nhập viện'}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <p className="text-base font-bold text-slate-700">Chưa chọn bệnh nhân</p>
                            <p className="text-slate-500 text-sm max-w-xs text-center mt-1">Vui lòng chọn một bệnh nhân từ danh sách bên trái để mở rộng tính năng chỉ định nhập viện.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InpatientAdmissionPage;
