import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import StaffListPage from './pages/StaffListPage';
import StaffPermissionsPage from './pages/StaffPermissionsPage';
import DoctorSchedulePage from './pages/DoctorSchedulePage';
import RevenueReportsPage from './pages/RevenueReportsPage';
import PatientReceptionPage from './pages/PatientReceptionPage';
import DailyPatientListPage from './pages/DailyPatientListPage';
import ExaminationScreenPage from './pages/ExaminationScreenPage';
import MedicalHistoryPage from './pages/MedicalHistoryPage';
import AppointmentBookingPage from './pages/AppointmentBookingPage';
import LabTestRequestsPage from './pages/LabTestRequestsPage';
import LabResultEntryPage from './pages/LabResultEntryPage';
import PharmacyInventoryPage from './pages/PharmacyInventoryPage';
import PrescriptionDispensingPage from './pages/PrescriptionDispensingPage';
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
          <Route path="/patients" element={<PatientReceptionPage />} />
          <Route path="/daily-patients" element={<DailyPatientListPage />} />
          <Route path="/examination" element={<ExaminationScreenPage />} />
          <Route path="/medical-history" element={<MedicalHistoryPage />} />
          <Route path="/appointments" element={<AppointmentBookingPage />} />
          <Route path="/lab-tests" element={<LabTestRequestsPage />} />
          <Route path="/lab-results-entry" element={<LabResultEntryPage />} />
          <Route path="/pharmacy-inventory" element={<PharmacyInventoryPage />} />
          <Route path="/dispensing" element={<PrescriptionDispensingPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
