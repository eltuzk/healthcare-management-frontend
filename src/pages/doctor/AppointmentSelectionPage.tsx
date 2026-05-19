import React, { useEffect, useState } from 'react';
import { getAppointments } from '../../services/appointmentService';
import { getDoctorMe } from '../../services/doctorService';
import { createMedicalRecordFromAppointment } from '../../services/medicalRecordService';
import { getMedicalServices, createMedicalServiceRequest } from '../../services/medicalServiceService';
import { getLabTests, createLabTestRequest } from '../../services/labService';
import { toast } from 'react-hot-toast';

const AppointmentSelectionPage: React.FC = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [doctorInfo, setDoctorInfo] = useState<any>(null);
    
    // Selection state
    const [selectedAppt, setSelectedAppt] = useState<any>(null);

    // EMR creation state
    const [initialDiagnosis, setInitialDiagnosis] = useState('');
    const [clinicalNotes, setClinicalNotes] = useState('');
    const [treatmentPlan, setTreatmentPlan] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Lists of options
    const [availableServices, setAvailableServices] = useState<any[]>([]);
    const [availableLabTests, setAvailableLabTests] = useState<any[]>([]);

    // Selected items for prescription
    const [selectedServices, setSelectedServices] = useState<any[]>([]);
    const [selectedLabTests, setSelectedLabTests] = useState<any[]>([]);

    // Dropdown temp values
    const [currentServiceId, setCurrentServiceId] = useState('');
    const [currentLabTestId, setCurrentLabTestId] = useState('');

    const fetchQueueData = async () => {
        try {
            const docRes = await getDoctorMe();
            setDoctorInfo(docRes);
            
            // Get CHECKED_IN appointments for this doctor
            const apptRes = await getAppointments({ 
                doctorId: docRes.doctorId, 
                status: 'CHECKED_IN' 
            });
            
            // Sort by queue number
            const sortedAppts = (apptRes.content || apptRes || []).sort((a: any, b: any) => 
                (a.queueNum || 0) - (b.queueNum || 0)
            );
            setAppointments(sortedAppts);
        } catch (error) {
            console.error("Error fetching queue data:", error);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                await fetchQueueData();

                // Fetch available services & lab tests
                const servs = await getMedicalServices();
                setAvailableServices(servs || []);

                const labs = await getLabTests();
                setAvailableLabTests(labs || []);
            } catch (error) {
                console.error("Error loading clinical references:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleSelectPatient = (appt: any) => {
        setSelectedAppt(appt);
        // Clear old inputs
        setInitialDiagnosis('');
        setClinicalNotes('');
        setTreatmentPlan('');
        setSelectedServices([]);
        setSelectedLabTests([]);
        setCurrentServiceId('');
        setCurrentLabTestId('');
    };

    const handleAddService = () => {
        if (!currentServiceId) return;
        const found = availableServices.find(s => s.medServiceId === Number(currentServiceId));
        if (found && !selectedServices.some(s => s.medServiceId === found.medServiceId)) {
            setSelectedServices([...selectedServices, found]);
        }
        setCurrentServiceId('');
    };

    const handleRemoveService = (id: number) => {
        setSelectedServices(selectedServices.filter(s => s.medServiceId !== id));
    };

    const handleAddLabTest = () => {
        if (!currentLabTestId) return;
        const found = availableLabTests.find(l => l.labTestId === Number(currentLabTestId));
        if (found && !selectedLabTests.some(l => l.labTestId === found.labTestId)) {
            setSelectedLabTests([...selectedLabTests, found]);
        }
        setCurrentLabTestId('');
    };

    const handleRemoveLabTest = (id: number) => {
        setSelectedLabTests(selectedLabTests.filter(l => l.labTestId !== id));
    };

    const handleCreateRecord = async () => {
        if (!selectedAppt) return;
        if (!initialDiagnosis.trim()) {
            toast.error("Vui lòng nhập chẩn đoán sơ bộ");
            return;
        }

        setSubmitting(true);
        try {
            // 1. Create EMR
            const createdRecord = await createMedicalRecordFromAppointment(selectedAppt.appointmentId, {
                initialDiagnosis,
                clinicalNotes,
                treatmentPlan
            });

            // 2. Prescribe services (if any)
            if (selectedServices.length > 0) {
                await createMedicalServiceRequest({
                    medRecordId: createdRecord.medicalRecordId,
                    medServiceIds: selectedServices.map(s => s.medServiceId),
                    note: "Chỉ định cận lâm sàng"
                });
            }

            // 3. Prescribe lab tests (if any)
            if (selectedLabTests.length > 0) {
                await createLabTestRequest({
                    medRecordId: createdRecord.medicalRecordId,
                    labTestIds: selectedLabTests.map(l => l.labTestId),
                    note: "Chỉ định xét nghiệm"
                });
            }

            toast.success("Đã tạo bệnh án và gửi chỉ định cận lâm sàng thành công!");
            
            // Clear selected patient & form states
            setSelectedAppt(null);
            setInitialDiagnosis('');
            setClinicalNotes('');
            setTreatmentPlan('');
            setSelectedServices([]);
            setSelectedLabTests([]);

            // Refresh queue list
            await fetchQueueData();
        } catch (error) {
            console.error("Error creating medical record:", error);
            toast.error("Gặp lỗi trong quá trình tạo bệnh án");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-125px)] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="text-slate-500 font-medium animate-pulse">Đang tải danh sách chờ...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Tiếp Nhận Khám Bệnh</h1>
                    <p className="text-slate-500 font-medium">Danh sách bệnh nhân đang xếp hàng chờ và khu vực tạo bệnh án điện tử (EMR) trực tiếp</p>
                </div>
                <div className="text-left md:text-right bg-slate-50 border border-slate-200/50 px-5 py-3 rounded-2xl">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-widest">Bác sĩ phụ trách</span>
                    <span className="text-base font-black text-indigo-600">{doctorInfo?.fullName}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Waiting Queue Table */}
                <div className={`transition-all duration-300 ${selectedAppt ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Bệnh nhân chờ khám ({appointments.length})
                            </h3>
                            <span className="px-3 py-1 bg-amber-50 border border-amber-200/55 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                Trực tuyến
                            </span>
                        </div>

                        {appointments.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                            <th className="py-4 px-4 text-center w-16">STT</th>
                                            <th className="py-4 px-4">Tên bệnh nhân</th>
                                            {!selectedAppt && (
                                                <>
                                                    <th className="py-4 px-4">Mã BN</th>
                                                    <th className="py-4 px-4">Check-in lúc</th>
                                                    <th className="py-4 px-4">Loại hình khám</th>
                                                </>
                                            )}
                                            <th className="py-4 px-4 text-right w-32">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700 text-sm">
                                        {appointments.map((appt) => {
                                            const isSelected = selectedAppt?.appointmentId === appt.appointmentId;
                                            return (
                                                <tr key={appt.appointmentId} className={`transition-colors ${isSelected ? 'bg-indigo-50/70 hover:bg-indigo-50' : 'hover:bg-slate-50/50'}`}>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className={`inline-flex w-7 h-7 items-center justify-center font-black rounded-lg text-xs border ${
                                                            isSelected 
                                                            ? 'bg-indigo-600 border-indigo-600 text-white' 
                                                            : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                                                        }`}>
                                                            {appt.queueNum}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="font-black text-slate-800 text-sm leading-tight">{appt.patientName}</div>
                                                        {selectedAppt && (
                                                            <div className="text-[11px] text-slate-400 mt-0.5">#{appt.patientId} • {appt.feeName}</div>
                                                        )}
                                                    </td>
                                                    {!selectedAppt && (
                                                        <>
                                                            <td className="py-4 px-4 font-bold text-slate-500">
                                                                #{appt.patientId || 'N/A'}
                                                            </td>
                                                            <td className="py-4 px-4 text-slate-500">
                                                                {appt.checkedInAt ? new Date(appt.checkedInAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                                            </td>
                                                            <td className="py-4 px-4 text-slate-500">
                                                                <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-600">
                                                                    {appt.feeName || 'Khám lâm sàng'}
                                                                </span>
                                                            </td>
                                                        </>
                                                    )}
                                                    <td className="py-4 px-4 text-right">
                                                        <button
                                                            onClick={() => handleSelectPatient(appt)}
                                                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 ml-auto ${
                                                                isSelected
                                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10'
                                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                            }`}
                                                        >
                                                            {isSelected ? 'Đang chọn' : 'Chọn khám'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-20 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400">
                                <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <p className="text-sm font-bold text-slate-700">Không có bệnh nhân chờ</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Active EMR Creation Area */}
                {selectedAppt && (
                    <div className="lg:col-span-7 space-y-6 animate-slide-in">
                        {/* Selected Patient Details Card */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-widest">ĐANG KHÁM LÂM SÀNG</span>
                                    <h3 className="text-lg font-black text-slate-800 mt-0.5">
                                        {selectedAppt.patientName}
                                    </h3>
                                    <p className="text-slate-500 text-xs font-semibold mt-1">
                                        MÃ BN: #{selectedAppt.patientId} | DỊCH VỤ: {selectedAppt.feeName}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setSelectedAppt(null)}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-[10px] font-bold text-slate-600 transition-all active:scale-95"
                                >
                                    Đóng
                                </button>
                            </div>

                            {selectedAppt.initialSymptoms && (
                                <div className="mt-4 p-4 bg-amber-50/50 border border-amber-100/60 rounded-2xl">
                                    <span className="text-[10px] font-bold text-amber-800 block uppercase tracking-wider mb-1">Triệu chứng ban đầu (Lễ tân ghi nhận)</span>
                                    <p className="text-amber-900 text-xs italic font-semibold">"{selectedAppt.initialSymptoms}"</p>
                                </div>
                            )}
                        </div>

                        {/* EMR Diagnosis and Notes Form */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
                            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Thông tin bệnh án điện tử (EMR)
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chẩn đoán sơ bộ *</label>
                                    <textarea
                                        value={initialDiagnosis}
                                        onChange={(e) => setInitialDiagnosis(e.target.value)}
                                        disabled={submitting}
                                        rows={2}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none font-semibold text-slate-800 text-sm transition-all"
                                        placeholder="Nhập chẩn đoán sơ bộ cận lâm sàng..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ghi chú lâm sàng</label>
                                        <textarea
                                            value={clinicalNotes}
                                            onChange={(e) => setClinicalNotes(e.target.value)}
                                            disabled={submitting}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none font-semibold text-slate-800 text-sm transition-all"
                                            placeholder="Ghi nhận triệu chứng lâm sàng khám thấy..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hướng điều trị / Phác đồ</label>
                                        <textarea
                                            value={treatmentPlan}
                                            onChange={(e) => setTreatmentPlan(e.target.value)}
                                            disabled={submitting}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none font-semibold text-slate-800 text-sm transition-all"
                                            placeholder="Hướng xử trí tiếp theo..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Prescription Selection & Selected Lists */}
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
                            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Kê đơn kỹ thuật & xét nghiệm cận lâm sàng
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Medical Services Dropdown */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chỉ định Dịch vụ / Cận lâm sàng</label>
                                    <div className="flex gap-2">
                                        <select 
                                            value={currentServiceId}
                                            onChange={(e) => setCurrentServiceId(e.target.value)}
                                            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-600 font-bold text-slate-700 text-xs bg-white"
                                        >
                                            <option value="">-- Chọn dịch vụ kỹ thuật --</option>
                                            {availableServices.map(s => (
                                                <option key={s.medServiceId} value={s.medServiceId}>
                                                    {s.medicalServiceName} ({s.price.toLocaleString()} đ)
                                                </option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={handleAddService}
                                            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl font-bold text-white text-xs transition-all shadow-md shadow-indigo-600/10"
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                    <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                                        {selectedServices.map(s => (
                                            <div key={s.medServiceId} className="flex justify-between items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-xs">
                                                <span className="font-bold text-slate-700 truncate max-w-[150px]">{s.medicalServiceName}</span>
                                                <button 
                                                    onClick={() => handleRemoveService(s.medServiceId)}
                                                    className="text-red-500 hover:text-red-700 text-[10px] font-black"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Lab Tests Dropdown */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chỉ định Xét nghiệm (Lab Tests)</label>
                                    <div className="flex gap-2">
                                        <select 
                                            value={currentLabTestId}
                                            onChange={(e) => setCurrentLabTestId(e.target.value)}
                                            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-600 font-bold text-slate-700 text-xs bg-white"
                                        >
                                            <option value="">-- Chọn xét nghiệm --</option>
                                            {availableLabTests.map(l => (
                                                <option key={l.labTestId} value={l.labTestId}>
                                                    {l.labTestName} ({l.price.toLocaleString()} đ)
                                                </option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={handleAddLabTest}
                                            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 active:scale-95 rounded-xl font-bold text-white text-xs transition-all shadow-md shadow-violet-600/10"
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                    <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                                        {selectedLabTests.map(l => (
                                            <div key={l.labTestId} className="flex justify-between items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-xs">
                                                <span className="font-bold text-slate-700 truncate max-w-[150px]">{l.labTestName}</span>
                                                <button 
                                                    onClick={() => handleRemoveLabTest(l.labTestId)}
                                                    className="text-red-500 hover:text-red-700 text-[10px] font-black"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Final Create Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => setSelectedAppt(null)}
                                    disabled={submitting}
                                    className="px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 active:scale-95 transition-all text-xs disabled:opacity-50"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={handleCreateRecord}
                                    disabled={submitting}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 transition-all text-xs flex items-center gap-2 disabled:opacity-50"
                                >
                                    {submitting ? 'Đang tạo bệnh án...' : 'Tạo bệnh án & Gửi chỉ định'}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentSelectionPage;
