import express from "express";
const router = express.Router();

import userRoutes from "../modules/user/user.routes.js";
import patientProfileRoutes from "../modules/patientProfile/patientProfile.routes.js";
import doctorSearchRoutes from "../modules/doctorSearch/doctorSearch.routes.js";
import doctorProfileRoutes from "../modules/doctorProfile/doctorProfile.routes.js";
import doctorAvailabilityRoutes from "../modules/doctorAvailability/doctorAvailability.routes.js";
import availabilityExceptionRoutes from "../modules/availabilityException/availabilityException.routes.js";
import appointmentRoutes from "../modules/appointment/appointment.routes.js";
import medicalRecordRoutes from "../modules/medicalRecord/medicalRecord.routes.js";
import prescriptionRoutes from "../modules/prescription/prescription.routes.js";
import labResultRoutes from "../modules/labResult/labResult.routes.js";
import invoiceRoutes from "../modules/invoice/invoice.routes.js";
import paymentRoutes from "../modules/payment/payment.routes.js";
import notificationRoutes from "../modules/notification/notification.routes.js";
import adminDashboardRoutes from "../modules/dashboard/adminDashboard.routes.js";
import doctorDashboardRoutes from "../modules/dashboard/doctorDashboard.routes.js";
import patientDashboardRoutes from "../modules/dashboard/patientDashboard.routes.js";

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

export default router;