import React, { useState, useEffect } from 'react';
import * as permissionService from '../../services/permissionService';
import * as accountService from '../../services/accountService';
import { updateAccount } from '../../services/accountService';
import { toast } from 'react-hot-toast';

interface AccountRBACModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  account: any;
}

const AccountRBACModal: React.FC<AccountRBACModalProps> = ({ isOpen, onClose, onSuccess, account }) => {
  const [roles, setRoles] = useState<any[]>([]);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | string>('');
  const [accountPermissions, setAccountPermissions] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && account) {
      fetchData();
    }
  }, [isOpen, account]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes, accPermsRes] = await Promise.all([
        permissionService.getRoles(),
        permissionService.getPermissions(),
        accountService.getAccountPermissionsByAccountId(account.accountId)
      ]);

      setRoles(rolesRes);
      setAllPermissions(permsRes);
      setSelectedRoleId(account.role?.roleId || account.roleId || '');
      
      const accPermIds = new Set(accPermsRes.map((p: any) => p.permissionId));
      setAccountPermissions(accPermIds);
    } catch (error) {
      toast.error('Không thể tải dữ liệu phân quyền');
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permissionId: number) => {
    const newPerms = new Set(accountPermissions);
    if (newPerms.has(permissionId)) {
      newPerms.delete(permissionId);
    } else {
      newPerms.add(permissionId);
    }
    setAccountPermissions(newPerms);
  };

  const handleSave = async () => {
    if (!account) return;
    setSaving(true);
    try {
      // 1. Update Role
      const updateData = {
        email: account.email,
        roleId: selectedRoleId,
        fullName: account.fullName
      };
      await updateAccount(account.accountId, updateData);

      // 2. Update Direct Permissions (Diffing)
      const currentPermsRes = await accountService.getAccountPermissionsByAccountId(account.accountId);
      const initialPermIds = new Set(currentPermsRes.map((p: any) => p.permissionId));
      
      const toAssign = Array.from(accountPermissions).filter(id => !initialPermIds.has(id));
      const toRevoke = Array.from(initialPermIds).filter(id => !accountPermissions.has(id));

      await Promise.all([
        ...toAssign.map(id => accountService.createAccountPermission({ accountId: account.accountId, permissionId: id })),
        ...toRevoke.map(id => accountService.deleteAccountPermission({ accountId: account.accountId, permissionId: id }))
      ]);

      toast.success('Cập nhật phân quyền nhân sự thành công');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Lỗi khi lưu thay đổi');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        <div className="p-8 border-b border-outline-variant/20 flex justify-between items-center bg-white">
          <div>
            <h2 className="font-display text-2xl font-bold text-on-surface">Phân quyền Nhân sự</h2>
            <p className="font-body text-sm text-on-surface-variant mt-1">Chỉnh sửa vai trò và quyền hạn trực tiếp cho <span className="font-bold text-primary">{account?.fullName}</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-error/10 hover:text-error transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-surface-container-lowest">
          {loading ? (
            <div className="py-20 text-center text-on-surface-variant">Đang tải dữ liệu...</div>
          ) : (
            <>
              {/* Role Selection */}
              <div className="space-y-4">
                <h3 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                  Vai trò chính
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map(role => (
                    <div 
                      key={role.roleId}
                      onClick={() => setSelectedRoleId(role.roleId)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        selectedRoleId === role.roleId 
                          ? 'border-primary bg-primary/5' 
                          : 'border-outline-variant/20 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRoleId === role.roleId ? 'border-primary' : 'border-outline-variant'}`}>
                          {selectedRoleId === role.roleId && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                        </div>
                        <div>
                          <p className="font-body text-sm font-bold text-on-surface">{role.roleName}</p>
                          <p className="font-body text-xs text-on-surface-variant line-clamp-1">{role.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Permissions */}
              <div className="space-y-4 pt-4">
                <h3 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
                  Quyền hạn trực tiếp (Bổ sung)
                </h3>
                <p className="font-body text-xs text-on-surface-variant">Những quyền này được cấp riêng cho nhân sự này, ngoài các quyền đã có từ vai trò chính.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {allPermissions.map(perm => (
                    <label key={perm.permissionId} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors group">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox"
                          checked={accountPermissions.has(perm.permissionId)}
                          onChange={() => togglePermission(perm.permissionId)}
                          className="w-5 h-5 rounded-md border-2 border-outline-variant text-primary focus:ring-primary/20 transition-all cursor-pointer"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-body text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{perm.detail || perm.permissionName}</span>
                        <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-wider">{perm.permissionName}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-8 border-t border-outline-variant/20 bg-white flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 rounded-2xl font-body text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">
            Hủy bỏ
          </button>
          <button 
            onClick={handleSave}
            disabled={saving || loading}
            className="px-10 py-3 rounded-2xl font-body text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 min-w-[160px]"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Đang lưu...
              </div>
            ) : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountRBACModal;
