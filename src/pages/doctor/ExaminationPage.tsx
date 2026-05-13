import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAppointmentById } from '../../services/appointmentService';
import { 
    createMedicalRecordFromAppointment, 
    getMedicalRecords, 
    updateMedicalRecord,
    completeMedicalRecord 
} from '../../services/medicalRecordService';
import { getLabTests, createLabTestRequest, getLabTestRequestsByMedicalRecord } from '../../services/labTestService';
import { toast } from 'react-hot-toast';

const ExaminationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const appointmentId = searchParams.get('appointmentId');
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState<any>(null);
    const [medicalRecord, setMedicalRecord] = useState<any>(null);
    const [labTests, setLabTests] = useState<any[]>([]);
    const [prescribedTests, setPrescribedTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Form states
    const [initialDiagnosis, setInitialDiagnosis] = useState('');
    const [clinicalNotes, setClinicalNotes] = useState('');
    const [treatmentPlan, setTreatmentPlan] = useState('');
    const [selectedLabTestId, setSelectedLabTestId] = useState('');

    useEffect(() => {
        if (!appointmentId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Get Appointment
                const appt = await getAppointmentById(appointmentId);
                setAppointment(appt);

                // 2. Get Medical Record if exists
                const records = await getMedicalRecords({ appointmentId });
                const record = records.length > 0 ? records[0] : null;
                
                if (record) {
                    setMedicalRecord(record);
                    setInitialDiagnosis(record.initialDiagnosis || '');
                    setClinicalNotes(record.clinicalNotes || '');
                    setTreatmentPlan(record.treatmentPlan || '');
                    
                    // Get prescribed tests for this record
                    const tests = await getLabTestRequestsByMedicalRecord(record.medRecordId);
                    setPrescribedTests(tests);
                }

                // 3. Get available lab tests
                const availableTests = await getLabTests();
                setLabTests(availableTests);

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
        try {
            if (medicalRecord) {
                // Update
                const updated = await updateMedicalRecord(medicalRecord.medRecordId, {
                    version: medicalRecord.versionNumber,
                    initialDiagnosis,
                    clinicalNotes,
                    treatmentPlan
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
                toast.success("Đã tạo bệnh án mới");
            }
        } catch (error) {
            console.error("Error saving record:", error);
            toast.error("Lỗi khi lưu bệnh án");
        }
    };

    const handlePrescribeTest = async () => {
        if (!selectedLabTestId || !medicalRecord) {
            toast.error("Vui lòng lưu bệnh án trước khi chỉ định xét nghiệm");
            return;
        }

        try {
            await createLabTestRequest({
                medRecordId: medicalRecord.medRecordId,
                labTestId: selectedLabTestId,
                note: "Chỉ định từ bác sĩ"
            });
            
            // Refresh prescribed tests
            const tests = await getLabTestRequestsByMedicalRecord(medicalRecord.medRecordId);
            setPrescribedTests(tests);
            setSelectedLabTestId('');
            toast.success("Đã thêm chỉ định xét nghiệm");
        } catch (error) {
            console.error("Error prescribing test:", error);
            toast.error("Lỗi khi chỉ định xét nghiệm");
        }
    };

    const handleComplete = async () => {
        if (!medicalRecord) return;
        try {
            await completeMedicalRecord(medicalRecord.medRecordId);
            toast.success("Đã hoàn tất ca khám");
            navigate('/doctor/appointments');
        } catch (error) {
            toast.error("Lỗi khi hoàn tất");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!appointmentId) return <div className="p-10 text-center text-slate-500 italic">Vui lòng chọn một lịch hẹn từ danh sách để bắt đầu khám.</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Khám bệnh & Tư vấn</h1>
                    <p className="text-slate-500">Bệnh nhân: <span className="font-bold text-slate-700">{appointment?.patient?.fullName}</span> | Mã BN: {appointment?.patient?.patientCode}</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleCreateOrUpdateRecord}
                        className="px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
                    >
                        Lưu nháp
                    </button>
                    <button 
                        onClick={handleComplete}
                        className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark shadow-lg shadow-primary/20 transition-colors"
                    >
                        Hoàn tất khám
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Patient History & Symptoms */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Thông tin bệnh nhân
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Giới tính:</span>
                                <span className="font-medium">{appointment?.patient?.gender === 'MALE' ? 'Nam' : 'Nữ'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Ngày sinh:</span>
                                <span className="font-medium">{appointment?.patient?.dateOfBirth}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Số điện thoại:</span>
                                <span className="font-medium">{appointment?.patient?.phone}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                        <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Triệu chứng ban đầu
                        </h3>
                        <p className="text-amber-900 text-sm italic">
                            "{appointment?.initialSymptoms || 'Không có ghi chú triệu chứng'}"
                        </p>
                    </div>
                </div>

                {/* Center: Consultation Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Chẩn đoán sơ bộ *</label>
                                <textarea 
                                    value={initialDiagnosis}
                                    onChange={(e) => setInitialDiagnosis(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[100px]"
                                    placeholder="Nhập chẩn đoán ban đầu..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Ghi chú lâm sàng</label>
                                <textarea 
                                    value={clinicalNotes}
                                    onChange={(e) => setClinicalNotes(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[120px]"
                                    placeholder="Nhập diễn tiến bệnh, tiền sử..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Hướng điều trị / Lời dặn</label>
                                <textarea 
                                    value={treatmentPlan}
                                    onChange={(e) => setTreatmentPlan(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[100px]"
                                    placeholder="Nhập phác đồ điều trị, đơn thuốc hoặc lời dặn..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lab Tests Section */}
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            Chỉ định xét nghiệm / Dịch vụ
                        </h3>
                        
                        <div className="flex gap-3 mb-6">
                            <select 
                                value={selectedLabTestId}
                                onChange={(e) => setSelectedLabTestId(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-primary"
                            >
                                <option value="">-- Chọn xét nghiệm/dịch vụ --</option>
                                {labTests.map(test => (
                                    <option key={test.labTestId} value={test.labTestId}>{test.testName} ({test.price.toLocaleString()} VNĐ)</option>
                                ))}
                            </select>
                            <button 
                                onClick={handlePrescribeTest}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                            >
                                Thêm chỉ định
                            </button>
                        </div>

                        <div className="space-y-3">
                            {prescribedTests.map((req, idx) => (
                                <div key={req.requestId} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">{idx + 1}</span>
                                        <div>
                                            <p className="font-bold text-slate-800">{req.labTest?.testName}</p>
                                            <p className="text-xs text-slate-500 uppercase font-semibold">{req.status}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-primary">{req.labTest?.price?.toLocaleString()} đ</p>
                                    </div>
                                </div>
                            ))}
                            {prescribedTests.length === 0 && (
                                <p className="text-center text-slate-400 py-4 italic text-sm">Chưa có chỉ định nào</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExaminationPage;
