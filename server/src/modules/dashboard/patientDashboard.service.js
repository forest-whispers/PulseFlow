import mongoose from "mongoose";

import Appointment from "../appointment/appointment.model.js";
import Invoice from "../invoice/invoice.model.js";

export const getPatientDashboardService = async (patientId) => {
    const today = new Date().toISOString().split("T")[0];
    const [ appointmentStats, nextAppointment, pendingInvoiceCount, pendingInvoice, ] = await Promise.all([
        Appointment.aggregate([
            {
                $match: {
                    patient: new mongoose.Types.ObjectId(patientId),
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]),
        Appointment.findOne({ patient: patientId, appointmentDate: { $gte: today }, status: { $ne: "cancelled" }, }).sort({ appointmentDate: 1, bookedSlot: 1, }).populate({ path: "doctor", select: "name",}).select("appointmentDate bookedSlot status doctor",).lean(),
        Invoice.countDocuments({ patient: patientId, status: "pending", }),
        Invoice.findOne({ patient: patientId, status: "pending", }).sort({ createdAt: 1, }).select("amount description status",).lean(),
    ]);
    const stats = {
        upcomingAppointments: 0,
        pendingReschedules: 0,
        pendingInvoices: pendingInvoiceCount,
    };
    appointmentStats.forEach((stat) => {
        switch (stat._id) {
            case "completed": { break; }
            case "pending_reschedule":
                {
                stats.pendingReschedules = stat.count;
                break;
                }
            case "pending": { break; }
            case "confirmed":
                {
                stats.upcomingAppointments += stat.count;
                break;
                }
        }
    });
    return { stats, nextAppointment, pendingInvoice, };
};