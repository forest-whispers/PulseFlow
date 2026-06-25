import { BrowserRouter, Routes, Route } from "react-router-dom"
import PublicLayout from "../layouts/PublicLayout"
import AuthenticatedLayout from "../layouts/AuthenticatedLayout"

// Page Placeholders
import LandingPage from "../features/auth/pages/LandingPage"
import LoginPage from "../features/auth/pages/LoginPage"
import RegisterPage from "../features/auth/pages/RegisterPage"
import PatientDashboard from "../features/patient/pages/PatientDashboard"
import DoctorDashboard from "../features/doctor/pages/DoctorDashboard"
import AdminDashboard from "../features/admin/pages/AdminDashboard"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Authenticated Routes */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">404 - Page Not Found</h2>
            <p className="text-muted-foreground mb-4">The page you are looking for does not exist.</p>
            <a href="/" className="underline text-primary hover:opacity-90">Go Home</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}
