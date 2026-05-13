import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMyAccount } from '../../services/accountService';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getMyAccount();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user for header:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (path === 'dashboard') return 'Tổng quan';
    if (path === 'staff') return 'Quản lý Nhân sự';
    if (path === 'patients') return 'Tiếp nhận bệnh nhân';
    if (path === 'profile') return 'Hồ sơ cá nhân';
    if (path === 'permissions') return 'Phân quyền';
    return 'Hệ thống';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <header className="h-[88px] bg-surface flex items-center justify-between px-8 relative z-[100] border-b border-outline-variant/10">
      <div className="flex items-center gap-4">
        <h1 className="font-display text-[26px] font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary-container">
          {getPageTitle()}
        </h1>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-on-surface-variant hover:text-primary transition-colors relative">
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-surface"></span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        
        <div className="h-8 w-px bg-outline-variant/30"></div>
        
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-11 h-11 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:shadow-md transition-shadow">
              {getInitials(user?.fullName || 'User')}
            </div>
            <div className="hidden sm:block">
              <p className="font-body text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                {user?.fullName || 'Đang tải...'}
              </p>
              <p className="font-body text-xs text-on-surface-variant">
                {user?.roleName?.replace('ROLE_', '') || 'Hệ thống'}
              </p>
            </div>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-surface-container-lowest rounded-2xl shadow-ambient border border-outline-variant/30 py-2 animate-fade-in z-[110]">
              <div 
                className="px-4 py-3 hover:bg-surface-container-low cursor-pointer flex items-center gap-3 transition-colors"
                onClick={() => {
                  navigate('/profile');
                  setIsDropdownOpen(false);
                }}
              >
                <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-body text-sm font-semibold text-on-surface">Hồ sơ cá nhân</span>
              </div>
              
              <div className="h-px bg-outline-variant/30 my-1"></div>
              
              <div 
                className="px-4 py-3 hover:bg-error-container/10 cursor-pointer flex items-center gap-3 transition-colors text-error"
                onClick={handleLogout}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-body text-sm font-semibold">Đăng xuất</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
