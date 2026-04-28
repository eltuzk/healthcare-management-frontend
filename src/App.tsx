import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import StaffListPage from './pages/StaffListPage';
import StaffPermissionsPage from './pages/StaffPermissionsPage';
import DoctorSchedulePage from './pages/DoctorSchedulePage';
import RevenueReportsPage from './pages/RevenueReportsPage';
import MainLayout from './components/common/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes wrapped in MainLayout */}
        <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<AdminDashboardPage />} />
          <Route path="/staff" element={<StaffListPage />} />
          <Route path="/permissions" element={<StaffPermissionsPage />} />
          <Route path="/schedule" element={<DoctorSchedulePage />} />
          <Route path="/reports" element={<RevenueReportsPage />} />
          <Route path="/patients" element={
            <div className="w-full bg-surface-container-lowest rounded-[24px] p-8 shadow-ambient min-h-[400px]">
              <h2 className="font-display text-2xl font-semibold mb-4 text-on-surface">Patient Reception</h2>
            </div>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
