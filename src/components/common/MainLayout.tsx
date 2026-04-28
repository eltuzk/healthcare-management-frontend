import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {/* Generous padding for the main content area per DESIGN.md */}
        <main className="flex-1 overflow-y-auto px-8 pb-8 pt-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
