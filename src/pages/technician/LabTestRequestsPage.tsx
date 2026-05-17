import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

const mockRequests = [
  {
    id: '#XN-88291',
    patient: 'Trần Minh Tâm',
    gender: 'Nam',
    age: 45,
    doctor: 'BS. Lê Hoàng Long',
    department: 'NỘI TIẾT',
    tests: ['HbA1C', 'GLUCOSE', 'TỔNG PHÂN TÍCH MÁU'],
    time: '14:20 Hôm nay',
    status: 'Chờ tiếp nhận',
  },
  {
    id: '#XN-88290',
    patient: 'Nguyễn Thị Hoa',
    gender: 'Nữ',
    age: 32,
    doctor: 'BS. Trần Minh Tuấn',
    department: 'SẢN KHOA',
    tests: ['BETA hCG', 'SIÊU ÂM'],
    time: '13:45 Hôm nay',
    status: 'Đang thực hiện',
  },
  {
    id: '#XN-88289',
    patient: 'Lê Văn Khải',
    gender: 'Nam',
    age: 58,
    doctor: 'BS. Phạm Thu Thủy',
    department: 'TIM MẠCH',
    tests: ['CHOLESTEROL', 'TRIGLYCERIDE'],
    time: '10:15 Hôm nay',
    status: 'Hoàn thành',
  },
];

const LabTestRequestsPage: React.FC = () => {
  const [requests] = useState(mockRequests);
  const navigate = useNavigate();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Chờ tiếp nhận': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Đang thực hiện': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Hoàn thành': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-on-surface tracking-tight leading-tight">Danh sách Yêu cầu Xét nghiệm</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">Quản lý và tiếp nhận các chỉ định lâm sàng</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-surface-container-lowest rounded-[24px] p-6 shadow-ambient border border-surface-container-low flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Trạng thái</label>
          <select className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm font-bold text-on-surface focus:outline-none focus:border-primary appearance-none">
            <option>Tất cả trạng thái</option>
            <option>Chờ tiếp nhận</option>
            <option>Đang thực hiện</option>
            <option>Hoàn thành</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Loại xét nghiệm</label>
          <select className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm font-bold text-on-surface focus:outline-none focus:border-primary appearance-none">
            <option>Tất cả danh mục</option>
            <option>Huyết học</option>
            <option>Sinh hóa</option>
            <option>Miễn dịch</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Ngày chỉ định</label>
          <input type="date" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm font-bold text-on-surface focus:outline-none focus:border-primary" />
        </div>
        <button className="px-6 py-3 rounded-xl bg-primary text-white font-body font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Lọc kết quả
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient border border-surface-container-low overflow-hidden flex flex-col">
        {/* Table Header Controls */}
        <div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
          <h2 className="font-display font-bold text-lg text-on-surface">Danh sách yêu cầu (24)</h2>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <button className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low/50">
              <tr>
                <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Mã YC</th>
                <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Bệnh nhân</th>
                <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Bác sĩ chỉ định</th>
                <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Danh sách XN</th>
                <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Thời gian</th>
                <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low">Trạng thái</th>
                <th className="py-4 px-6 font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-surface-container-low text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {requests.map((req, idx) => (
                <tr key={idx} className="hover:bg-surface-container-lowest/80 transition-colors">
                  <td className="py-4 px-6">
                    <a href="#" className="font-body text-sm font-bold text-primary hover:underline">{req.id}</a>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-body text-sm font-bold text-on-surface">{req.patient}</p>
                    <p className="font-body text-xs text-on-surface-variant">{req.gender}, {req.age} tuổi</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-body text-sm font-bold text-on-surface">{req.doctor}</p>
                    <p className="font-body text-[10px] font-bold text-on-surface-variant mt-0.5">{req.department}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {req.tests.map((test, i) => (
                        <span key={i} className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase border border-primary/20">
                          {test}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-body text-sm font-medium text-on-surface-variant">{req.time}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {req.status === 'Chờ tiếp nhận' && (
                      <button className="px-4 py-1.5 rounded-lg bg-primary text-white font-body text-xs font-bold hover:bg-primary/90 transition-colors">
                        Tiếp nhận
                      </button>
                    )}
                    {req.status === 'Đang thực hiện' && (
                      <button 
                        onClick={() => navigate('/lab-results-entry')}
                        className="px-4 py-1.5 rounded-lg border border-primary text-primary font-body text-xs font-bold hover:bg-primary/5 transition-colors"
                      >
                        Chi tiết
                      </button>
                    )}
                    {req.status === 'Hoàn thành' && (
                      <span className="font-body text-xs font-bold text-on-surface-variant">
                        Đã xử lý
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-surface-container-low flex justify-between items-center bg-surface-container-lowest/50">
          <span className="font-body text-xs text-on-surface-variant font-medium">Hiển thị 1-10 trong số 24 yêu cầu</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-on-surface-variant disabled:opacity-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-body text-sm font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-on-surface font-body text-sm font-medium">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-on-surface font-body text-sm font-medium">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-on-surface-variant">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-sky-50 rounded-[24px] p-6 shadow-sm border border-sky-100 flex items-center justify-between">
          <div>
            <p className="font-body text-[10px] font-bold text-sky-600 uppercase tracking-widest mb-1">Đang chờ xử lý</p>
            <p className="font-display text-4xl font-bold text-sky-900">08</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-sky-200 flex items-center justify-center text-sky-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-[24px] p-6 shadow-sm border border-purple-100 flex items-center justify-between">
          <div>
            <p className="font-body text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1">Đang thực hiện</p>
            <p className="font-display text-4xl font-bold text-purple-900">12</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-purple-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-[24px] p-6 shadow-sm border border-emerald-100 flex items-center justify-between">
          <div>
            <p className="font-body text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Đã hoàn thành</p>
            <p className="font-display text-4xl font-bold text-emerald-900">42</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LabTestRequestsPage;
