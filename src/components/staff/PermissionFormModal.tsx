import React, { useState, useEffect } from 'react';
import * as permissionService from '../../services/permissionService';
import { toast } from 'react-hot-toast';

interface PermissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  permissionData?: any;
}

const PermissionFormModal: React.FC<PermissionFormModalProps> = ({ isOpen, onClose, onSuccess, permissionData }) => {
  const [permissionName, setPermissionName] = useState('');
  const [detail, setDetail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (permissionData) {
      setPermissionName(permissionData.permissionName || '');
      setDetail(permissionData.detail || '');
    } else {
      setPermissionName('');
      setDetail('');
    }
  }, [permissionData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (permissionData) {
        await permissionService.updatePermission(permissionData.permissionId, { permissionName, detail });
        toast.success('Cập nhật quyền hạn thành công');
      } else {
        await permissionService.createPermission({ permissionName, detail });
        toast.success('Tạo quyền hạn mới thành công');
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
            {permissionData ? 'Chỉnh sửa quyền hạn' : 'Tạo quyền hạn mới'}
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tên quyền hạn (System Name)</label>
            <input 
              type="text" 
              required
              value={permissionName}
              onChange={(e) => setPermissionName(e.target.value)}
              placeholder="VD: STAFF_READ"
              className="w-full bg-surface-container-low text-sm font-body px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-body text-xs font-bold text-on-surface-variant uppercase tracking-wider">Chi tiết / Mô tả (Display Name)</label>
            <textarea 
              rows={3}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Mô tả chức năng của quyền hạn này..."
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
              ) : (permissionData ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionFormModal;
