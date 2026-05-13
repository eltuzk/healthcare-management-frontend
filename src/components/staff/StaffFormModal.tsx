import React, { useState, useEffect } from 'react';
import { getRoles } from '../../services/staffService';
import { createAccount, updateAccount } from '../../services/accountService';
import { toast } from 'react-hot-toast';

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  staffData?: any; 
}

const StaffFormModal: React.FC<StaffFormModalProps> = ({ isOpen, onClose, onSuccess, staffData }) => {
  const [roles, setRoles] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    roleId: '',
    isActive: 1
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && staffData) {
      setFormData({
        email: staffData.email || '',
        password: '',
        fullName: staffData.fullName || '',
        roleId: staffData.role?.roleId || staffData.roleId || '',
        isActive: staffData.isActive !== undefined ? staffData.isActive : 1
      });
    } else if (isOpen) {
      setFormData({
        email: '',
        password: '',
        fullName: '',
        roleId: roles.length > 0 ? roles[0].roleId : '',
        isActive: 1
      });
    }
  }, [isOpen, staffData, roles]);

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      const filteredRoles = res.filter((r: any) => r.roleName !== 'PATIENT');
      setRoles(filteredRoles);
      if (!formData.roleId && filteredRoles.length > 0 && !staffData) {
        setFormData(prev => ({ ...prev, roleId: filteredRoles[0].roleId }));
      }
    } catch (error) {
      toast.error('Không thể tải danh sách vai trò');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleActive = () => {
    setFormData(prev => ({ ...prev, isActive: prev.isActive === 1 ? 0 : 1 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (staffData) {
        // Prepare data for update (optionally omit password if empty)
        const updateData = { ...formData };
        if (!updateData.password) {
          delete (updateData as any).password;
        }
        await updateAccount(staffData.accountId, updateData);
      } else {
        await createAccount(formData);
      }
      toast.success(staffData ? 'Cập nhật thành công' : 'Thêm nhân sự thành công');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-surface-container-highest/60 backdrop-blur-md transition-opacity animate-fade-in" onClick={onClose}></div>

      <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-[32px] shadow-ambient border border-outline-variant/20 overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        <div className="flex justify-between items-center p-8 border-b border-outline-variant/10">
          <div>
            <h2 className="font-display text-2xl font-bold text-on-surface">
              {staffData ? 'Cập nhật nhân sự' : 'Thêm nhân sự mới'}
            </h2>
            <p className="font-body text-xs text-on-surface-variant mt-1 font-medium uppercase tracking-widest">Thông tin tài khoản hệ thống</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl text-on-surface-variant hover:bg-error/10 hover:text-error transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant ml-1">Họ và tên nhân viên</label>
              <div className="relative">
                <input 
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Ví dụ: Nguyễn Văn An" 
                  className="w-full bg-surface-container-low/50 border border-outline-variant/20 text-sm font-body px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all text-on-surface font-semibold placeholder:text-on-surface-variant/40" 
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant ml-1">Địa chỉ Email</label>
              <input 
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@curator.com" 
                className="w-full bg-surface-container-low/50 border border-outline-variant/20 text-sm font-body px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all text-on-surface font-semibold placeholder:text-on-surface-variant/40" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant ml-1">Mật khẩu</label>
                <input 
                  required={!staffData}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={staffData ? "Để trống nếu không đổi" : "••••••••"} 
                  className="w-full bg-surface-container-low/50 border border-outline-variant/20 text-sm font-body px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all text-on-surface font-semibold placeholder:text-on-surface-variant/40" 
                />
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant ml-1">Vai trò hệ thống</label>
                <div className="relative">
                  <select 
                    name="roleId"
                    value={formData.roleId}
                    onChange={handleChange}
                    className="w-full bg-surface-container-low/50 border border-outline-variant/20 text-sm font-body font-semibold px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all text-on-surface appearance-none cursor-pointer"
                  >
                    {roles.map(role => (
                      <option key={role.roleId} value={role.roleId}>{role.description || role.roleName}</option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            {staffData && (
              <div className="flex items-center justify-between p-5 rounded-2xl bg-surface-container-low/30 border border-outline-variant/10">
                <div>
                  <p className="font-body text-sm font-bold text-on-surface">Trạng thái tài khoản</p>
                  <p className="font-body text-[10px] text-on-surface-variant font-medium uppercase tracking-wider mt-0.5">Cho phép truy cập hệ thống</p>
                </div>
                <button 
                  type="button"
                  onClick={handleToggleActive}
                  className={`relative w-14 h-8 rounded-full transition-all duration-300 ${formData.isActive === 1 ? 'bg-emerald-500' : 'bg-outline-variant/40'}`}
                >
                  <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all duration-300 ${formData.isActive === 1 ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            )}
          </div>

          <div className="pt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-8 py-4 rounded-2xl font-body text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all">
              Hủy bỏ
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-10 py-4 rounded-2xl font-body text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Đang lưu...
                </div>
              ) : (staffData ? 'Cập nhật ngay' : 'Lưu nhân sự')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffFormModal;
