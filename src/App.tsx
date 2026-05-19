import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import StaffListPage from './pages/admin/StaffListPage';
import StaffPermissionsPage from './pages/admin/StaffPermissionsPage';
import DoctorSchedulePage from './pages/DoctorSchedulePage';
import RevenueReportsPage from './pages/accountant/RevenueReportsPage';
import PatientReceptionPage from './pages/receptionist/PatientReceptionPage';
import DailyPatientListPage from './pages/DailyPatientListPage';
import ExaminationScreenPage from './pages/doctor/ExaminationScreenPage';
import MedicalHistoryPage from './pages/MedicalHistoryPage';
import AppointmentBookingPage from './pages/AppointmentBookingPage';
import LabTestRequestsPage from './pages/technician/LabTestRequestsPage';
import LabResultEntryPage from './pages/technician/LabResultEntryPage';
import PharmacyInventoryPage from './pages/pharmacist/PharmacyInventoryPage';
import PrescriptionDispensingPage from './pages/pharmacist/PrescriptionDispensingPage';
import InpatientBedMapPage from './pages/InpatientBedMapPage';
import RoomManagementPage from './pages/RoomManagementPage';
import HospitalFeeCollectionPage from './pages/accountant/HospitalFeeCollectionPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import DoctorSchedulePagePersonal from './pages/doctor/DoctorSchedulePage';
import AppointmentSelectionPage from './pages/doctor/AppointmentSelectionPage';
import ExaminationPage from './pages/doctor/ExaminationPage';
import ExaminationStatusPage from './pages/doctor/ExaminationStatusPage';
import PrescriptionPage from './pages/doctor/PrescriptionPage';
import InpatientAdmissionPage from './pages/doctor/InpatientAdmissionPage';
import ProfilePage from './pages/ProfilePage';
import MyMedicalRecordsPage from './pages/patient/MyMedicalRecordsPage';
import MainLayout from './components/common/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes - No authentication required */}
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Protected Routes - Authentication and Layout required */}
        <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/staff" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <StaffListPage />
            </ProtectedRoute>
          } />
          <Route path="/permissions" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <StaffPermissionsPage />
            </ProtectedRoute>
          } />
          <Route path="/schedule" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'DOCTOR']}>
              <DoctorSchedulePage />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'ACCOUNTANT']}>
              <RevenueReportsPage />
            </ProtectedRoute>
          } />
          <Route path="/patients" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST']}>
              <PatientReceptionPage />
            </ProtectedRoute>
          } />
          <Route path="/daily-patients" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'DOCTOR']}>
              <DailyPatientListPage />
            </ProtectedRoute>
          } />
          <Route path="/examination" element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <ExaminationScreenPage />
            </ProtectedRoute>
          } />
          {/* New Doctor Routes */}
          <Route path="/doctor/schedule" element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorSchedulePagePersonal />
            </ProtectedRoute>
          } />
          <Route path="/doctor/appointments" element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <AppointmentSelectionPage />
            </ProtectedRoute>
          } />
          <Route path="/doctor/examination" element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <ExaminationPage />
            </ProtectedRoute>
          } />
          <Route path="/doctor/status" element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <ExaminationStatusPage />
            </ProtectedRoute>
          } />
          <Route path="/doctor/prescription" element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <PrescriptionPage />
            </ProtectedRoute>
          } />
          <Route path="/doctor/admission" element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <InpatientAdmissionPage />
            </ProtectedRoute>
          } />
          <Route path="/medical-history" element={
            <ProtectedRoute allowedRoles={['DOCTOR', 'RECEPTIONIST', 'ADMIN']}>
              <MedicalHistoryPage />
            </ProtectedRoute>
          } />
          <Route path="/appointments" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'PATIENT']}>
              <AppointmentBookingPage />
            </ProtectedRoute>
          } />
          <Route path="/lab-tests" element={
            <ProtectedRoute allowedRoles={['TECHNICIAN', 'DOCTOR', 'ADMIN']}>
              <LabTestRequestsPage />
            </ProtectedRoute>
          } />
          <Route path="/lab-results-entry" element={
            <ProtectedRoute allowedRoles={['TECHNICIAN', 'DOCTOR', 'ADMIN']}>
              <LabResultEntryPage />
            </ProtectedRoute>
          } />
          <Route path="/pharmacy-inventory" element={
            <ProtectedRoute allowedRoles={['PHARMACIST', 'ADMIN']}>
              <PharmacyInventoryPage />
            </ProtectedRoute>
          } />
          <Route path="/dispensing" element={
            <ProtectedRoute allowedRoles={['PHARMACIST']}>
              <PrescriptionDispensingPage />
            </ProtectedRoute>
          } />
          <Route path="/bed-map" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR']}>
              <InpatientBedMapPage />
            </ProtectedRoute>
          } />
          <Route path="/rooms" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST', 'DOCTOR']}>
              <RoomManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/billing" element={
            <ProtectedRoute allowedRoles={['ACCOUNTANT', 'ADMIN']}>
              <HospitalFeeCollectionPage />
            </ProtectedRoute>
          } />
          
          {/* Patient Routes */}
          <Route path="/patient/medical-records" element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <MyMedicalRecordsPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
