import React, { useState, useEffect } from 'react';
import StaffFormModal from '../components/staff/StaffFormModal';
import { getAccounts, deleteAccount } from '../services/accountService';
import { toast } from 'react-hot-toast';

const StaffListPage: React.FC = () => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await getAccounts(0, 100);
      const filteredStaff = (res.content || []).filter((acc: any) => 
        acc.roleName !== 'PATIENT' && acc.roleName !== 'ROLE_PATIENT'
      );
      setStaffList(filteredStaff);
    } catch (error) {
      toast.error('Không thể tải danh sách nhân sự');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const openEditModal = (staff: any) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: any) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân sự này?')) {
      try {
        await deleteAccount(id);
        toast.success('Xóa nhân sự thành công');
        fetchStaff();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Không thể xóa nhân sự');
      }
    }
  };

  return (
    <div className="pb-20 px-4 md:px-8 max-w-7xl mx-auto animate-fade-in space-y-8">
      {/* Action Section */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={openAddModal}
          className="group relative bg-primary text-white font-body font-bold text-sm px-8 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex items-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <svg className="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span className="relative">Thêm nhân sự mới</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-lowest rounded-[32px] shadow-ambient border border-outline-variant/20 overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/40">
                <th className="py-6 px-8 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/20">Nhân viên</th>
                <th className="py-6 px-8 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/20">Liên hệ</th>
                <th className="py-6 px-8 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/20 text-center">Vai trò</th>
                <th className="py-6 px-8 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/20 text-center">Trạng thái</th>
                <th className="py-6 px-8 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/20 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center font-body text-sm text-on-surface-variant">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center font-body text-sm text-on-surface-variant">
                    Không có dữ liệu nhân sự nào.
                  </td>
                </tr>
              ) : staffList.map((account) => (
                <tr key={account.accountId} className="group hover:bg-surface-container-low/40 transition-all duration-300">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-container/30 text-primary flex items-center justify-center font-bold text-base shadow-inner group-hover:scale-110 transition-transform duration-300">
                        {account.fullName?.split(' ').pop()?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-body text-base font-bold text-on-surface group-hover:text-primary transition-colors">{account.fullName}</p>
                        <p className="font-body text-[10px] text-on-surface-variant/70 font-bold uppercase tracking-widest mt-0.5">ID: {account.accountId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8 font-body text-sm font-medium text-on-surface/80 italic">{account.email}</td>
                  <td className="py-5 px-8 text-center">
                    <span className="inline-flex px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest">
                      {account.roleName?.replace('ROLE_', '')}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-center">
                    <div className="flex items-center justify-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full shadow-sm ${account.isActive ? 'bg-emerald-500 shadow-emerald-200' : 'bg-error shadow-error-200'}`}></div>
                      <span className={`font-body text-[11px] font-bold ${account.isActive ? 'text-emerald-600' : 'text-error'}`}>
                        {account.isActive ? 'Hoạt động' : 'Tạm ngừng'}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <div className="flex items-center justify-end gap-3 transition-all duration-300">
                      <button 
                        onClick={() => openEditModal(account)}
                        className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm border border-primary/20"
                        title="Chỉnh sửa"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(account.accountId)}
                        className="p-2.5 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all shadow-sm border border-error/20"
                        title="Xóa"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-surface-container-low/20 py-4 px-8 border-t border-outline-variant/10">
          <p className="font-body text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">
            Tổng cộng: {staffList.length} nhân viên y tế
          </p>
        </div>
      </div>

      <StaffFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchStaff}
        staffData={selectedStaff}
      />
    </div>
  );
};

export default StaffListPage;
