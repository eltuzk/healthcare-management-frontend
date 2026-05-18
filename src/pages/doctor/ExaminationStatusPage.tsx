import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMedicalRecords, updateMedicalRecord, lockMedicalRecord } from '../../services/medicalRecordService';
import { getMedicalServiceRequests, getMedicalServiceResultByRequestId } from '../../services/medicalServiceService';
import { getLabTestRequestsByMedicalRecordId, getLabTestResultByRequestId } from '../../services/labService';
import { toast } from 'react-hot-toast';

const ExaminationStatusPage: React.FC = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState<any[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [labRequests, setLabRequests] = useState<any[]>([]);
    const [loadingRecords, setLoadingRecords] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(false);
    
    // EMR form states
    const [diagnosis, setDiagnosis] = useState('');
    const [clinicalNotes, setClinicalNotes] = useState('');
    const [treatmentPlan, setTreatmentPlan] = useState('');
    const [conclusionType, setConclusionType] = useState('COMPLETED');
    const [submitting, setSubmitting] = useState(false);

    // Result modal state
    const [activeResult, setActiveResult] = useState<any>(null);
    const [resultType, setResultType] = useState<'service' | 'lab'>('service');
    const [showResultModal, setShowResultModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRecords = records.filter(rec => 
        rec.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(rec.medicalRecordId).includes(searchTerm)
    );

    const fetchRecords = async () => {
        try {
            const res = await getMedicalRecords();
            setRecords(Array.isArray(res) ? res : res.content || []);
        } catch (error) {
            console.error("Error fetching medical records:", error);
            toast.error("Không thể tải danh sách bệnh án");
        } finally {
            setLoadingRecords(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleSelectRecord = async (record: any) => {
        setSelectedRecord(record);
        setDiagnosis(record.initialDiagnosis || '');
        setClinicalNotes(record.clinicalNotes || '');
        setTreatmentPlan(record.treatmentPlan || '');
        setConclusionType(record.conclusionType || 'COMPLETED');
        setLoadingRequests(true);
        try {
            // Fetch both technical services and laboratory tests
            const serviceRes = await getMedicalServiceRequests({ medRecordId: record.medicalRecordId });
            setRequests(Array.isArray(serviceRes) ? serviceRes : serviceRes.content || []);

            const labRes = await getLabTestRequestsByMedicalRecordId(record.medicalRecordId);
            setLabRequests(labRes || []);
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error("Lỗi khi tải thông tin chỉ định cận lâm sàng");
        } finally {
            setLoadingRequests(false);
        }
    };

    const handleSaveRecord = async () => {
        if (!selectedRecord) return;
        if (!diagnosis.trim()) {
            toast.error("Vui lòng nhập chẩn đoán sơ bộ / kết luận");
            return;
        }

        setSubmitting(true);
        try {
            const updated = await updateMedicalRecord(selectedRecord.medicalRecordId, {
                version: selectedRecord.version,
                initialDiagnosis: diagnosis,
                clinicalConclusion: diagnosis,
                conclusionType,
                clinicalNotes,
                treatmentPlan
            });
            
            // Re-map fields
            setSelectedRecord(updated);
            setDiagnosis(updated.initialDiagnosis || '');
            setClinicalNotes(updated.clinicalNotes || '');
            setTreatmentPlan(updated.treatmentPlan || '');
            setConclusionType(updated.conclusionType || 'COMPLETED');

            toast.success("Lưu thông tin bệnh án thành công!");
            await fetchRecords();

            // Redirect based on conclusionType
            if (conclusionType === 'COMPLETED') {
                navigate(`/doctor/prescription?medicalRecordId=${selectedRecord.medicalRecordId}`);
            } else if (conclusionType === 'ADMISSION_REQUIRED') {
                navigate(`/doctor/admission?medicalRecordId=${selectedRecord.medicalRecordId}`);
            }
        } catch (error) {
            console.error("Error saving medical record:", error);
            toast.error("Lỗi khi lưu bệnh án");
        } finally {
            setSubmitting(false);
        }
    };

    const handleLockRecord = async () => {
        if (!selectedRecord) return;
        
        const confirmLock = window.confirm("Bạn có chắc chắn muốn KHÓA bệnh án này không? Sau khi khóa, bệnh án sẽ hoàn toàn không thể sửa đổi.");
        if (!confirmLock) return;

        setSubmitting(true);
        try {
            const locked = await lockMedicalRecord(selectedRecord.medicalRecordId);
            setSelectedRecord(locked);
            setDiagnosis(locked.initialDiagnosis || '');
            setClinicalNotes(locked.clinicalNotes || '');
            setTreatmentPlan(locked.treatmentPlan || '');
            setConclusionType(locked.conclusionType || 'COMPLETED');
            toast.success("Bệnh án đã được KHÓA thành công!");
            await fetchRecords();
        } catch (error) {
            console.error("Error locking medical record:", error);
            toast.error("Lỗi khi khóa bệnh án");
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewServiceResult = async (requestId: number, requestCode: string) => {
        try {
            const res = await getMedicalServiceResultByRequestId(requestId);
            setActiveResult({
                ...res,
                requestCode
            });
            setResultType('service');
            setShowResultModal(true);
        } catch (error) {
            console.error("Error fetching service result:", error);
            toast.error("Kết quả chưa được cập nhật từ phòng kỹ thuật hoặc lỗi kết nối");
        }
    };

    const handleViewLabResult = async (requestId: number, requestCode: string) => {
        try {
            const res = await getLabTestResultByRequestId(requestId);
            setActiveResult({
                ...res,
                requestCode
            });
            setResultType('lab');
            setShowResultModal(true);
        } catch (error) {
            console.error("Error fetching lab result:", error);
            toast.error("Kết quả xét nghiệm chưa được cập nhật hoặc lỗi kết nối");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            {/* Page Title */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Cập Nhật Bệnh Án</h1>
                <p className="text-slate-500 font-medium">Theo dõi tiến độ cận lâm sàng, đọc kết quả kỹ thuật và cập nhật/hoàn tất bệnh án điện tử (EMR)</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Patient List */}
                <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm h-fit">
                    <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Danh sách bệnh án ({filteredRecords.length}/{records.length})
                    </h3>

                    {/* Modern Search Input */}
                    <div className="mb-4 relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Tìm tên bệnh nhân hoặc mã BA..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-semibold text-slate-800 transition-all bg-slate-50/50"
                        />
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {loadingRecords ? (
                        <div className="py-10 text-center text-slate-400 font-medium animate-pulse">Đang tải bệnh án...</div>
                    ) : (
                        <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                            {filteredRecords.map((rec) => {
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
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
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

                            {filteredRecords.length === 0 && (
                                <p className="text-center text-slate-400 italic py-10 text-sm">Không tìm thấy bệnh án phù hợp</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: Ordered Services & EMR Update Form */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedRecord ? (
                        <>
                            {/* Patient EMR Header */}
                            {(() => {
                                const completedServices = requests.filter(r => r.status === 'RESULT_AVAILABLE').length;
                                const completedLabs = labRequests.filter(r => r.status === 'RESULT_AVAILABLE').length;
                                const totalRequests = requests.length + labRequests.length;
                                const completedRequestsCount = completedServices + completedLabs;
                                const isAllCompleted = totalRequests > 0 && completedRequestsCount === totalRequests;

                                return (
                                    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-black text-slate-800">
                                                    Bệnh nhân: <span className="text-indigo-600">{selectedRecord.patientName}</span>
                                                </h3>
                                                <p className="text-slate-400 text-xs font-semibold mt-1">
                                                    MÃ BỆNH ÁN: #{selectedRecord.medicalRecordId} | BÁC SĨ CHỈ ĐỊNH: {selectedRecord.doctorName}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                                selectedRecord.status === 'LOCKED'
                                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                                : selectedRecord.status === 'COMPLETED' 
                                                ? 'bg-emerald-100 text-emerald-800' 
                                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                                            }`}>
                                                {selectedRecord.status === 'LOCKED' 
                                                    ? 'ĐÃ KHÓA BỆNH ÁN' 
                                                    : selectedRecord.status === 'COMPLETED' 
                                                    ? 'ĐÃ HOÀN THÀNH CA KHÁM' 
                                                    : 'ĐANG TRONG TIẾN TRÌNH KHÁM'
                                                }
                                            </span>
                                        </div>

                                        {selectedRecord.status !== 'LOCKED' && (
                                            <>
                                                {totalRequests > 0 ? (
                                                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="font-bold text-slate-500">Tiến trình cận lâm sàng:</span>
                                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                isAllCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                            }`}>
                                                                {isAllCompleted ? '🟢 ĐÃ CÓ ĐẦY ĐỦ KẾT QUẢ' : '🟡 CHỜ KẾT QUẢ XÉT NGHIỆM / DỊCH VỤ'} ({completedRequestsCount}/{totalRequests})
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                            <div 
                                                                className={`h-full transition-all duration-500 rounded-full ${
                                                                    isAllCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                                                                }`}
                                                                style={{ width: `${(completedRequestsCount / totalRequests) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-bold text-slate-400 italic">
                                                        Bệnh nhân không có chỉ định cận lâm sàng nào.
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* Section 1: Services & Lab Tests Progress */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Medical Services Card */}
                                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
                                    <h4 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                                        Tiến độ Dịch vụ Kỹ thuật
                                    </h4>
                                    
                                    {loadingRequests ? (
                                        <div className="py-8 text-center text-slate-400 text-xs font-semibold animate-pulse">Đang tải...</div>
                                    ) : (
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                            {requests.map((req) => (
                                                <div key={req.medServiceRequestId} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="font-bold text-slate-700">Yêu cầu: #{req.requestCode}</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                            req.status === 'RESULT_AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                        }`}>
                                                            {req.status === 'RESULT_AVAILABLE' ? 'Đã có KQ' : 'Đang xử lý'}
                                                        </span>
                                                    </div>
                                                    <div className="border-t border-slate-100/60 pt-1.5 flex justify-between items-center">
                                                        <div className="text-[11px] font-medium text-slate-400 truncate max-w-[120px]">
                                                            {req.items?.map((it: any) => it.medicalServiceName).join(', ')}
                                                        </div>
                                                        <button
                                                            onClick={() => handleViewServiceResult(req.medServiceRequestId, req.requestCode)}
                                                            disabled={req.status !== 'RESULT_AVAILABLE'}
                                                            className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all active:scale-95 ${
                                                                req.status === 'RESULT_AVAILABLE'
                                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            Đọc kết quả
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {requests.length === 0 && (
                                                <p className="text-center text-slate-400 italic text-xs py-6">Không có chỉ định dịch vụ</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Lab Tests Card */}
                                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
                                    <h4 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-violet-600"></span>
                                        Tiến độ Xét nghiệm (Lab Tests)
                                    </h4>

                                    {loadingRequests ? (
                                        <div className="py-8 text-center text-slate-400 text-xs font-semibold animate-pulse">Đang tải...</div>
                                    ) : (
                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                                            {labRequests.map((req) => (
                                                <div key={req.labTestRequestId} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col gap-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="font-bold text-slate-700">Yêu cầu: #{req.requestCode}</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                            req.status === 'RESULT_AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                        }`}>
                                                            {req.status === 'RESULT_AVAILABLE' ? 'Đã có KQ' : 'Đang xử lý'}
                                                        </span>
                                                    </div>
                                                    <div className="border-t border-slate-100/60 pt-1.5 flex justify-between items-center">
                                                        <div className="text-[11px] font-medium text-slate-400 truncate max-w-[120px]">
                                                            {req.items?.map((it: any) => it.labTestName).join(', ')}
                                                        </div>
                                                        <button
                                                            onClick={() => handleViewLabResult(req.labTestRequestId, req.requestCode)}
                                                            disabled={req.status !== 'RESULT_AVAILABLE'}
                                                            className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all active:scale-95 ${
                                                                req.status === 'RESULT_AVAILABLE'
                                                                ? 'bg-violet-600 text-white hover:bg-violet-700'
                                                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            Đọc kết quả
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {labRequests.length === 0 && (
                                                <p className="text-center text-slate-400 italic text-xs py-6">Không có chỉ định xét nghiệm</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section 2: EMR Update Form */}
                            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                                <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Cập nhật Bệnh án Điện tử (EMR)
                                </h4>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chẩn đoán sơ bộ / kết luận *</label>
                                            <textarea
                                                value={diagnosis}
                                                onChange={(e) => setDiagnosis(e.target.value)}
                                                disabled={selectedRecord.status === 'LOCKED' || submitting}
                                                rows={2}
                                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none font-semibold text-slate-800 transition-all disabled:bg-slate-50 disabled:text-slate-400"
                                                placeholder="Nhập chẩn đoán lâm sàng..."
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kết luận điều trị *</label>
                                            <select 
                                                value={conclusionType}
                                                onChange={(e) => setConclusionType(e.target.value)}
                                                disabled={selectedRecord.status === 'LOCKED' || submitting}
                                                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-slate-800 transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400"
                                            >
                                                <option value="COMPLETED">Điều trị ngoại trú (Kê đơn)</option>
                                                <option value="ADMISSION_REQUIRED">Điều trị nội trú (Nhập viện)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ghi chú lâm sàng của bác sĩ</label>
                                            <textarea
                                                value={clinicalNotes}
                                                onChange={(e) => setClinicalNotes(e.target.value)}
                                                disabled={selectedRecord.status === 'LOCKED' || submitting}
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none font-semibold text-slate-800 transition-all disabled:bg-slate-50 disabled:text-slate-400"
                                                placeholder="Mô tả triệu chứng thực tế, ghi chú kiểm tra sức khỏe..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hướng điều trị / Phác đồ</label>
                                            <textarea
                                                value={treatmentPlan}
                                                onChange={(e) => setTreatmentPlan(e.target.value)}
                                                disabled={selectedRecord.status === 'LOCKED' || submitting}
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none font-semibold text-slate-800 transition-all disabled:bg-slate-50 disabled:text-slate-400"
                                                placeholder="Kế hoạch điều trị ngoại trú, dặn dò hoặc chỉ định đặc biệt..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                {selectedRecord.status !== 'LOCKED' && (
                                    <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                                        {selectedRecord.status === 'COMPLETED' && (
                                            <button
                                                type="button"
                                                onClick={handleLockRecord}
                                                disabled={submitting}
                                                className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold shadow-lg shadow-rose-600/15 active:scale-95 transition-all text-sm flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                                            >
                                                <span>Khóa bệnh án</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={handleSaveRecord}
                                            disabled={submitting}
                                            className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/10 hover:shadow-xl hover:shadow-indigo-600/20 active:scale-95 transition-all text-sm flex items-center gap-2.5 disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                            {submitting ? (
                                                <>
                                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                    <span>Đang lưu bệnh án...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Lưu bệnh án</span>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm flex flex-col items-center justify-center py-24 text-slate-400">
                            <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-base font-bold text-slate-700">Chưa chọn bệnh án</p>
                            <p className="text-slate-500 text-sm max-w-xs text-center mt-1">Vui lòng chọn một bệnh nhân từ danh sách bên trái để theo dõi tiến trình cận lâm sàng và cập nhật bệnh án.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Result Modal Popup */}
            {showResultModal && activeResult && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div>
                                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase tracking-wider">KẾT QUẢ CHẨN ĐOÁN</span>
                                <h3 className="text-base font-black text-slate-800 mt-1">
                                    Chi tiết kết quả {resultType === 'lab' ? 'Xét nghiệm' : 'Dịch vụ Kỹ thuật'}
                                </h3>
                                <p className="text-xs font-semibold text-slate-400">MÃ YÊU CẦU: #{activeResult.requestCode}</p>
                            </div>
                            <button 
                                onClick={() => setShowResultModal(false)}
                                className="w-10 h-10 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6">
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">THỜI GIAN CẬP NHẬT</span>
                                <p className="text-sm font-semibold text-slate-700">
                                    {activeResult.resultDate ? new Date(activeResult.resultDate).toLocaleString('vi-VN') : activeResult.createdAt ? new Date(activeResult.createdAt).toLocaleString('vi-VN') : 'Vừa xong'}
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">KẾT LUẬN CHI TIẾT TỪ KỸ THUẬT VIÊN</span>
                                <p className="text-sm font-bold text-slate-800 whitespace-pre-line leading-relaxed">
                                    {activeResult.resultData || 'Không có mô tả chi tiết'}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 flex justify-end bg-slate-50">
                            <button
                                onClick={() => setShowResultModal(false)}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 transition-colors active:scale-95"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default ExaminationStatusPage;
