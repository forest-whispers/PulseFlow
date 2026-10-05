import express from "express";
const router = express.Router();

import userRoutes from "../features/user/routes.js";
import patientProfileRoutes from "../features/patient-profile/routes.js";
import doctorSearchRoutes from "../features/doctor-search/routes.js";
import doctorProfileRoutes from "../features/doctor-profile/routes.js";
import doctorAvailabilityRoutes from "../features/doctor-availability/routes.js";
import availabilityExceptionRoutes from "../features/availability-exception/routes.js";
import appointmentRoutes from "../features/appointment/routes.js";
import medicalRecordRoutes from "../features/medical-record/routes.js";
import prescriptionRoutes from "../features/prescription/routes.js";
import labResultRoutes from "../features/lab-result/routes.js";
import invoiceRoutes from "../features/invoice/routes.js";
import paymentRoutes from "../features/payment/routes.js";
import notificationRoutes from "../features/notification/routes.js";
import adminDashboardRoutes from "../features/dashboard/admin/routes.js";
import doctorDashboardRoutes from "../features/dashboard/doctor/routes.js";
import patientDashboardRoutes from "../features/dashboard/patient/routes.js";
import auditLogRoutes from "../features/audit-log/routes.js";
import analyticsRoutes from "../features/analytics/routes.js";

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API Working",
    });
});

router.use("/users", userRoutes);
router.use("/patients", patientProfileRoutes);
router.use("/doctors", doctorSearchRoutes);
router.use("/doctor-profile", doctorProfileRoutes);
router.use("/doctor-availability", doctorAvailabilityRoutes);
router.use("/availability-exceptions", availabilityExceptionRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/medical-records", medicalRecordRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/lab-results", labResultRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/payments", paymentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/dashboard/admin", adminDashboardRoutes);
router.use("/dashboard/doctor", doctorDashboardRoutes);
router.use("/dashboard/patient", patientDashboardRoutes);
router.use("/audit-logs", auditLogRoutes);
router.use("/analytics", analyticsRoutes);

export default router;