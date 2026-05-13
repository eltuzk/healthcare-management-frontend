import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppointments } from '../../services/appointmentService';
import { getDoctorMe } from '../../services/doctorService';

const AppointmentSelectionPage: React.FC = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [doctorInfo, setDoctorInfo] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRes = await getDoctorMe();
                setDoctorInfo(docRes);
                
                // Get CHECKED_IN appointments for this doctor
                const apptRes = await getAppointments({ 
                    doctorId: docRes.doctorId, 
                    status: 'CHECKED_IN' 
                });
                
                // Sort by queue number or time
                const sortedAppts = (apptRes.content || apptRes || []).sort((a: any, b: any) => 
                    (a.queueNum || 0) - (b.queueNum || 0)
                );
                setAppointments(sortedAppts);
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleStartConsultation = (appointmentId: number) => {
        // Redirect to examination page with appointment ID
        navigate(`/doctor/examination?appointmentId=${appointmentId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Tạo bệnh án</h1>
                    <p className="text-slate-500">Danh sách bệnh nhân đã check-in đang chờ khám</p>
                </div>
                <div className="text-right">
                    <span className="text-sm font-medium text-slate-400 block uppercase tracking-wider">Bác sĩ phụ trách</span>
                    <span className="text-lg font-bold text-primary">{doctorInfo?.fullName}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appointments.map((appt) => (
                    <div key={appt.appointmentId} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xl">
                                {appt.queueNum}
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase">
                                Đã check-in
                            </span>
                        </div>
                        
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-1">{appt.patient?.fullName}</h3>
                            <p className="text-slate-500 text-sm">Mã BN: {appt.patient?.patientCode || 'N/A'}</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Check-in lúc: {appt.checkedInAt ? new Date(appt.checkedInAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {appt.feeNameSnapshot}
                            </div>
                        </div>

                        <button 
                            onClick={() => handleStartConsultation(appt.appointmentId)}
                            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Bắt đầu khám
                        </button>
                    </div>
                ))}

                {appointments.length === 0 && (
                    <div className="col-span-full py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className="text-lg font-medium">Không có bệnh nhân nào đang chờ</p>
                        <p className="text-sm">Vui lòng kiểm tra lại sau hoặc liên hệ bộ phận tiếp nhận</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentSelectionPage;
