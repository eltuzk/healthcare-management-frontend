import React, { useState, useEffect } from 'react';
import { getMedicalRecords } from '../../services/medicalRecordService';
import { getPrescriptionByMedicalRecordId } from '../../services/prescriptionService';
import { getLabTestRequestsByMedicalRecordId, getLabTestResultByRequestId } from '../../services/labService';
import toast from 'react-hot-toast';

const MyMedicalRecordsPage: React.FC = () => {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      const response = await getMedicalRecords();
      // response.data could be wrapped in ApiResponse, usually authService handles it or it returns response.data directly
      // In this project, wrapped API responses are unwrapped by api.ts usually. Let's assume it returns the array or { data: array }
      const records = response.data || response;
      
      const formattedRecords = Array.isArray(records) ? records.map((record: any) => {
        const d = record.appointmentDate ? new Date(record.appointmentDate) : null;
        const dateStr = d ? `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}` : 'N/A';
        return {
          id: record.medicalRecordId,
          date: dateStr,
        diagnosis: record.initialDiagnosis || 'Đang chờ khám',
        status: record.status === 'COMPLETED' ? 'HOÀN THÀNH' : (record.status === 'IN_PROGRESS' ? 'ĐANG KHÁM' : record.status),
        symptoms: record.clinicalNotes || 'Chưa ghi nhận',
        doctor: record.doctorName || 'Chưa phân công',
        department: 'Đa khoa',
        isExpanded: false,
        labResults: [], // Can be fetched on expand
        prescriptions: [], // Can be fetched on expand
        attachments: []
        };
      }) : [];

      setTimeline(formattedRecords);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      toast.error('Không thể tải hồ sơ y tế. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (id: number) => {
    setTimeline(timeline.map(item => 
      item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
    ));

    // Optional: Fetch prescriptions and lab results dynamically here if not already fetched
    const record = timeline.find(item => item.id === id);
    if (record && !record.isExpanded && record.prescriptions.length === 0) {
      try {
        const presRes = await getPrescriptionByMedicalRecordId(id);
        const presData = presRes.data || presRes;
        
        if (presData && presData.prescriptionDetails) {
            const mappedPrescriptions = presData.prescriptionDetails.map((detail: any) => ({
                name: detail.medicineName,
                usage: detail.instructions || `${detail.quantity} ${detail.unit}`
            }));
            
            setTimeline(prev => prev.map(item => 
                item.id === id ? { ...item, prescriptions: mappedPrescriptions } : item
            ));
        }
      } catch (err) {
        console.error('Error fetching details for record', id, err);
      }
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in pb-12">
      
      {/* Patient Header */}
      <div className="bg-gradient-to-r from-primary to-primary-container rounded-[24px] p-8 shadow-ambient border border-primary/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary font-bold text-2xl shadow-lg ring-4 ring-white/30">
            {/* Thường lấy Initials từ tên */}
            ME
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-1">Hồ sơ Y tế của tôi</h1>
            <p className="font-body text-sm text-primary-onContainer/80">
              Tra cứu lịch sử khám, đơn thuốc và kết quả cận lâm sàng
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <select className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5 font-body text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer">
            <option className="text-gray-900">Tất cả thời gian</option>
            <option className="text-gray-900">6 tháng gần nhất</option>
            <option className="text-gray-900">1 năm gần nhất</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column: Vertical Timeline */}
        <div className="flex-1 space-y-6 w-full">
          <h2 className="font-display text-xl font-bold text-on-surface ml-2">Lịch sử các lần khám</h2>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
          ) : timeline.length === 0 ? (
            <div className="text-center p-12 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant">
              <p className="text-on-surface-variant font-body">Bạn chưa có lịch sử khám bệnh nào.</p>
            </div>
          ) : (
            <div className="relative pl-8 border-l-2 border-surface-container-high space-y-8 ml-4">
            
            {timeline.map((visit, index) => (
              <div key={visit.id} className="relative">
                {/* Timeline Dot */}
                <div className={`absolute -left-[41px] top-4 w-5 h-5 rounded-full border-4 border-surface-container-lowest transition-colors ${visit.isExpanded ? 'bg-primary border-primary/30' : 'bg-surface-container-high'}`}></div>
                
                <div className={`bg-surface-container-lowest rounded-[24px] shadow-sm border transition-all overflow-hidden ${visit.isExpanded ? 'border-primary/30 shadow-md ring-1 ring-primary/5' : 'border-surface-container-low hover:border-outline-variant/30 hover:shadow-ambient'}`}>
                  
                  {/* Card Header (Clickable) */}
                  <div 
                    className="p-5 flex justify-between items-center cursor-pointer group"
                    onClick={() => toggleExpand(visit.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
                      <div className="flex flex-col">
                        <span className="font-display font-black text-primary text-lg">{visit.date}</span>
                        <span className="font-body text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{visit.department}</span>
                      </div>
                      
                      <div className="hidden sm:block w-px h-10 bg-outline-variant/30"></div>
                      
                      <div className="flex-1">
                        <h3 className="font-body font-bold text-on-surface text-base mb-1">{visit.diagnosis}</h3>
                        <p className="font-body text-xs text-on-surface-variant line-clamp-1">{visit.symptoms}</p>
                      </div>
                      
                      <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                        {visit.status}
                      </span>
                    </div>
                    <button className="text-on-surface-variant p-2 rounded-full group-hover:bg-surface-container-low transition-colors ml-2 shrink-0">
                      <svg className={`w-5 h-5 transition-transform ${visit.isExpanded ? 'rotate-180 text-primary' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {visit.isExpanded && (
                    <div className="p-6 border-t border-surface-container-low bg-surface-container-lowest/50 space-y-8 animate-fade-in">
                      
                      {/* Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20">
                        <div>
                          <p className="font-body text-[10px] font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Triệu chứng ghi nhận
                          </p>
                          <p className="font-body text-sm text-on-surface leading-relaxed">{visit.symptoms}</p>
                        </div>
                        <div>
                          <p className="font-body text-[10px] font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            Bác sĩ phụ trách
                          </p>
                          <p className="font-body text-sm font-bold text-on-surface">{visit.doctor}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Prescriptions */}
                        {visit.prescriptions && visit.prescriptions.length > 0 && (
                          <div>
                            <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 border-b border-surface-container-low pb-2 flex justify-between items-center">
                              Đơn thuốc được kê
                              <span className="text-primary cursor-pointer hover:underline">Tải đơn thuốc (PDF)</span>
                            </p>
                            <ul className="space-y-3">
                              {visit.prescriptions.map((med, i) => (
                                <li key={i} className="flex gap-3 items-start bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-colors">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                                  </div>
                                  <div>
                                    <span className="font-body font-bold text-sm text-on-surface block mb-0.5">{med.name}</span>
                                    <span className="font-body text-xs text-on-surface-variant">{med.usage}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Lab Results Table */}
                        {visit.labResults.length > 0 && (
                          <div>
                            <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 border-b border-surface-container-low pb-2 flex justify-between items-center">
                              Kết quả Cận lâm sàng
                              <span className="text-primary cursor-pointer hover:underline">Tải kết quả (PDF)</span>
                            </p>
                            <div className="border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
                              <table className="w-full text-left">
                                <thead className="bg-surface-container-low/80 border-b border-outline-variant/30">
                                  <tr>
                                    <th className="py-2.5 px-3 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Chỉ số</th>
                                    <th className="py-2.5 px-3 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Kết quả</th>
                                    <th className="py-2.5 px-3 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">CSBT</th>
                                    <th className="py-2.5 px-3 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Đánh giá</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/20 bg-white">
                                  {visit.labResults.map((lab, i) => (
                                    <tr key={i} className="hover:bg-surface-container-lowest/50 transition-colors">
                                      <td className="py-3 px-3 font-body text-sm font-bold text-on-surface">{lab.indicator}</td>
                                      <td className={`py-3 px-3 font-body text-sm font-bold ${lab.status === 'BÌNH THƯỜNG' ? 'text-on-surface' : 'text-error'}`}>{lab.result}</td>
                                      <td className="py-3 px-3 font-body text-xs text-on-surface-variant">{lab.range}</td>
                                      <td className="py-3 px-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                          lab.status === 'BÌNH THƯỜNG' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-error-container/30 text-error border-error/20'
                                        }`}>
                                          {lab.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              </div>
            ))}
            
          </div>
          )}
        </div>

        {/* Right Column: Summary Widgets */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6 lg:mt-[52px]">
          
          {/* Vitals Summary Card */}
          <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low">
            <h3 className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              Tổng quan sức khỏe
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  </div>
                  <div>
                    <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Cân nặng</p>
                    <p className="font-body font-bold text-on-surface text-sm">65 kg</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/50 border border-rose-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </div>
                  <div>
                    <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Nhóm máu</p>
                    <p className="font-body font-bold text-on-surface text-sm">O+</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50/50 border border-orange-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <div>
                    <p className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Dị ứng</p>
                    <p className="font-body font-bold text-error text-sm">Penicillin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Support Banner */}
          <div className="bg-primary/5 rounded-[24px] p-6 text-center border border-primary/10">
            <div className="w-12 h-12 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center text-primary">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <h4 className="font-body font-bold text-sm text-on-surface mb-2">Cần hỗ trợ giải đáp bệnh án?</h4>
            <p className="font-body text-xs text-on-surface-variant mb-4">Các bác sĩ của chúng tôi luôn sẵn sàng hỗ trợ trực tuyến qua Telehealth.</p>
            <button className="w-full py-2.5 rounded-xl bg-primary text-white font-body font-bold text-sm shadow-md hover:shadow-lg transition-all">
              Đặt lịch Tư vấn ngay
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyMedicalRecordsPage;
