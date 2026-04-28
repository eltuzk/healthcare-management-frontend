import React, { useState } from 'react';

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffData?: any; // Mock data type
}

const StaffFormModal: React.FC<StaffFormModalProps> = ({ isOpen, onClose, staffData }) => {
  const [role, setRole] = useState('Bác sĩ');
  const [gender, setGender] = useState('Nam');

  // Auto-set role if editing
  React.useEffect(() => {
    if (staffData && staffData.role) {
      setRole(staffData.role);
    } else {
      setRole('Bác sĩ');
    }
  }, [staffData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-surface-container-highest/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-surface-container-low">
          <h2 className="font-display text-xl font-bold text-on-surface">
            {staffData ? 'Cập nhật nhân sự' : 'Thêm nhân sự mới'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-error transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center relative group cursor-pointer border-2 border-dashed border-outline-variant hover:border-primary transition-colors">
              <svg className="w-8 h-8 text-on-surface-variant group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div className="absolute inset-0 rounded-full bg-surface-container-highest/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <p className="font-body text-sm font-bold text-primary mt-3 cursor-pointer hover:underline">Tải ảnh lên</p>
            <p className="font-body text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">PNG, JPG. Tối đa 2MB</p>
          </div>

          <form className="space-y-6">
            {/* Personal Info */}
            <div className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Họ và tên</label>
                <input 
                  type="text" 
                  defaultValue={staffData?.name || ''}
                  placeholder="Nguyễn Văn A" 
                  className="w-full bg-surface-container-low text-sm font-body px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-semibold placeholder:font-medium placeholder:text-on-surface-variant/50" 
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Email</label>
                  <input 
                    type="email" 
                    defaultValue={staffData?.email || ''}
                    placeholder="example@email.com" 
                    className="w-full bg-surface-container-low text-sm font-body px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-semibold placeholder:font-medium placeholder:text-on-surface-variant/50" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Số điện thoại</label>
                  <input type="tel" placeholder="090 123 4567" className="w-full bg-surface-container-low text-sm font-body px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-semibold placeholder:font-medium placeholder:text-on-surface-variant/50" />
                </div>
              </div>

              {/* DOB & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Ngày sinh</label>
                  <input type="date" className="w-full bg-surface-container-low text-sm font-body px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-semibold" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Giới tính</label>
                  <div className="flex bg-surface-container-low rounded-xl p-1">
                    <button 
                      type="button"
                      onClick={() => setGender('Nam')}
                      className={`flex-1 py-2.5 text-sm font-bold font-body rounded-lg transition-all ${gender === 'Nam' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                    >
                      Nam
                    </button>
                    <button 
                      type="button"
                      onClick={() => setGender('Nữ')}
                      className={`flex-1 py-2.5 text-sm font-bold font-body rounded-lg transition-all ${gender === 'Nữ' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                    >
                      Nữ
                    </button>
                  </div>
                </div>
              </div>

              {/* Role & Branch */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Vai trò</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-surface-container-low text-sm font-body font-semibold px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface appearance-none cursor-pointer"
                  >
                    <option value="Bác sĩ">Bác sĩ</option>
                    <option value="Điều dưỡng">Điều dưỡng</option>
                    <option value="Lễ tân">Lễ tân</option>
                    <option value="Kỹ thuật viên">Kỹ thuật viên</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Chi nhánh</label>
                  <select className="w-full bg-surface-container-low text-sm font-body font-semibold px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface appearance-none cursor-pointer">
                    <option value="Cơ sở Quận 1">Cơ sở Quận 1</option>
                    <option value="Cơ sở Quận 7">Cơ sở Quận 7</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Professional Info (Conditional based on Role) */}
            {role === 'Bác sĩ' && (
              <div className="pt-6 mt-6 border-t border-surface-container-low space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-md bg-primary-container text-white flex items-center justify-center">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                  </div>
                  <h3 className="font-display font-semibold text-on-surface">Thông tin hành nghề (Bác sĩ)</h3>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Chuyên khoa</label>
                  <input type="text" placeholder="Ví dụ: Nội tiết, Tim mạch..." className="w-full bg-surface-container-low text-sm font-body px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-semibold placeholder:font-medium placeholder:text-on-surface-variant/50" />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Số CCHN (License Number)</label>
                  <input type="text" placeholder="Nhập số chứng chỉ hành nghề" className="w-full bg-surface-container-low text-sm font-body px-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-semibold placeholder:font-medium placeholder:text-on-surface-variant/50" />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-surface-container-low bg-surface-container-lowest flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-body text-sm font-bold text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
          >
            Hủy
          </button>
          <button 
            className="px-6 py-3 rounded-xl font-body text-sm font-bold bg-primary text-white shadow-sm hover:opacity-90 transition-opacity"
            onClick={() => {
              // Mock save action
              onClose();
            }}
          >
            {staffData ? 'Lưu thay đổi' : 'Lưu nhân sự'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default StaffFormModal;
