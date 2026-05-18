import React, { useState, useEffect } from 'react';
import * as permissionService from '../../services/permissionService';
import * as accountService from '../../services/accountService';
import { toast } from 'react-hot-toast';
import RoleFormModal from '../../components/staff/RoleFormModal';
import PermissionFormModal from '../../components/staff/PermissionFormModal';
import AccountRBACModal from '../../components/staff/AccountRBACModal';

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
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'staff'>('roles');
  
  // Roles Tab State
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

  // Permissions Tab State
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [selectedPermForEdit, setSelectedPermForEdit] = useState<Permission | undefined>(undefined);
  const [globalPermSearch, setGlobalPermSearch] = useState('');

  // Staff Tab State
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [staffSearchTerm, setStaffSearchTerm] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes, accountsRes] = await Promise.all([
        permissionService.getRoles(),
        permissionService.getPermissions(),
        accountService.getAccounts(0, 100)
      ]);
      
      const rolesArray = Array.isArray(rolesRes) ? rolesRes : [];
      const permsArray = Array.isArray(permsRes) ? permsRes : [];
      const accountsArray = accountsRes.content || [];

      setRoles(rolesArray);
      setAllPermissionsList(permsArray);
      setAccounts(accountsArray.filter((a: any) => a.roleName !== 'PATIENT'));
      
      if (rolesArray.length > 0 && !activeRoleId) {
        setActiveRoleId(rolesArray[0].roleId);
      }
    } catch (error) {
      toast.error('Không thể tải dữ liệu hệ thống');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeRoleId && activeTab === 'roles') {
      fetchRolePermissions(activeRoleId);
    }
  }, [activeRoleId, allPermissions, activeTab]);

  const fetchRolePermissions = async (roleId: number) => {
    try {
      const rolePerms = await permissionService.getPermissionsByRoleId(roleId);
      if (!Array.isArray(rolePerms)) throw new Error('Data format error');
      const rolePermIds = new Set(rolePerms.map((rp: any) => rp.permissionId));
      setInitialPermissionIds(rolePermIds);
      groupPermissions(rolePermIds);
    } catch (error: any) {
      toast.error('Không thể tải quyền của vai trò');
    }
  };

  const groupPermissions = (rolePermIds: Set<number>) => {
    const groups: { [key: string]: Permission[] } = {};
    const filteredPerms = allPermissions.filter(perm => 
      perm.permissionName.toLowerCase().includes(permSearchTerm.toLowerCase()) ||
      (perm.detail && perm.detail.toLowerCase().includes(permSearchTerm.toLowerCase()))
    );

    filteredPerms.forEach(perm => {
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
      groups[groupTitle].push({ ...perm, enabled: rolePermIds.has(perm.permissionId) });
    });

    setPermissionGroups(Object.keys(groups).map(title => ({ title, permissions: groups[title] })));
  };

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

  const handleSaveRolePermissions = async () => {
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

  // Helper functions for UI
  const openCreateRole = () => { setSelectedRoleForEdit(undefined); setIsRoleModalOpen(true); };
  const openEditRole = (role: Role, e: React.MouseEvent) => { e.stopPropagation(); setSelectedRoleForEdit(role); setIsRoleModalOpen(true); };
  const openCreatePerm = () => { setSelectedPermForEdit(undefined); setIsPermModalOpen(true); };
  const openEditPerm = (perm: Permission) => { setSelectedPermForEdit(perm); setIsPermModalOpen(true); };
  const openAccountRBAC = (acc: any) => { setSelectedAccount(acc); setIsAccountModalOpen(true); };

  const handleDeleteRole = async (roleId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Xóa vai trò này?')) return;
    try {
      await permissionService.deleteRole(roleId);
      toast.success('Đã xóa');
      fetchInitialData();
    } catch (error) { toast.error('Lỗi khi xóa'); }
  };

  const handleDeletePerm = async (permId: number) => {
    if (!window.confirm('Xóa quyền hạn này?')) return;
    try {
      await permissionService.deletePermission(permId);
      toast.success('Đã xóa');
      fetchInitialData();
    } catch (error) { toast.error('Lỗi khi xóa'); }
  };

  const filteredRoles = roles.filter(r => r.roleName.toLowerCase().includes(roleSearchTerm.toLowerCase()));
  const filteredAllPerms = allPermissions.filter(p => 
    p.permissionName.toLowerCase().includes(globalPermSearch.toLowerCase()) ||
    p.detail?.toLowerCase().includes(globalPermSearch.toLowerCase())
  );
  const filteredStaff = accounts.filter(a => a.fullName.toLowerCase().includes(staffSearchTerm.toLowerCase()) || a.email.toLowerCase().includes(staffSearchTerm.toLowerCase()));

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-[2.5rem] font-black text-on-surface tracking-tight leading-tight">Quản lý Phân quyền</h1>
          <p className="font-body text-sm text-on-surface-variant mt-2 max-w-2xl">Hệ thống quản lý Role-Based Access Control (RBAC) tập trung cho toàn bộ nền tảng.</p>
        </div>

        <div className="flex p-1.5 bg-surface-container-low rounded-2xl w-fit border border-outline-variant/10 shadow-inner">
          <button onClick={() => setActiveTab('roles')} className={`px-6 py-2.5 rounded-xl font-body text-sm font-bold transition-all ${activeTab === 'roles' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Vai trò & Quyền</button>
          <button onClick={() => setActiveTab('permissions')} className={`px-6 py-2.5 rounded-xl font-body text-sm font-bold transition-all ${activeTab === 'permissions' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Danh mục Quyền</button>
          <button onClick={() => setActiveTab('staff')} className={`px-6 py-2.5 rounded-xl font-body text-sm font-bold transition-all ${activeTab === 'staff' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Phân quyền Nhân sự</button>
        </div>
      </div>

      {/* Tabs Content */}
      <div className="transition-all duration-300">
        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
            {/* Roles List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="relative">
                <input type="text" placeholder="Tìm kiếm vai trò..." value={roleSearchTerm} onChange={(e) => setRoleSearchTerm(e.target.value)} className="w-full bg-surface-container-lowest text-sm font-body px-4 py-3 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 shadow-ambient" />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></span>
              </div>
              <div className="space-y-3">
                {filteredRoles.map(role => (
                  <div key={role.roleId} onClick={() => setActiveRoleId(role.roleId)} className={`p-5 rounded-2xl cursor-pointer transition-all border-2 ${activeRoleId === role.roleId ? 'bg-primary/5 border-primary shadow-sm' : 'bg-surface-container-lowest border-transparent hover:border-outline-variant shadow-ambient'}`}>
                    <div className="flex justify-between items-center">
                      <h3 className={`font-display font-bold text-sm ${activeRoleId === role.roleId ? 'text-primary' : 'text-on-surface'}`}>{role.roleName}</h3>
                      <div className="flex gap-1">
                        <button onClick={(e) => openEditRole(role, e)} className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                        <button onClick={(e) => handleDeleteRole(role.roleId, e)} className="p-1.5 rounded-lg hover:bg-error/10 text-error"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                    <p className="font-body text-xs text-on-surface-variant mt-1 line-clamp-1">{role.description}</p>
                  </div>
                ))}
                <button onClick={openCreateRole} className="w-full py-4 rounded-2xl border-2 border-dashed border-outline-variant text-primary font-bold text-sm hover:bg-surface-container-low transition-all">+ Tạo vai trò mới</button>
              </div>
            </div>
            {/* Role-Permissions Mapping */}
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-[32px] shadow-ambient flex flex-col h-[700px] overflow-hidden">
               <div className="p-8 border-b border-surface-container-low flex justify-between items-center">
                  <div>
                    <h2 className="font-display text-xl font-bold text-on-surface">Cấu hình Quyền hạn</h2>
                    <p className="font-body text-xs text-on-surface-variant mt-1">Đang chỉnh sửa cho: <span className="font-bold text-primary">{roles.find(r => r.roleId === activeRoleId)?.roleName}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setAllPermissionsInGroup(true)} className="px-4 py-2 bg-surface-container-low text-primary text-xs font-bold rounded-xl">Chọn tất cả</button>
                    <button onClick={() => setAllPermissionsInGroup(false)} className="px-4 py-2 bg-surface-container-low text-error text-xs font-bold rounded-xl">Bỏ chọn</button>
                  </div>
               </div>
               <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                  {permissionGroups.length > 0 ? permissionGroups.map((group, gIdx) => (
                    <div key={gIdx}>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50 mb-4">{group.title}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {group.permissions.map((perm, pIdx) => (
                          <div key={perm.permissionId} onClick={() => togglePermission(gIdx, pIdx)} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors group">
                            <div>
                              <p className="font-body text-sm font-semibold text-on-surface">{perm.detail || perm.permissionName}</p>
                              <p className="text-[9px] uppercase tracking-tighter text-on-surface-variant">{perm.permissionName}</p>
                            </div>
                            <button className={`w-10 h-5 rounded-full relative transition-all ${perm.enabled ? 'bg-primary' : 'bg-outline-variant/30'}`}>
                              <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all ${perm.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )) : <div className="text-center py-20 text-on-surface-variant">Chọn một vai trò để xem quyền hạn.</div>}
               </div>
               <div className="p-8 border-t border-surface-container-low flex justify-end gap-4">
                  <button onClick={handleSaveRolePermissions} disabled={saving} className="px-10 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50">{saving ? 'Đang lưu...' : 'Lưu cấu hình'}</button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="bg-surface-container-lowest rounded-[32px] shadow-ambient overflow-hidden animate-slide-up">
            <div className="p-8 border-b border-surface-container-low flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-96">
                <input type="text" placeholder="Tìm kiếm quyền hạn..." value={globalPermSearch} onChange={(e) => setGlobalPermSearch(e.target.value)} className="w-full bg-surface-container-low text-sm font-body px-4 py-3 pl-10 rounded-xl outline-none" />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></span>
              </div>
              <button onClick={openCreatePerm} className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20">+ Thêm quyền hạn</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/40">
                    <th className="py-5 px-8 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Tên hệ thống</th>
                    <th className="py-5 px-8 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Chi tiết / Mô tả</th>
                    <th className="py-5 px-8 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filteredAllPerms.map(perm => (
                    <tr key={perm.permissionId} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="py-4 px-8 font-mono text-xs font-bold text-primary">{perm.permissionName}</td>
                      <td className="py-4 px-8 font-body text-sm text-on-surface">{perm.detail}</td>
                      <td className="py-4 px-8 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEditPerm(perm)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                          <button onClick={() => handleDeletePerm(perm.permissionId)} className="p-2 rounded-lg hover:bg-error/10 text-error transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
            <div className="col-span-full mb-4">
              <div className="relative max-w-md">
                <input type="text" placeholder="Tìm kiếm nhân sự..." value={staffSearchTerm} onChange={(e) => setStaffSearchTerm(e.target.value)} className="w-full bg-surface-container-lowest text-sm font-body px-4 py-4 pl-12 rounded-[20px] outline-none shadow-ambient" />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></span>
              </div>
            </div>
            {filteredStaff.map(staff => (
              <div key={staff.accountId} className="bg-surface-container-lowest p-6 rounded-[28px] shadow-ambient border border-transparent hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">{staff.fullName?.charAt(0) || 'U'}</div>
                  <div>
                    <h4 className="font-display font-bold text-on-surface group-hover:text-primary transition-colors">{staff.fullName}</h4>
                    <p className="font-body text-xs text-on-surface-variant">{staff.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                   <span className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">{staff.roleName?.replace('ROLE_', '')}</span>
                </div>
                <button onClick={() => openAccountRBAC(staff)} className="w-full py-3 rounded-xl bg-surface-container-low text-on-surface font-bold text-sm hover:bg-primary hover:text-white transition-all">Quản lý Phân quyền</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <RoleFormModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} onSuccess={fetchInitialData} roleData={selectedRoleForEdit} />
      <PermissionFormModal isOpen={isPermModalOpen} onClose={() => setIsPermModalOpen(false)} onSuccess={fetchInitialData} permissionData={selectedPermForEdit} />
      <AccountRBACModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} onSuccess={fetchInitialData} account={selectedAccount} />
    </div>
  );
};

export default StaffPermissionsPage;
