import React, { useState, useEffect } from 'react';
import * as permissionService from '../../services/permissionService';
import { toast } from 'react-hot-toast';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  roleData?: any;
}

const RoleFormModal: React.FC<RoleFormModalProps> = ({ isOpen, onClose, onSuccess, roleData }) => {
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (roleData) {
      setRoleName(roleData.roleName || '');
      setDescription(roleData.description || '');
    } else {
      setRoleName('');
      setDescription('');
    }
  }, [roleData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (roleData) {
        await permissionService.updateRole(roleData.roleId, { roleName, description });
        toast.success('Cập nhật vai trò thành công');
      } else {
        await permissionService.createRole({ roleName, description });
        toast.success('Tạo vai trò mới thành công');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
          <h2 className="font-display text-xl font-bold text-on-surface">
            {roleData ? 'Chỉnh sửa vai trò' : 'Tạo vai trò mới'}
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tên vai trò</label>
            <input 
              type="text" 
              required
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="VD: ROLE_DOCTOR"
              className="w-full bg-surface-container-low text-sm font-body px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider">Mô tả</label>
            <textarea 
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả chức năng của vai trò này..."
              className="w-full bg-surface-container-low text-sm font-body px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-body text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-body text-sm font-bold bg-primary text-white shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (roleData ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleFormModal;
