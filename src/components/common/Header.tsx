import React from 'react';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  // Format the path to a readable title
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (path === 'dashboard') return 'Tổng quan';
    if (path === 'staff') return 'Quản lý nhân sự';
    if (path === 'patients') return 'Tiếp nhận bệnh nhân';
    return 'Tổng quan';
  };

  return (
    <header className="h-[88px] bg-surface flex items-center justify-between px-8 relative z-0">
      <div>
        <h1 className="font-display text-2xl font-semibold text-on-surface">{getPageTitle()}</h1>
        <p className="font-body text-sm text-on-surface-variant mt-1">Hôm nay là {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-on-surface-variant hover:text-primary transition-colors relative">
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-surface"></span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        
        <div className="h-8 w-px bg-outline-variant/30"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-11 h-11 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:shadow-md transition-shadow">
            BS
          </div>
          <div className="hidden sm:block">
            <p className="font-body text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Bs. Robert Smith</p>
            <p className="font-body text-xs text-on-surface-variant">Khoa Tim mạch</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
