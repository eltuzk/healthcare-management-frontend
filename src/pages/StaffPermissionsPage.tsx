import React, { useState } from 'react';

// Mock Data
const roles = [
  { id: 'admin', name: 'Quản trị viên (Admin)', desc: 'Toàn quyền kiểm soát hệ thống', users: 8, active: true },
  { id: 'doctor', name: 'Bác sĩ (Doctor)', desc: 'Quyền truy cập EMR, Lịch khám, Đơn thuốc', users: 42, active: false },
  { id: 'nurse', name: 'Điều dưỡng (Nurse)', desc: 'Quyền truy cập EMR cơ bản, Theo dõi sinh hiệu', users: 65, active: false },
  { id: 'reception', name: 'Lễ tân (Receptionist)', desc: 'Quản lý lịch hẹn, Tiếp nhận bệnh nhân', users: 15, active: false },
];

const permissionGroups = [
  {
    title: 'NHÂN SỰ',
    permissions: [
      { id: 'staff_view', label: 'Xem danh sách nhân sự', enabled: true },
      { id: 'staff_create', label: 'Thêm nhân viên mới', enabled: true },
      { id: 'staff_edit', label: 'Chỉnh sửa hồ sơ nhân sự', enabled: true },
      { id: 'staff_delete', label: 'Xóa hồ sơ nhân sự', enabled: false },
    ]
  },
  {
    title: 'BỆNH NHÂN',
    permissions: [
      { id: 'patient_view', label: 'Truy cập hồ sơ bệnh án (EMR)', enabled: true },
      { id: 'patient_edit', label: 'Chỉnh sửa hồ sơ bệnh án', enabled: true },
      { id: 'patient_delete', label: 'Xóa hồ sơ bệnh nhân', enabled: false },
    ]
  },
  {
    title: 'LỊCH HẸN & KHO THUỐC',
    permissions: [
      { id: 'appt_manage', label: 'Xếp lịch & Quản lý lịch hẹn bác sĩ', enabled: true },
      { id: 'pharmacy_view', label: 'Xem tồn kho dược phẩm', enabled: true },
      { id: 'pharmacy_edit', label: 'Kiểm kê & Nhập xuất kho dược', enabled: false },
    ]
  }
];

const StaffPermissionsPage: React.FC = () => {
  const [activeRole, setActiveRole] = useState(roles[0].id);
  const [permissions, setPermissions] = useState(permissionGroups);

  const togglePermission = (groupIndex: number, permIndex: number) => {
    const newPermissions = [...permissions];
    newPermissions[groupIndex].permissions[permIndex].enabled = !newPermissions[groupIndex].permissions[permIndex].enabled;
    setPermissions(newPermissions);
  };

  const setAllPermissions = (value: boolean) => {
    const newPermissions = permissions.map(group => ({
      ...group,
      permissions: group.permissions.map(p => ({ ...p, enabled: value }))
    }));
    setPermissions(newPermissions);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-on-surface tracking-tight leading-tight">Vai trò & Quyền hạn</h1>
          <p className="font-body text-sm text-on-surface-variant mt-2">Phân quyền chi tiết cho từng nhóm vai trò trong hệ thống</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Roles List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search bar inside roles list */}
          <div className="relative mb-6">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input 
              type="text" 
              placeholder="Tìm kiếm vai trò..." 
              className="w-full bg-surface-container-lowest text-sm font-body px-4 py-3 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50 text-on-surface font-semibold shadow-ambient" 
            />
          </div>

          <div className="space-y-3">
            {roles.map(role => (
              <div 
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                  activeRole === role.id 
                    ? 'bg-primary-container/10 border-primary shadow-sm' 
                    : 'bg-surface-container-lowest border-transparent hover:border-outline-variant shadow-ambient'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeRole === role.id ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className={`font-display font-bold text-sm ${activeRole === role.id ? 'text-primary' : 'text-on-surface'}`}>{role.name}</h3>
                  </div>
                </div>
                <p className="font-body text-xs text-on-surface-variant mb-4">{role.desc}</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary/40"></span>
                  <span className="font-body text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{role.users} Người dùng</span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-outline-variant text-primary font-body text-sm font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Tạo vai trò mới
          </button>
        </div>

        {/* Right Column: Permissions Configuration */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-[24px] shadow-ambient flex flex-col h-[calc(100vh-160px)]">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-surface-container-low flex justify-between items-center bg-white rounded-t-[24px] z-10 sticky top-0">
            <div>
              <h2 className="font-display text-xl font-bold text-on-surface">Cấu hình Quyền hạn</h2>
              <p className="font-body text-xs text-on-surface-variant mt-1">Đang chỉnh sửa cho: <span className="font-bold text-primary">{roles.find(r => r.id === activeRole)?.name}</span></p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setAllPermissions(true)} className="px-4 py-2 bg-surface-container-low hover:bg-primary-container/20 text-primary font-body text-xs font-bold rounded-lg transition-colors">
                Chọn tất cả
              </button>
              <button onClick={() => setAllPermissions(false)} className="px-4 py-2 bg-surface-container-low hover:bg-error-container/20 text-error font-body text-xs font-bold rounded-lg transition-colors">
                Bỏ chọn tất cả
              </button>
            </div>
          </div>

          {/* Permissions List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-10">
            {permissions.map((group, gIndex) => (
              <div key={gIndex}>
                <h3 className="font-body text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-6 border-b border-surface-container-low pb-2">
                  {group.title}
                </h3>
                <div className="space-y-4">
                  {group.permissions.map((perm, pIndex) => (
                    <div key={perm.id} className="flex justify-between items-center py-2 group hover:bg-surface-container-low/30 px-3 -mx-3 rounded-xl transition-colors">
                      <span className="font-body text-sm font-semibold text-on-surface">{perm.label}</span>
                      
                      {/* Toggle Switch */}
                      <button 
                        onClick={() => togglePermission(gIndex, pIndex)}
                        className={`w-11 h-6 rounded-full relative transition-colors duration-200 focus:outline-none ${perm.enabled ? 'bg-primary' : 'bg-surface-container-highest'}`}
                      >
                        <span 
                          className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm ${perm.enabled ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 md:p-8 border-t border-surface-container-low bg-surface-container-lowest rounded-b-[24px] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="font-body text-[11px] font-medium tracking-wide">Lần cuối bởi Admin lúc 14:20 - 24/05/2024</span>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-3 rounded-xl font-body text-sm font-bold text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors">
                Hủy bỏ
              </button>
              <button className="flex-1 md:flex-none px-8 py-3 rounded-xl font-body text-sm font-bold bg-primary text-white shadow-sm hover:opacity-90 transition-opacity">
                Lưu thay đổi
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StaffPermissionsPage;
