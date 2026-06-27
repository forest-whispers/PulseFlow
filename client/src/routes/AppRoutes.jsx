import { BrowserRouter, Routes, Route } from "react-router-dom"
import PublicLayout from "../layouts/PublicLayout"
import AuthenticatedLayout from "../layouts/AuthenticatedLayout"
import ProtectedRoute from "./ProtectedRoute"
import PublicOnlyRoute from "./PublicOnlyRoute"

// Page Placeholders
import LandingPage from "../features/auth/pages/LandingPage"
import LoginPage from "../features/auth/pages/LoginPage"
import RegisterPage from "../features/auth/pages/RegisterPage"
import PatientDashboard from "../features/patient/pages/PatientDashboard"
import DoctorSearch from "../features/patient/pages/DoctorSearch"
import DoctorBooking from "../features/patient/pages/DoctorBooking"
import PatientAppointments from "../features/patient/pages/PatientAppointments"
import AppointmentDetails from "../features/patient/pages/AppointmentDetails"
import PatientProfile from "../features/patient/pages/PatientProfile"
import DoctorDashboard from "../features/doctor/pages/DoctorDashboard"
import DoctorAvailability from "../features/doctor/pages/DoctorAvailability"
import DoctorBlockedDates from "../features/doctor/pages/DoctorBlockedDates"
import DoctorAppointments from "../features/doctor/pages/DoctorAppointments"
import DoctorProfile from "../features/doctor/pages/DoctorProfile"
import Notifications from "../features/notifications/pages/Notifications"
import AdminDashboard from "../features/admin/pages/AdminDashboard"
import CreateMedicalRecord from "../features/doctor/pages/CreateMedicalRecord"
import CreatePrescription from "../features/doctor/pages/CreatePrescription"
import CreateLabResult from "../features/doctor/pages/CreateLabResult"
import ResourceDetailsPlaceholder from "../features/doctor/pages/ResourceDetailsPlaceholder"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />
        </Route>

        {/* Authenticated Routes */}
        <Route element={<AuthenticatedLayout />}>
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/doctors"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <DoctorSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/doctors/:id"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <DoctorBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments/:id"
            element={
              <ProtectedRoute allowedRoles={["patient", "admin"]}>
                <AppointmentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/notifications"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/medical-records/:id"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <ResourceDetailsPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/prescriptions/:id"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <ResourceDetailsPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/lab-results/:id"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <ResourceDetailsPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/invoices/:id"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <ResourceDetailsPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments/:id"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <AppointmentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/availability"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorAvailability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/blocked-dates"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorBlockedDates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/profile"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/notifications"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/medical-records/create"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <CreateMedicalRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/medical-records/:id"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <ResourceDetailsPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/prescriptions/create"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <CreatePrescription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/prescriptions/:id"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <ResourceDetailsPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/lab-results/create"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <CreateLabResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/lab-results/:id"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <ResourceDetailsPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/invoices/:id"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <ResourceDetailsPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback Route */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
              <h2 className="text-2xl font-bold mb-2">404 - Page Not Found</h2>
              <p className="text-muted-foreground mb-4">The page you are looking for does not exist.</p>
              <a href="/" className="underline text-primary hover:opacity-90">
                Go Home
              </a>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
