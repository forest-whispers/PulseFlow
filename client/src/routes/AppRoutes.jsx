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
import AdminPlaceholder from "../features/admin/pages/AdminPlaceholder"
import AdminAppointments from "../features/admin/pages/AdminAppointments"
import AdminInvoices from "../features/admin/pages/AdminInvoices"
import CreateMedicalRecord from "../features/doctor/pages/CreateMedicalRecord"
import CreatePrescription from "../features/doctor/pages/CreatePrescription"
import CreateLabResult from "../features/doctor/pages/CreateLabResult"
import ResourceDetailsPlaceholder from "../features/doctor/pages/ResourceDetailsPlaceholder"
import PatientMedicalRecords from "../features/patient/pages/PatientMedicalRecords"
import MedicalRecordDetails from "../features/patient/pages/MedicalRecordDetails"
import PatientPrescriptions from "../features/patient/pages/PatientPrescriptions"
import PrescriptionDetails from "../features/patient/pages/PrescriptionDetails"
import PatientLabResults from "../features/patient/pages/PatientLabResults"
import LabResultDetails from "../features/patient/pages/LabResultDetails"
import CreateInvoice from "../features/doctor/pages/CreateInvoice"
import PatientInvoices from "../features/patient/pages/PatientInvoices"
import InvoiceDetails from "../features/patient/pages/InvoiceDetails"

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
            path="/patient/medical-records"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientMedicalRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/medical-records/:id"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <MedicalRecordDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/prescriptions"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientPrescriptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/prescriptions/:id"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PrescriptionDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/lab-results"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientLabResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/lab-results/:id"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <LabResultDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/invoices"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientInvoices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/invoices/:id"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <InvoiceDetails />
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
                <MedicalRecordDetails />
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
                <PrescriptionDetails />
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
                <LabResultDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/invoices/create"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <CreateInvoice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/invoices/:id"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <InvoiceDetails />
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
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppointmentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/medical-records/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <MedicalRecordDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/prescriptions/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <PrescriptionDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/lab-results/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <LabResultDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/invoices"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminInvoices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/invoices/create"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CreateInvoice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/invoices/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <InvoiceDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPlaceholder />
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
