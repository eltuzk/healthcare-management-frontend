import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAppointmentById, startAppointment } from '../../services/appointmentService';
import { 
    createMedicalRecordFromAppointment, 
    getMedicalRecords, 
    updateMedicalRecord,
    completeMedicalRecord 
} from '../../services/medicalRecordService';
import { 
    getMedicalServices, 
    createMedicalServiceRequest, 
    getMedicalServiceRequests 
} from '../../services/medicalServiceService';
import {
    getLabTests,
    createLabTestRequest,
    getLabTestRequestsByMedicalRecord
} from '../../services/labTestService';
import { toast } from 'react-hot-toast';

const ExaminationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const appointmentId = searchParams.get('appointmentId');
    const navigate = useNavigate();

        const [appointment, setAppointment] = useState<any>(null);
    const [medicalRecord, setMedicalRecord] = useState<any>(null);
    const [availableServices, setAvailableServices] = useState<any[]>([]);
    const [prescribedRequests, setPrescribedRequests] = useState<any[]>([]);
    const [availableLabTests, setAvailableLabTests] = useState<any[]>([]);
    const [prescribedLabRequests, setPrescribedLabRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form states
    const [initialDiagnosis, setInitialDiagnosis] = useState('');
    const [clinicalNotes, setClinicalNotes] = useState('');
    const [treatmentPlan, setTreatmentPlan] = useState('');
    const [conclusionType, setConclusionType] = useState('COMPLETED');
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [selectedLabTestId, setSelectedLabTestId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchServiceRequests = async (recordId: number) => {
        try {
            const res = await getMedicalServiceRequests({ medRecordId: recordId });
            const list = res.content || res || [];
            setPrescribedRequests(list);
        } catch (error) {
            console.error("Error fetching service requests:", error);
        }
    };

    const fetchLabRequests = async (recordId: number) => {
        try {
            const res = await getLabTestRequestsByMedicalRecord(recordId);
            setPrescribedLabRequests(res || []);
        } catch (error) {
            console.error("Error fetching lab requests:", error);
        }
    };

    useEffect(() => {
        if (!appointmentId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Get Appointment
                let appt = await getAppointmentById(appointmentId);
                if (appt.status === 'CHECKED_IN') {
                    try {
                        await startAppointment(appointmentId);
                        appt = await getAppointmentById(appointmentId);
                    } catch (startErr) {
                        console.error("Error starting appointment:", startErr);
                    }
                }
                setAppointment(appt);

                // 2. Get Medical Record if exists
                const records = await getMedicalRecords({ appointmentId });
                const record = records.length > 0 ? records[0] : null;
                
                if (record) {
                    setMedicalRecord(record);
                    setInitialDiagnosis(record.initialDiagnosis || '');
                    setClinicalNotes(record.clinicalNotes || '');
                    setTreatmentPlan(record.treatmentPlan || '');
                    setConclusionType(record.conclusionType || 'COMPLETED');
                    
                    // Get prescribed services & lab tests
                    await fetchServiceRequests(record.medicalRecordId);
                    await fetchLabRequests(record.medicalRecordId);
                }

                // 3. Get available services
                const services = await getMedicalServices();
                setAvailableServices(Array.isArray(services) ? services : []);

                // 4. Get available lab tests
                const labTests = await getLabTests();
                setAvailableLabTests(Array.isArray(labTests) ? labTests : []);

            } catch (error) {
                console.error("Error fetching examination data:", error);
                toast.error("Không thể tải thông tin khám bệnh");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [appointmentId]);

    const handleCreateOrUpdateRecord = async () => {
        if (!initialDiagnosis.trim()) {
            toast.error("Vui lòng nhập chẩn đoán sơ bộ");
            return;
        }

        setSubmitting(true);
        try {
            if (medicalRecord) {
                // Update
                const updated = await updateMedicalRecord(medicalRecord.medicalRecordId, {
                    version: medicalRecord.version,
                    initialDiagnosis,
                    clinicalNotes,
                    treatmentPlan,
                    clinicalConclusion: initialDiagnosis,
                    conclusionType
                });
                setMedicalRecord(updated);
                toast.success("Đã cập nhật bệnh án");
            } else {
                // Create
                const created = await createMedicalRecordFromAppointment(appointmentId, {
                    initialDiagnosis,
                    clinicalNotes,
                    treatmentPlan
                });
                setMedicalRecord(created);
                toast.success("Đã tạo bệnh án mới thành công");
            }
        } catch (error) {
            console.error("Error saving record:", error);
            toast.error("Lỗi khi lưu bệnh án");
        } finally {
            setSubmitting(false);
        }
    };

    const handlePrescribeService = async () => {
        if (!selectedServiceId) {
            toast.error("Vui lòng chọn một dịch vụ");
            return;
        }
        if (!medicalRecord) {
            toast.error("Vui lòng tạo/lưu bệnh án trước khi chỉ định dịch vụ cận lâm sàng");
            return;
        }

        try {
            await createMedicalServiceRequest({
                medRecordId: medicalRecord.medicalRecordId,
                medServiceIds: [Number(selectedServiceId)],
                note: "Chỉ định cận lâm sàng từ Bác sĩ"
            });
            
            // Refresh requests list
            await fetchServiceRequests(medicalRecord.medicalRecordId);
            setSelectedServiceId('');
            toast.success("Đã chỉ định dịch vụ thành công");
        } catch (error) {
            console.error("Error creating service request:", error);
            toast.error("Lỗi khi gửi chỉ định dịch vụ");
        }
    };

    const handlePrescribeLabTest = async () => {
        if (!selectedLabTestId) {
            toast.error("Vui lòng chọn một xét nghiệm");
            return;
        }
        if (!medicalRecord) {
            toast.error("Vui lòng tạo/lưu bệnh án trước khi chỉ định xét nghiệm");
            return;
        }

        try {
            await createLabTestRequest({
                medRecordId: medicalRecord.medicalRecordId,
                labTestIds: [Number(selectedLabTestId)],
                note: "Chỉ định xét nghiệm từ Bác sĩ"
            });
            
            // Refresh requests list
            await fetchLabRequests(medicalRecord.medicalRecordId);
            setSelectedLabTestId('');
            toast.success("Đã chỉ định xét nghiệm thành công");
        } catch (error) {
            console.error("Error creating lab request:", error);
            toast.error("Lỗi khi gửi chỉ định xét nghiệm");
        }
    };

    const handleComplete = async () => {
        if (!medicalRecord) {
            toast.error("Vui lòng tạo bệnh án trước khi kết thúc ca khám");
            return;
        }
        setSubmitting(true);
        try {
            // First save (update) with the latest values
            await updateMedicalRecord(medicalRecord.medicalRecordId, {
                version: medicalRecord.version,
                initialDiagnosis,
                clinicalNotes,
                treatmentPlan,
                clinicalConclusion: initialDiagnosis,
                conclusionType
            });
            
            // Then call complete
            await completeMedicalRecord(medicalRecord.medicalRecordId);
            
            toast.success("Đã hoàn tất ca khám bệnh");
            
            // Redirect based on conclusionType
            if (conclusionType === 'COMPLETED') {
                navigate(`/doctor/prescription?medicalRecordId=${medicalRecord.medicalRecordId}`);
            } else if (conclusionType === 'ADMISSION_REQUIRED') {
                navigate(`/doctor/admission?medicalRecordId=${medicalRecord.medicalRecordId}`);
            }
        } catch (error: any) {
            console.error("Error completing examination:", error);
            const errMsg = error.response?.data?.message || "Lỗi khi hoàn tất ca khám";
            toast.error(errMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="text-slate-500 font-medium animate-pulse">Đang tải thông tin khám bệnh...</p>
            </div>
        );
    }

    if (!appointmentId) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-8 m-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">Chưa chọn bệnh nhân</h3>
                <p className="text-slate-500 text-sm max-w-md text-center">Vui lòng quay lại danh sách tiếp nhận khám bệnh và chọn bệnh nhân để bắt đầu làm việc.</p>
                <button 
                    onClick={() => navigate('/doctor/appointments')}
                    className="mt-6 px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                >
                    Đến tiếp nhận khám bệnh
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            {/* Header info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
                            Phòng khám {appointment?.roomCode || 'N/A'}
                        </span>
                        <span className="text-slate-400 text-xs font-bold">•</span>
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                            Ca: {appointment?.appointmentTime || 'N/A'}
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                        Khám bệnh & Tư vấn
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-0.5">
                        Bệnh nhân: <span className="font-bold text-slate-700">{appointment?.patientName}</span> | Mã BN: <span className="font-bold text-indigo-600">{appointment?.patientId}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleCreateOrUpdateRecord}
                        disabled={submitting}
                        className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 active:scale-95 transition-all text-sm"
                    >
                        {submitting ? 'Đang lưu...' : 'Lưu nháp bệnh án'}
                    </button>
                    <button 
                        onClick={handleComplete}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 transition-all text-sm flex items-center gap-2"
                    >
                        <span>Hoàn tất khám</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: Patient info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                        <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Báo cáo Hành chính
                        </h3>
                        <div className="space-y-3.5 text-sm font-medium">
                            <div className="flex justify-between border-b border-slate-50 pb-2.5">
                                <span className="text-slate-400">Mã Bệnh nhân:</span>
                                <span className="text-slate-800 font-bold">{appointment?.patientId}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-2.5">
                                <span className="text-slate-400">Họ và tên:</span>
                                <span className="text-slate-800 font-bold">{appointment?.patientName}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-50 pb-2.5">
                                <span className="text-slate-400">Dịch vụ khám:</span>
                                <span className="text-indigo-600 font-bold">{appointment?.feeName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Số thứ tự khám:</span>
                                <span className="text-amber-600 font-black bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">STT {appointment?.queueNum}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50/50 rounded-3xl p-6 border border-amber-100/80">
                        <h3 className="text-base font-black text-amber-800 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Triệu chứng ban đầu
                        </h3>
                        <p className="text-amber-900 text-sm italic font-medium leading-relaxed">
                            "{appointment?.initialSymptoms || 'Không có ghi chú triệu chứng từ lễ tân'}"
                        </p>
                    </div>
                </div>

                {/* Right side: Consultation details and clinical orders */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Clinical Details Form */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                        <h3 className="text-base font-black text-slate-800 mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Hồ sơ bệnh án điện tử (EMR)
                        </h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chẩn đoán sơ bộ *</label>
                                    <textarea 
                                        value={initialDiagnosis}
                                        onChange={(e) => setInitialDiagnosis(e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none font-semibold text-slate-800 transition-all min-h-[100px]"
                                        placeholder="Nhập chẩn đoán lâm sàng sơ bộ..."
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kết luận điều trị *</label>
                                    <select 
                                        value={conclusionType}
                                        onChange={(e) => setConclusionType(e.target.value)}
                                        className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-slate-800 transition-all bg-white"
                                    >
                                        <option value="COMPLETED">Điều trị ngoại trú (Kê đơn)</option>
                                        <option value="ADMISSION_REQUIRED">Điều trị nội trú (Nhập viện)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ghi chú lâm sàng</label>
                                    <textarea 
                                        value={clinicalNotes}
                                        onChange={(e) => setClinicalNotes(e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none font-semibold text-slate-800 transition-all min-h-[120px]"
                                        placeholder="Ghi chú tiền sử, diễn tiến, dị ứng thuốc..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hướng điều trị / Phác đồ</label>
                                    <textarea 
                                        value={treatmentPlan}
                                        onChange={(e) => setTreatmentPlan(e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none font-semibold text-slate-800 transition-all min-h-[120px]"
                                        placeholder="Kế hoạch điều trị tiếp theo, lời dặn dặn dò..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Medical Services selection */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                            <h3 className="text-base font-black text-slate-800 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                Chỉ định Dịch vụ / Cận lâm sàng (Medical Services)
                            </h3>

                            <div className="flex flex-col gap-3 mb-6">
                                <select 
                                    value={selectedServiceId}
                                    onChange={(e) => setSelectedServiceId(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 outline-none focus:border-indigo-600 font-bold text-slate-800 bg-white"
                                >
                                    <option value="">-- Chọn dịch vụ cận lâm sàng --</option>
                                    {availableServices.map(service => (
                                        <option key={service.medServiceId} value={service.medServiceId}>
                                            {service.medicalServiceName} ({service.price.toLocaleString()} VNĐ)
                                        </option>
                                    ))}
                                </select>
                                <button 
                                    onClick={handlePrescribeService}
                                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-2xl font-bold transition-all text-sm shadow-md shadow-indigo-600/10 flex items-center justify-center"
                                >
                                    Chỉ định dịch vụ
                                </button>
                            </div>

                            {/* List of ordered service requests */}
                            <div className="space-y-4">
                                {prescribedRequests.map((req, idx) => (
                                    <div key={req.medServiceRequestId} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/50 flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-6 h-6 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                                                    {idx + 1}
                                                </span>
                                                <span className="font-bold text-slate-700 text-sm">
                                                    Yêu cầu: <span className="text-indigo-600">{req.requestCode}</span>
                                                </span>
                                            </div>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                req.status === 'COMPLETED'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {req.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Đang thực hiện'}
                                            </span>
                                        </div>
                                        <div className="border-t border-slate-100 pt-2 flex flex-col gap-1.5 pl-8">
                                            {req.items?.map((item: any) => (
                                                <div key={item.medServiceId} className="flex justify-between text-xs font-semibold text-slate-500">
                                                    <span>• {item.medicalServiceName}</span>
                                                    <span className="text-slate-700 font-bold">{item.snapshotPrice?.toLocaleString()} đ</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {prescribedRequests.length === 0 && (
                                    <div className="text-center text-slate-400 py-6 italic text-sm font-medium">
                                        Bệnh nhân này chưa có chỉ định dịch vụ cận lâm sàng nào.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lab Tests selection */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                            <h3 className="text-base font-black text-slate-800 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Chỉ định Xét nghiệm (Lab Tests)
                            </h3>

                            <div className="flex flex-col gap-3 mb-6">
                                <select 
                                    value={selectedLabTestId}
                                    onChange={(e) => setSelectedLabTestId(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 outline-none focus:border-indigo-600 font-bold text-slate-800 bg-white"
                                >
                                    <option value="">-- Chọn xét nghiệm --</option>
                                    {availableLabTests.map(test => (
                                        <option key={test.labTestId} value={test.labTestId}>
                                            {test.labTestName} ({test.price.toLocaleString()} VNĐ)
                                        </option>
                                    ))}
                                </select>
                                <button 
                                    onClick={handlePrescribeLabTest}
                                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-2xl font-bold transition-all text-sm shadow-md shadow-indigo-600/10 flex items-center justify-center"
                                >
                                    Chỉ định xét nghiệm
                                </button>
                            </div>

                            {/* List of ordered lab test requests */}
                            <div className="space-y-4">
                                {prescribedLabRequests.map((req, idx) => (
                                    <div key={req.labTestRequestId} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/50 flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2.5">
                                                <span className="w-6 h-6 bg-slate-200 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                                                    {idx + 1}
                                                </span>
                                                <span className="font-bold text-slate-700 text-sm">
                                                    Yêu cầu: <span className="text-indigo-600">{req.requestCode}</span>
                                                </span>
                                            </div>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                req.status === 'COMPLETED'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {req.status === 'COMPLETED' ? 'Đã hoàn thành' : 'Đang thực hiện'}
                                            </span>
                                        </div>
                                        <div className="border-t border-slate-100 pt-2 flex flex-col gap-1.5 pl-8">
                                            {req.items?.map((item: any) => (
                                                <div key={item.labTestId} className="flex justify-between text-xs font-semibold text-slate-500">
                                                    <span>• {item.labTestName}</span>
                                                    <span className="text-slate-700 font-bold">{item.snapshotPrice?.toLocaleString()} đ</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {prescribedLabRequests.length === 0 && (
                                    <div className="text-center text-slate-400 py-6 italic text-sm font-medium">
                                        Bệnh nhân này chưa có chỉ định xét nghiệm nào.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExaminationPage;
