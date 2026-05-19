import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getMedicalRecords } from '../../services/medicalRecordService';
import { getMedicines, getMedicineLots, createPrescription, getPrescriptionByMedicalRecordId } from '../../services/prescriptionService';
import { toast } from 'react-hot-toast';

const PrescriptionPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [records, setRecords] = useState<any[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [medicines, setMedicines] = useState<any[]>([]);
    
    // Prescription builder state
    const [prescriptionDetails, setPrescriptionDetails] = useState<any[]>([]);
    const [note, setNote] = useState('');
    const [existingPrescription, setExistingPrescription] = useState<any>(null);

    // Form inputs for adding a medicine
    const [selectedMedicineId, setSelectedMedicineId] = useState('');
    const [dosage, setDosage] = useState('1 viên');
    const [frequency, setFrequency] = useState('Ngày 2 lần');
    const [duration, setDuration] = useState('7 ngày');
    const [quantity, setQuantity] = useState<number>(10);
    const [instruction, setInstruction] = useState('Uống sau khi ăn no');
    
    // Inventory states
    const [selectedMedStock, setSelectedMedStock] = useState<number>(0);
    const [loadingStock, setLoadingStock] = useState(false);
    const [loadingRecords, setLoadingRecords] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const handleSelectRecord = async (record: any) => {
        setSelectedRecord(record);
        setPrescriptionDetails([]);
        setNote('');
        setExistingPrescription(null);

        try {
            // Check if patient already has a prescription
            const presc = await getPrescriptionByMedicalRecordId(record.medicalRecordId);
            if (presc) {
                setExistingPrescription(presc);
            }
        } catch (error) {
            // No existing prescription is fine
            console.log("No existing prescription for this record.");
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. Get medical records
                const recRes = await getMedicalRecords();
                const allRecords = Array.isArray(recRes) ? recRes : recRes.content || [];
                const completedRecords = allRecords.filter((rec: any) => rec.status === 'COMPLETED' || rec.status === 'LOCKED');
                setRecords(completedRecords);

                // 2. Get available medicines
                const medRes = await getMedicines();
                setMedicines(Array.isArray(medRes) ? medRes : []);

                // Check for pre-selected record from URL parameter
                const medicalRecordIdParam = searchParams.get('medicalRecordId');
                if (medicalRecordIdParam) {
                    const matchedRecord = completedRecords.find((rec: any) => rec.medicalRecordId === Number(medicalRecordIdParam));
                    if (matchedRecord) {
                        handleSelectRecord(matchedRecord);
                    }
                }
            } catch (error) {
                console.error("Error loading prescription data:", error);
                toast.error("Không thể tải thông tin kho thuốc hoặc bệnh án");
            } finally {
                setLoadingRecords(false);
            }
        };
        fetchInitialData();
    }, [searchParams]);

    // Fetch stock details when selecting a medicine to add
    useEffect(() => {
        if (!selectedMedicineId) {
            setSelectedMedStock(0);
            return;
        }

        const fetchStock = async () => {
            setLoadingStock(true);
            try {
                const lots = await getMedicineLots(Number(selectedMedicineId));
                const totalStock = (lots || []).reduce((acc: number, lot: any) => acc + (lot.active ? lot.quantity : 0), 0);
                setSelectedMedStock(totalStock);
            } catch (error) {
                console.error("Error fetching medicine stock:", error);
                setSelectedMedStock(0);
            } finally {
                setLoadingStock(false);
            }
        };
        fetchStock();
    }, [selectedMedicineId]);

    const handleAddMedicine = () => {
        if (!selectedMedicineId) {
            toast.error("Vui lòng chọn thuốc");
            return;
        }

        const med = medicines.find(m => m.medicineId === Number(selectedMedicineId));
        if (!med) return;

        if (quantity > selectedMedStock) {
            toast.error(`Số lượng kê đơn (${quantity}) vượt quá tồn kho khả dụng (${selectedMedStock})`);
            return;
        }

        // Check if already added
        if (prescriptionDetails.some(d => d.medicineId === med.medicineId)) {
            toast.error("Thuốc này đã được thêm vào đơn");
            return;
        }

        const newItem = {
            medicineId: med.medicineId,
            medicineName: med.medicineName,
            dosage,
            frequency,
            duration,
            quantity,
            instruction,
            stock: selectedMedStock
        };

        setPrescriptionDetails([...prescriptionDetails, newItem]);
        // Reset form
        setSelectedMedicineId('');
        setDosage('1 viên');
        setFrequency('Ngày 2 lần');
        setDuration('7 ngày');
        setQuantity(10);
        setInstruction('Uống sau khi ăn no');
        toast.success(`Đã thêm thuốc ${med.medicineName}`);
    };

    const handleRemoveMedicine = (medicineId: number) => {
        setPrescriptionDetails(prescriptionDetails.filter(item => item.medicineId !== medicineId));
    };

    const handleSubmitPrescription = async () => {
        if (!selectedRecord) {
            toast.error("Vui lòng chọn bệnh nhân");
            return;
        }
        if (prescriptionDetails.length === 0) {
            toast.error("Đơn thuốc trống, vui lòng thêm ít nhất một loại thuốc");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                medicalRecordId: selectedRecord.medicalRecordId,
                note,
                details: prescriptionDetails.map(item => ({
                    medicineId: item.medicineId,
                    dosage: item.dosage,
                    frequency: item.frequency,
                    duration: item.duration,
                    quantity: item.quantity,
                    instruction: item.instruction
                }))
            };

            const created = await createPrescription(payload);
            setExistingPrescription(created);
            setPrescriptionDetails([]);
            setNote('');
            toast.success("Đơn thuốc đã được kê và gửi đến Kho dược thành công!");
        } catch (error: any) {
            console.error("Error creating prescription:", error);
            toast.error("Lỗi khi lưu đơn thuốc. Vui lòng thử lại!");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Kê Đơn Thuốc Bệnh Nhân</h1>
                <p className="text-slate-500 font-medium">Tìm kiếm dược phẩm, kiểm tra lô tồn kho thực tế và lập đơn thuốc trực tuyến</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: Patient Selection */}
                <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm h-fit">
                    <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Chọn bệnh án để kê đơn ({records.length})
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
                                                : rec.status === 'LOCKED'
                                                ? 'bg-rose-100 text-rose-800 border border-rose-200/50'
                                                : rec.status === 'COMPLETED' 
                                                ? 'bg-emerald-100 text-emerald-800' 
                                                : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {rec.status === 'LOCKED' ? 'Đã khóa' : rec.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang khám'}
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

                {/* Right side: Prescription Builder */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
                    {selectedRecord ? (
                        <div className="space-y-6">
                            {/* Patient Context info */}
                            <div className="border-b border-slate-100 pb-5">
                                <h3 className="text-lg font-black text-slate-800">
                                    Đơn thuốc cho: <span className="text-indigo-600">{selectedRecord.patientName}</span>
                                </h3>
                                <p className="text-slate-400 text-xs font-semibold mt-1">MÃ BỆNH ÁN: #{selectedRecord.medicalRecordId} | CHẨN ĐOÁN: {selectedRecord.initialDiagnosis}</p>
                            </div>

                            {existingPrescription ? (
                                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-emerald-800 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="font-bold text-sm">Bệnh nhân đã được kê đơn cho đợt điều trị này</span>
                                    </div>
                                    <div className="border-t border-emerald-200/50 pt-3 space-y-2">
                                        <p className="text-xs font-bold text-emerald-600/80 uppercase">CHI TIẾT ĐƠN THUỐC ĐÃ KÊ:</p>
                                        {existingPrescription.details?.map((item: any) => (
                                            <div key={item.prescriptionDetailId} className="flex justify-between text-xs font-bold text-slate-700">
                                                <span>• {item.medicineName} ({item.dosage} • {item.frequency})</span>
                                                <span>SL: {item.quantity} {item.unit}</span>
                                            </div>
                                        ))}
                                        {existingPrescription.note && (
                                            <p className="text-xs italic text-slate-500 mt-2 font-medium">Ghi chú bác sĩ: "{existingPrescription.note}"</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Medicine Selection Form */}
                                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/50 space-y-4">
                                        <h4 className="text-sm font-black text-slate-700">Thêm thuốc vào đơn</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Chọn biệt dược</label>
                                                <select
                                                    value={selectedMedicineId}
                                                    onChange={(e) => setSelectedMedicineId(e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-sm text-slate-800"
                                                >
                                                    <option value="">-- Chọn thuốc trong kho --</option>
                                                    {medicines.map(med => (
                                                        <option key={med.medicineId} value={med.medicineId}>
                                                            {med.medicineName} ({med.activeIngredient})
                                                        </option>
                                                    ))}
                                                </select>
                                                {selectedMedicineId && (
                                                    <span className="block text-xs font-bold text-indigo-600 mt-1">
                                                        {loadingStock ? 'Đang kiểm kho...' : `Số lượng tồn thực tế: ${selectedMedStock} trong kho dược`}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Số lượng phát</label>
                                                <input 
                                                    type="number"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                                    min="1"
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-sm text-slate-800"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Liều dùng</label>
                                                <input 
                                                    type="text"
                                                    value={dosage}
                                                    onChange={(e) => setDosage(e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-800"
                                                    placeholder="Ví dụ: 1 viên, 5ml"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Tần suất</label>
                                                <input 
                                                    type="text"
                                                    value={frequency}
                                                    onChange={(e) => setFrequency(e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-800"
                                                    placeholder="Ví dụ: Sáng 1, Tối 1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Thời gian uống</label>
                                                <input 
                                                    type="text"
                                                    value={duration}
                                                    onChange={(e) => setDuration(e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-800"
                                                    placeholder="Ví dụ: 7 ngày"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Ghi chú cách dùng</label>
                                            <input 
                                                type="text"
                                                value={instruction}
                                                onChange={(e) => setInstruction(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-800"
                                                placeholder="Ví dụ: Uống sau ăn no, tránh sữa"
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={handleAddMedicine}
                                                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/10"
                                            >
                                                Thêm vào toa
                                            </button>
                                        </div>
                                    </div>

                                    {/* Prescription details list */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-black text-slate-800">Danh sách thuốc kê đơn</h4>
                                        <div className="space-y-2">
                                            {prescriptionDetails.map((item) => (
                                                <div 
                                                    key={item.medicineId} 
                                                    className="p-4 bg-white border border-slate-200 rounded-2xl flex justify-between items-center gap-4 hover:shadow-sm transition-shadow"
                                                >
                                                    <div className="space-y-1">
                                                        <span className="font-bold text-slate-800 text-sm">{item.medicineName}</span>
                                                        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                                                            <span>Liều: {item.dosage}</span>
                                                            <span>•</span>
                                                            <span>Tần suất: {item.frequency}</span>
                                                            <span>•</span>
                                                            <span>Trong: {item.duration}</span>
                                                            <span>•</span>
                                                            <span className="text-indigo-600 font-bold">SL: {item.quantity}</span>
                                                        </div>
                                                        <p className="text-[10px] italic text-slate-400 font-medium">HD: "{item.instruction}"</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveMedicine(item.medicineId)}
                                                        className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors active:scale-95 shrink-0"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}

                                            {prescriptionDetails.length === 0 && (
                                                <p className="text-center py-10 text-slate-400 italic text-sm">Toa thuốc rỗng. Vui lòng thêm thuốc ở khung phía trên.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Prescription general note */}
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lời dặn bác sĩ</label>
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-600 outline-none font-semibold text-slate-800 transition-all text-xs min-h-[80px]"
                                            placeholder="Ghi chú chung cho đơn thuốc này..."
                                        />
                                    </div>

                                    {/* Submit */}
                                    <div className="flex justify-end pt-4 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={handleSubmitPrescription}
                                            disabled={submitting || prescriptionDetails.length === 0}
                                            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-95 transition-all text-sm shadow-lg shadow-indigo-600/15 flex items-center gap-2"
                                        >
                                            {submitting ? 'Đang lưu...' : 'Gửi đơn thuốc'}
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2" />
                            </svg>
                            <p className="text-base font-bold text-slate-700">Chưa chọn bệnh án</p>
                            <p className="text-slate-500 text-sm max-w-xs text-center mt-1">Vui lòng chọn một bệnh nhân từ danh sách bên trái để mở rộng tính năng kê đơn thuốc.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrescriptionPage;
