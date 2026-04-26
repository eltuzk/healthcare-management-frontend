import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
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
          <Route path="/dashboard" element={
            <div className="w-full bg-surface-container-lowest rounded-[24px] p-8 shadow-ambient min-h-[400px]">
              <h2 className="font-display text-2xl font-semibold mb-4 text-on-surface">Admin Dashboard Overview</h2>
              <p className="font-body text-on-surface-variant">Welcome to the administration panel.</p>
            </div>
          } />
          <Route path="/staff" element={
            <div className="w-full bg-surface-container-lowest rounded-[24px] p-8 shadow-ambient min-h-[400px]">
              <h2 className="font-display text-2xl font-semibold mb-4 text-on-surface">Staff Management</h2>
            </div>
          } />
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
