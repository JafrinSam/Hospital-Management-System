import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import { LabProvider } from "./context/LabContext";

// Pages
import LoginPage from './pages/LoginPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import HospitalAdminDashboard from './pages/HospitalAdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import LabDashboard from './pages/LabDashboard';
import UsersAdminPage from './pages/UsersAdminPage';
import PatientsAdminPage from './pages/patients/PatientsAdminPage';
import PatientDetailsPage from './pages/patients/PatientDetailsPage';
import AdminLabPanel from './pages/lab/AdminLabPanel'
import AdminLabDetailPage from './pages/lab/AdminLabDetailPage';

// Layout wrapper
function MainLayout({ children }: { children: JSX.Element }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#050a30] text-white flex-shrink-0">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100 text-gray-900">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LabProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Super Admin Routes */}
          <Route
            path="/superadmin/dashboard"
            element={
              <ProtectedRoute roles={['SuperAdmin']}>
                <MainLayout>
                  <SuperAdminDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/superadmin/users"
            element={
              <ProtectedRoute roles={['SuperAdmin']}>
                <MainLayout>
                  <UsersAdminPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient"
            element={
              <ProtectedRoute roles={['SuperAdmin']}>
                <MainLayout>
                  <PatientsAdminPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/:id"
            element={
              <ProtectedRoute roles={['SuperAdmin']}>
                <MainLayout>
                  <PatientDetailsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />


          <Route
            path="/lab"
            element={
              <ProtectedRoute roles={['SuperAdmin']}>
                <MainLayout>
                  <AdminLabPanel />
                </MainLayout>
              </ProtectedRoute>
            }
          />
            <Route
            path="/lab/:labId"
            element={
              <ProtectedRoute roles={['SuperAdmin']}>
                <MainLayout>
                  <AdminLabDetailPage/>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Hospital Admin */}
          <Route
            path="/hospital/dashboard"
            element={
              <ProtectedRoute roles={['HospitalAdmin']}>
                <MainLayout>
                  <HospitalAdminDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Doctor */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute roles={['Doctor']}>
                <MainLayout>
                  <DoctorDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Lab Technician */}
          <Route
            path="/lab/dashboard"
            element={
              <ProtectedRoute roles={['LabTech']}>
                <MainLayout>
                  <LabDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Default route */}
          <Route
            path="/"
            element={
              <ProtectedRoute roles={['SuperAdmin', 'HospitalAdmin', 'Doctor', 'LabTech']}>
                <MainLayout>
                  <SuperAdminDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      </LabProvider>
    </AuthProvider>
  );
}
