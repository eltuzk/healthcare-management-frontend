import React, { useState, useEffect } from 'react';
import * as permissionService from '../services/permissionService';
import { toast } from 'react-hot-toast';
import RoleFormModal from '../components/staff/RoleFormModal';

interface Role {
  roleId: number;
  roleName: string;
  description: string;
  userCount?: number;
}

interface Permission {
  permissionId: number;
  permissionName: string;
  detail: string;
  enabled?: boolean;
}

interface PermissionGroup {
  title: string;
  permissions: Permission[];
}

const StaffPermissionsPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [activeRoleId, setActiveRoleId] = useState<number | null>(null);
  const [allPermissions, setAllPermissionsList] = useState<Permission[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialPermissionIds, setInitialPermissionIds] = useState<Set<number>>(new Set());
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<Role | undefined>(undefined);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const [permSearchTerm, setPermSearchTerm] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        permissionService.getRoles(),
        permissionService.getPermissions()
      ]);
      console.log('Roles loaded:', rolesRes);
      console.log('Permissions loaded:', permsRes);
      
      const rolesArray = Array.isArray(rolesRes) ? rolesRes : [];
      const permsArray = Array.isArray(permsRes) ? permsRes : [];

      setRoles(rolesArray);
      setAllPermissionsList(permsArray);
      if (rolesArray.length > 0) {
        setActiveRoleId(rolesArray[0].roleId);
      }
    } catch (error) {
      toast.error('Không thể tải dữ liệu vai trò và quyền hạn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeRoleId) {
      fetchRolePermissions(activeRoleId);
    }
  }, [activeRoleId, allPermissions]);

  const fetchRolePermissions = async (roleId: number) => {
    try {
      const rolePerms = await permissionService.getPermissionsByRoleId(roleId);
      console.log(`Permissions for role ${roleId}:`, rolePerms);
      
      if (!Array.isArray(rolePerms)) {
        console.error('rolePerms is not an array:', rolePerms);
        throw new Error('Data format error: permissions list is not an array');
      }

      const rolePermIds = new Set(rolePerms.map((rp: any) => rp.permissionId));
      setInitialPermissionIds(rolePermIds);

      // Group and set enabled state
      groupPermissions(rolePermIds);
    } catch (error: any) {
      console.error('Error fetching role permissions:', error);
      toast.error('Không thể tải quyền của vai trò: ' + (error.message || 'Lỗi không xác định'));
    }
  };

  const groupPermissions = (rolePermIds: Set<number>) => {
    const groups: { [key: string]: Permission[] } = {};
    
    const filteredPerms = allPermissions.filter(perm => 
      perm.permissionName.toLowerCase().includes(permSearchTerm.toLowerCase()) ||
      (perm.detail && perm.detail.toLowerCase().includes(permSearchTerm.toLowerCase()))
    );

    filteredPerms.forEach(perm => {
      // Logic to group permissions: by prefix before first underscore
      let groupTitle = 'HỆ THỐNG';
      if (perm.permissionName.includes('_')) {
        const prefix = perm.permissionName.split('_')[0].toUpperCase();
        switch(prefix) {
          case 'STAFF': groupTitle = 'NHÂN SỰ'; break;
          case 'PATIENT': groupTitle = 'BỆNH NHÂN'; break;
          case 'APPT': groupTitle = 'LỊCH HẸN'; break;
          case 'PHARMACY': groupTitle = 'KHO THUỐC'; break;
          case 'BED': groupTitle = 'GIƯỜNG BỆNH'; break;
          case 'ROOM': groupTitle = 'PHÒNG BỆNH'; break;
          case 'LAB': groupTitle = 'XÉT NGHIỆM'; break;
          case 'BILL': groupTitle = 'THANH TOÁN'; break;
          default: groupTitle = prefix;
        }
      }

      if (!groups[groupTitle]) groups[groupTitle] = [];
      groups[groupTitle].push({
        ...perm,
        enabled: rolePermIds.has(perm.permissionId)
      });
    });

    const formattedGroups = Object.keys(groups).map(title => ({
      title,
      permissions: groups[title]
    }));

    setPermissionGroups(formattedGroups);
  };

  // Re-group when search term changes
  useEffect(() => {
    groupPermissions(initialPermissionIds);
  }, [permSearchTerm]);

  const togglePermission = (groupIndex: number, permIndex: number) => {
    const newGroups = [...permissionGroups];
    newGroups[groupIndex].permissions[permIndex].enabled = !newGroups[groupIndex].permissions[permIndex].enabled;
    setPermissionGroups(newGroups);
  };

  const setAllPermissionsInGroup = (value: boolean) => {
    const newGroups = permissionGroups.map(group => ({
      ...group,
      permissions: group.permissions.map(p => ({ ...p, enabled: value }))
    }));
    setPermissionGroups(newGroups);
  };

  const handleSave = async () => {
    if (!activeRoleId) return;
    setSaving(true);
    try {
      const currentPerms = permissionGroups.flatMap(g => g.permissions);
      const toAssign = currentPerms.filter(p => p.enabled && !initialPermissionIds.has(p.permissionId));
      const toRevoke = currentPerms.filter(p => !p.enabled && initialPermissionIds.has(p.permissionId));

      await Promise.all([
        ...toAssign.map(p => permissionService.assignPermissionToRole({ roleId: activeRoleId, permissionId: p.permissionId })),
        ...toRevoke.map(p => permissionService.revokePermissionFromRole({ roleId: activeRoleId, permissionId: p.permissionId }))
      ]);

      toast.success('Cập nhật quyền hạn thành công');
      fetchRolePermissions(activeRoleId);
    } catch (error) {
      toast.error('Lỗi khi lưu thay đổi');
    } finally {
      setSaving(false);
    }
  };

  const openCreateRoleModal = () => {
    setSelectedRoleForEdit(undefined);
    setIsRoleModalOpen(true);
  };

  const openEditRoleModal = (role: Role, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRoleForEdit(role);
    setIsRoleModalOpen(true);
  };

  const handleDeleteRole = async (roleId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Bạn có chắc chắn muốn xóa vai trò này? Tất cả người dùng thuộc vai trò này sẽ mất quyền truy cập.')) return;

    try {
      await permissionService.deleteRole(roleId);
      toast.success('Đã xóa vai trò thành công');
      fetchInitialData();
      if (activeRoleId === roleId) {
        setActiveRoleId(null);
      }
    } catch (error) {
      toast.error('Lỗi khi xóa vai trò');
    }
  };

  const filteredRoles = roles.filter(role => 
    role.roleName.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(roleSearchTerm.toLowerCase()))
  );

  return (
    <>
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
              value={roleSearchTerm}
              onChange={(e) => setRoleSearchTerm(e.target.value)}
              className="w-full bg-surface-container-lowest text-sm font-body px-4 py-3 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50 text-on-surface font-semibold shadow-ambient" 
            />
          </div>

          <div className="space-y-3">
            {loading ? (
               <div className="py-10 text-center text-on-surface-variant font-body text-sm">Đang tải...</div>
            ) : filteredRoles.map(role => (
              <div 
                key={role.roleId}
                onClick={() => setActiveRoleId(role.roleId)}
                className={`p-5 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                  activeRoleId === role.roleId 
                    ? 'bg-primary-container/10 border-primary shadow-sm' 
                    : 'bg-surface-container-lowest border-transparent hover:border-outline-variant shadow-ambient'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeRoleId === role.roleId ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className={`font-display font-bold text-sm ${activeRoleId === role.roleId ? 'text-primary' : 'text-on-surface'}`}>{role.roleName}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={(e) => openEditRoleModal(role, e)}
                      className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      onClick={(e) => handleDeleteRole(role.roleId, e)}
                      className="p-1.5 rounded-lg hover:bg-error-container/20 transition-colors text-error"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="font-body text-xs text-on-surface-variant mb-1">{role.description}</p>
              </div>
            ))}
          </div>
          
          <button 
            onClick={openCreateRoleModal}
            className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-outline-variant text-primary font-body text-sm font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Tạo vai trò mới
          </button>
        </div>

        {/* Right Column: Permissions Configuration */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-[24px] shadow-ambient flex flex-col h-[calc(100vh-160px)]">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-surface-container-low bg-white rounded-t-[24px] z-10 sticky top-0 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-display text-xl font-bold text-on-surface">Cấu hình Quyền hạn</h2>
                <p className="font-body text-xs text-on-surface-variant mt-1">Đang chỉnh sửa cho: <span className="font-bold text-primary">{roles.find(r => r.roleId === activeRoleId)?.roleName || 'Chọn một vai trò'}</span></p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setAllPermissionsInGroup(true)} className="px-4 py-2 bg-surface-container-low hover:bg-primary-container/20 text-primary font-body text-xs font-bold rounded-lg transition-colors">
                  Chọn tất cả
                </button>
                <button onClick={() => setAllPermissionsInGroup(false)} className="px-4 py-2 bg-surface-container-low hover:bg-error-container/20 text-error font-body text-xs font-bold rounded-lg transition-colors">
                  Bỏ chọn tất cả
                </button>
              </div>
            </div>
            {/* Permission Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input 
                type="text" 
                placeholder="Tìm kiếm quyền hạn (tên hoặc chi tiết)..." 
                value={permSearchTerm}
                onChange={(e) => setPermSearchTerm(e.target.value)}
                className="w-full bg-surface-container-low text-xs font-body px-4 py-2.5 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-on-surface-variant/50 text-on-surface" 
              />
            </div>
          </div>

          {/* Permissions List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-10">
            {permissionGroups.length === 0 ? (
               <div className="py-20 text-center text-on-surface-variant font-body">Không có quyền hạn nào được định nghĩa.</div>
            ) : permissionGroups.map((group, gIndex) => (
              <div key={gIndex}>
                <h3 className="font-body text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-6 border-b border-surface-container-low pb-2">
                  {group.title}
                </h3>
                <div className="space-y-4">
                  {group.permissions.map((perm, pIndex) => (
                    <div key={perm.permissionId} className="flex justify-between items-center py-2 group hover:bg-surface-container-low/30 px-3 -mx-3 rounded-xl transition-colors">
                      <div className="flex flex-col">
                        <span className="font-body text-sm font-semibold text-on-surface">{perm.detail || perm.permissionName}</span>
                        <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-tighter opacity-50">{perm.permissionName}</span>
                      </div>
                      
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
              <span className="font-body text-[11px] font-medium tracking-wide">Cập nhật quyền hạn theo thời gian thực</span>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={() => activeRoleId && fetchRolePermissions(activeRoleId)}
                disabled={saving}
                className="flex-1 md:flex-none px-6 py-3 rounded-xl font-body text-sm font-bold text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex-1 md:flex-none px-8 py-3 rounded-xl font-body text-sm font-bold bg-primary text-white shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 min-w-[140px] disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Đang lưu...
                  </>
                ) : 'Lưu thay đổi'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
      <RoleFormModal 
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onSuccess={fetchInitialData}
        roleData={selectedRoleForEdit}
      />
    </>
  );
};

export default StaffPermissionsPage;
