import React, { useEffect, useState } from 'react';
import { getProfileByRole, updateProfileByRole } from '../services/profileService';
import api from '../services/api';
import { getMyAccount } from '../services/accountService';
import { changePassword } from '../services/authService';
import { getSpecialties } from '../services/specialtyService';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const [role, setRole] = useState<string | null>(() => {
    const storedRole = localStorage.getItem('role');
    if (!storedRole) return null;
    return storedRole.startsWith('ROLE_') ? storedRole : `ROLE_${storedRole}`;
  });
  const [account, setAccount] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');

  // Password change state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching account and profile for role:', role);
      
      // Fetch account data first
      const accData = await getMyAccount();
      setAccount(accData);

      // Try to fetch profile, but handle errors gracefully for each role
      let profData = null;
      try {
        if (role) {
          profData = await getProfileByRole(role);
        }
      } catch (error: any) {
        console.warn('Profile record not found or error fetching:', error);
        // If it's a 404, we just treat it as no profile yet
        if (error.response?.status !== 404) {
          throw error; // Re-throw if it's not a 404
        }
      }

      const specData = (role === 'ROLE_DOCTOR') ? await getSpecialties() : [];
      
      console.log('Account data:', accData);
      console.log('Profile data:', profData);
      
      setProfile(profData || { 
        fullName: accData.fullName, 
        email: accData.email,
        identityNum: '',
        phone: '',
        address: '',
        gender: 'MALE',
        dateOfBirth: ''
      });
      setSpecialties(specData);
    } catch (error: any) {
      console.error('Detailed error fetching profile:', error);
      const errorMessage = error.message || 'Không thể tải thông tin hồ sơ';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    setErrors({});
    // Clean up data before sending - only send relevant fields to avoid 400 unknown properties
    const cleanData: any = {
      fullName: profile.fullName,
      gender: profile.gender,
      phone: profile.phone,
      address: profile.address,
      identityNum: profile.identityNum,
      dateOfBirth: profile.dateOfBirth || null,
    };

    if (role === 'ROLE_DOCTOR' || role === 'ROLE_PHARMACIST' || role === 'ROLE_TECHNICIAN') {
      cleanData.licenseNum = profile.licenseNum;
      cleanData.qualification = profile.qualification;
      cleanData.experience = profile.experience;
      if (role === 'ROLE_DOCTOR') {
        cleanData.specialtyId = profile.specialtyId;
        cleanData.specialization = profile.specialization;
      }
      if (role === 'ROLE_TECHNICIAN') {
        cleanData.specialtyArea = profile.specialtyArea;
      }
    }

    if (role === 'ROLE_ACCOUNTANT' || role === 'ROLE_RECEPTIONIST' || role === 'ROLE_PHARMACIST' || role === 'ROLE_TECHNICIAN' || role === 'ROLE_DOCTOR' || role === 'ROLE_ADMIN') {
       cleanData.hireDate = profile.hireDate || null;
    }

    if (role === 'ROLE_RECEPTIONIST') {
      cleanData.shift = profile.shift;
    }

    if (role === 'ROLE_PATIENT') {
      cleanData.medicalHistory = profile.medicalHistory;
      cleanData.allergy = profile.allergy;
    }

    // Ensure all empty strings are null
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === '') cleanData[key] = null;
    });

    try {
      if (role === 'ROLE_ADMIN' && !profile.administratorId) {
        // Initial creation for admin profile if it doesn't exist
        await api.post("/api/administrators", { ...cleanData, accountId: account.accountId });
      } else {
        await updateProfileByRole(role, cleanData);
      }
      toast.success('Cập nhật hồ sơ thành công');
      fetchData();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.response && error.response.status === 400) {
        const data = error.response.data;
        // If data is an object but NOT a standard Spring error response (which has 'timestamp')
        if (data && typeof data === 'object' && !data.timestamp) {
          setErrors(data);
          toast.error('Vui lòng kiểm tra lại thông tin nhập vào');
        } else {
          const msg = data?.message || data?.error || error.message || 'Cập nhật hồ sơ thất bại';
          toast.error(msg);
        }
      } else {
        toast.error(error.message || 'Cập nhật hồ sơ thất bại');
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProfile({ ...profile, [field]: value });
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Đổi mật khẩu thành công');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderRoleFields = () => {
    if (!profile && role !== 'ROLE_ADMIN') {
      return (
        <div className="p-8 border-2 border-dashed border-outline-variant rounded-2xl text-center">
          <p className="text-on-surface-variant font-body">
            Không tìm thấy thông tin hồ sơ chi tiết cho tài khoản này.
          </p>
        </div>
      );
    }

    const commonFields = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Họ và tên</label>
            <input
              type="text"
              value={profile.fullName || ''}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-error bg-error/5' : 'border-outline-variant bg-surface-container-lowest'} focus:outline-none focus:border-primary transition-colors`}
            />
            {errors.fullName && <p className="text-xs text-error">{errors.fullName}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Số điện thoại</label>
            <input
              type="text"
              value={profile.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-error bg-error/5' : 'border-outline-variant bg-surface-container-lowest'} focus:outline-none focus:border-primary transition-colors`}
            />
            {errors.phone && <p className="text-xs text-error">{errors.phone}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ngày sinh</label>
            <input
              type="date"
              value={profile.dateOfBirth || ''}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${errors.dateOfBirth ? 'border-error bg-error/5' : 'border-outline-variant bg-surface-container-lowest'} focus:outline-none focus:border-primary transition-colors`}
            />
            {errors.dateOfBirth && <p className="text-xs text-error">{errors.dateOfBirth}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Giới tính</label>
            <select
              value={profile.gender || ''}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${errors.gender ? 'border-error bg-error/5' : 'border-outline-variant bg-surface-container-lowest'} focus:outline-none focus:border-primary transition-colors`}
            >
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
            {errors.gender && <p className="text-xs text-error">{errors.gender}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Số CCCD / Identity No</label>
            <input
              type="text"
              value={profile.identityNum || ''}
              onChange={(e) => handleInputChange('identityNum', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${errors.identityNum ? 'border-error bg-error/5' : 'border-outline-variant bg-surface-container-lowest'} focus:outline-none focus:border-primary transition-colors`}
            />
            {errors.identityNum && <p className="text-xs text-error">{errors.identityNum}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email (Không thể sửa)</label>
            <input
              type="text"
              value={profile.email || ''}
              readOnly
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface-variant cursor-not-allowed"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Địa chỉ</label>
          <textarea
            value={profile.address || ''}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-error bg-error/5' : 'border-outline-variant bg-surface-container-lowest'} focus:outline-none focus:border-primary transition-colors min-h-[80px]`}
          />
          {errors.address && <p className="text-xs text-error">{errors.address}</p>}
        </div>
      </>
    );

    if (role === 'ROLE_DOCTOR') {
      return (
        <div className="space-y-6">
          {commonFields}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Số giấy phép</label>
              <input
                type="text"
                value={profile.licenseNum || ''}
                onChange={(e) => handleInputChange('licenseNum', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${errors.licenseNum ? 'border-error bg-error/5' : 'border-outline-variant bg-surface-container-lowest'} focus:outline-none focus:border-primary transition-colors`}
              />
              {errors.licenseNum && <p className="text-xs text-error">{errors.licenseNum}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Chuyên khoa</label>
              <select
                value={profile.specialtyId || ''}
                onChange={(e) => handleInputChange('specialtyId', e.target.value ? Number(e.target.value) : null)}
                className={`w-full px-4 py-3 rounded-xl border ${errors.specialtyId ? 'border-error bg-error/5' : 'border-outline-variant bg-surface-container-lowest'} focus:outline-none focus:border-primary transition-colors`}
              >
                <option value="">Chọn chuyên khoa</option>
                {specialties.map(spec => (
                  <option key={spec.specialtyId} value={spec.specialtyId}>
                    {spec.specialtyName}
                  </option>
                ))}
              </select>
              {errors.specialtyId && <p className="text-xs text-error">{errors.specialtyId}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Trình độ chuyên môn</label>
            <input
              type="text"
              value={profile.qualification || ''}
              onChange={(e) => handleInputChange('qualification', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${errors.qualification ? 'border-error bg-error/5' : 'border-outline-variant bg-surface-container-lowest'} focus:outline-none focus:border-primary transition-colors`}
            />
            {errors.qualification && <p className="text-xs text-error">{errors.qualification}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Kinh nghiệm</label>
            <textarea
              value={profile.experience || ''}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${errors.experience ? 'border-error bg-error/5' : 'border-outline-variant bg-surface-container-lowest'} focus:outline-none focus:border-primary transition-colors min-h-[80px]`}
            />
            {errors.experience && <p className="text-xs text-error">{errors.experience}</p>}
          </div>
        </div>
      );
    }

    if (role === 'ROLE_PATIENT') {
      return (
        <div className="space-y-6">
          {commonFields}
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tiền sử bệnh lý</label>
            <textarea
              value={profile.medicalHistory || ''}
              onChange={(e) => setProfile({ ...profile, medicalHistory: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary transition-colors min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Dị ứng</label>
            <textarea
              value={profile.allergy || ''}
              onChange={(e) => setProfile({ ...profile, allergy: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      );
    }
    if (role === 'ROLE_ADMIN') {
      return (
        <div className="space-y-6">
          {commonFields}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ngày vào làm</label>
              <input
                type="date"
                value={profile.hireDate || ''}
                onChange={(e) => handleInputChange('hireDate', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${errors.hireDate ? 'border-error bg-error/5' : 'border-outline-variant bg-surface-container-lowest'} focus:outline-none focus:border-primary transition-colors`}
              />
              {errors.hireDate && <p className="text-xs text-error">{errors.hireDate}</p>}
            </div>
          </div>
        </div>
      );
    }

    // Default staff view
    return (
      <div className="space-y-6">
        {commonFields}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Trình độ chuyên môn</label>
            <input
              type="text"
              value={profile.qualification || ''}
              onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ngày vào làm</label>
            <input
              type="text"
              value={profile.hireDate || ''}
              readOnly
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-low text-on-surface-variant cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-10 max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="bg-surface-container-lowest rounded-[32px] shadow-ambient overflow-hidden">
        {/* Profile Header */}
        <div className="bg-primary p-8 text-white flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-bold">
            {account?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold">{account?.fullName}</h2>
            <p className="text-white/70 font-body">{account?.roleName} • {account?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant px-8">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-4 px-6 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === 'info' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Thông tin cá nhân
            {activeTab === 'info' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>}
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-4 px-6 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === 'password' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Đổi mật khẩu
            {activeTab === 'password' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>}
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'info' ? (
            <form onSubmit={handleProfileUpdate} className="space-y-8">
              {renderRoleFields()}
              <div className="pt-4">
                <button
                  type="submit"
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  required
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                >
                  Cập nhật mật khẩu
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
