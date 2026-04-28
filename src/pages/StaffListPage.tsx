import React, { useState } from 'react';
import StaffFormModal from '../components/staff/StaffFormModal';

// Mock Data
const mockStaffList = [
  { id: 'CC-2024-001', name: 'Bs. Nguyễn Văn An', email: 'an.nguyen@clinic.com', role: 'Bác sĩ', branch: 'Quận 1', status: 'Hoạt động', avatar: 'NA' },
  { id: 'CC-2024-002', name: 'Bs. Phạm Minh Tuấn', email: 'tuan.pham@clinic.com', role: 'Bác sĩ', branch: 'Quận 7', status: 'Hoạt động', avatar: 'PT' },
  { id: 'CC-2024-005', name: 'Trần Thị Bích Ngọc', email: 'ngoc.tran@clinic.com', role: 'Lễ tân', branch: 'Bình Thạnh', status: 'Hoạt động', avatar: 'TN' },
  { id: 'CC-2024-012', name: 'Lê Hoàng Nam', email: 'nam.le@clinic.com', role: 'Dược sĩ', branch: 'Toàn hệ thống', status: 'Ngừng', avatar: 'LN' },
  { id: 'CC-2024-018', name: 'Vũ Đăng Khoa', email: 'khoa.vu@clinic.com', role: 'Kỹ thuật viên', branch: 'Quận 1', status: 'Hoạt động', avatar: 'VK' },
];

const StaffListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null); // State for editing

  const openAddModal = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const openEditModal = (staff: any) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-on-surface tracking-tight leading-tight">Quản lý Nhân sự</h1>
          <p className="font-body text-sm text-on-surface-variant mt-2">Quản lý và điều phối danh sách nhân viên y tế toàn hệ thống</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-primary text-white font-body font-bold text-sm px-6 py-3 rounded-xl shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Thêm nhân sự
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Tìm kiếm tên</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Tên hoặc mã NV..." className="w-full bg-surface-container-low text-sm font-body px-4 py-3 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50 text-on-surface font-semibold" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Vai trò</label>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="w-full bg-surface-container-low text-sm font-body font-semibold px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface appearance-none cursor-pointer">
              <option value="">Tất cả vai trò</option>
              <option value="Bác sĩ">Bác sĩ</option>
              <option value="Lễ tân">Lễ tân</option>
              <option value="Dược sĩ">Dược sĩ</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Chi nhánh</label>
            <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className="w-full bg-surface-container-low text-sm font-body font-semibold px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface appearance-none cursor-pointer">
              <option value="">Toàn hệ thống</option>
              <option value="Quận 1">Quận 1</option>
              <option value="Quận 7">Quận 7</option>
              <option value="Bình Thạnh">Bình Thạnh</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Trạng thái</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-surface-container-low text-sm font-body font-semibold px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface appearance-none cursor-pointer">
              <option value="">Tất cả trạng thái</option>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Ngừng">Ngừng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-surface-container-lowest rounded-[24px] shadow-ambient overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-surface-container-low">
                <th className="py-5 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest w-[30%]">Nhân viên</th>
                <th className="py-5 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Email liên hệ</th>
                <th className="py-5 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Vai trò</th>
                <th className="py-5 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Chi nhánh</th>
                <th className="py-5 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Trạng thái</th>
                <th className="py-5 px-6 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low/50">
              {mockStaffList.map((staff) => (
                <tr key={staff.id} className="group hover:bg-surface-container-low/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {staff.avatar}
                      </div>
                      <div>
                        <p className="font-body text-sm font-bold text-on-surface">{staff.name}</p>
                        <p className="font-body text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">{staff.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-body text-sm font-medium text-on-surface-variant">{staff.email}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      staff.role === 'Bác sĩ' ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'
                    }`}>
                      {staff.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-body text-sm font-medium text-on-surface-variant">{staff.branch}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${staff.status === 'Hoạt động' ? 'bg-emerald-500' : 'bg-error'}`}></span>
                      <span className="font-body text-[11px] font-bold text-on-surface">{staff.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => openEditModal(staff)}
                      title="Sửa nhân sự"
                      className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="py-4 px-6 border-t border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
          <p className="font-body text-xs font-semibold text-on-surface-variant">Hiển thị 1 - 5 trong số 48 nhân viên</p>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-lg border border-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">1</button>
            <button className="w-8 h-8 rounded-lg border border-surface-container-low flex items-center justify-center text-on-surface-variant text-xs font-bold hover:bg-surface-container-low transition-colors">2</button>
            <button className="w-8 h-8 rounded-lg border border-surface-container-low flex items-center justify-center text-on-surface-variant text-xs font-bold hover:bg-surface-container-low transition-colors">3</button>
            <button className="w-8 h-8 rounded-lg border border-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Staff Form Modal */}
      <StaffFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        staffData={selectedStaff}
      />
    </div>
  );
};

export default StaffListPage;
