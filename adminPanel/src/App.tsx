import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import { LabProvider } from "./context/LabContext";
import { FinanceProvider } from './context/FinanceContext';
import { DoctorProvider } from './context/DoctorContext';
import { NurseProvider } from './context/NurseContext';
import { PharmacyProvider } from './context/PharmacyContext';
// Pages
import LoginPage from './pages/LoginPage';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import HospitalAdminDashboard from './pages/HospitalAdminDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorDetails from './pages/doctor/DoctorDetails';
import LabDashboard from './pages/LabDashboard';
import UsersAdminPage from './pages/UsersAdminPage';
import PatientsAdminPage from './pages/patients/PatientsAdminPage';
import PatientDetailsPage from './pages/patients/PatientDetailsPage';
import AdminLabPanel from './pages/lab/AdminLabPanel'
import AdminLabDetailPage from './pages/lab/AdminLabDetailPage';
import {FinanceDashboard} from './components/finance/FinanceDashboard';
import {DepartmentFinancePage} from './pages/finance/DepartmentFinancePage';
import NurseDetailsPage from './pages/nurse/NurseDetailsPage';
import NursesAdminPage from './pages/nurse/NursesAdminPage';
import PharmacyDashboardPage from './pages/pharmacy/PharmacyDashboard';
import PharmacyProductsPage from './pages/pharmacy/PharmacyProductsPage';
import PharmacyProductDetailPage from './pages/pharmacy/PharmacyProductDetailPage';
import StockCharts from './components/pharmacy/StockCharts';

// Layout wrapper
function MainLayout({ children }: { children: JSX.Element }) {
  return (
    <div className="flex flex-col min-h-screen">
             {/* Header (Sticky Top) */}
        <header className="sticky top-0 z-40 bg-white shadow-md">
          <Header />
        </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 left-0 top-0 bg-[#050a30] text-white flex-shrink-0">
          <Sidebar />
        </aside>

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
        <FinanceProvider> 
          <DoctorProvider>
            <NurseProvider>
              <PharmacyProvider>
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

          <Route
            path="/finance"
            element={
              <ProtectedRoute roles={["SuperAdmin", "HospitalAdmin"]}>
                <MainLayout>
                  <FinanceDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/finance/department/:departmentId"
            element={
              <ProtectedRoute roles={["SuperAdmin", "HospitalAdmin"]}>
                <MainLayout>
                  <DepartmentFinancePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor"
            element={
              <ProtectedRoute roles={["SuperAdmin", "HospitalAdmin"]}>
                <MainLayout>
                  <DoctorDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/:id"
            element={
              <ProtectedRoute roles={["SuperAdmin", "HospitalAdmin"]}>
                <MainLayout>
                  <DoctorDetails/>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/nurse"
            element={
              <ProtectedRoute roles={["SuperAdmin", "HospitalAdmin"]}>
                <MainLayout>
                 <NursesAdminPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

           <Route
            path="/nurse/id"
            element={
              <ProtectedRoute roles={["SuperAdmin", "HospitalAdmin"]}>
                <MainLayout>
                 <NurseDetailsPage  />
                </MainLayout>
              </ProtectedRoute>
            }
          />

           <Route
            path="/pharmacy"
            element={
              <ProtectedRoute roles={["SuperAdmin", "HospitalAdmin"]}>
                <MainLayout>
                 <PharmacyDashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

           <Route
            path="/pharmacy/products"
            element={
              <ProtectedRoute roles={["SuperAdmin", "HospitalAdmin"]}>
                <MainLayout>
                 <PharmacyProductsPage/>
                </MainLayout>
              </ProtectedRoute>
            }
          />

           <Route
            path="/pharmacy/products/:id"
            element={
              <ProtectedRoute roles={["SuperAdmin", "HospitalAdmin"]}>
                <MainLayout>
                 <PharmacyProductDetailPage/>
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/pharmacy/stock-charts"
            element={
              <ProtectedRoute roles={["SuperAdmin", "HospitalAdmin"]}>
                <MainLayout>
                 <StockCharts />
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
      </PharmacyProvider>
      </NurseProvider>
      </DoctorProvider>
      </FinanceProvider> 
      </LabProvider>
    </AuthProvider>
  );
}
