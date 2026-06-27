import Appointment from "../appointment/appointment.model.js";
import User from "../user/user.model.js";
import Invoice from "../invoice/invoice.model.js";
import { getRecentActivityService } from "../auditLog/auditLog.service.js";

export const getAdminDashboardService = async () => {
    const today = new Date().toISOString().split("T")[0];
    const [userStats, appointmentStats, todayAppointments, upcomingAppointments, pendingInvoices, recentActivity] = await Promise.all([
            User.aggregate([
                {
                    $group: {
                        _id: "$role",
                        count: {
                            $sum: 1,
                        },
                    },
                },
            ]),
            Appointment.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: {
                            $sum: 1,
                        },
                    },
                },
            ]),
            Appointment.countDocuments({ appointmentDate: today }),
            Appointment.find( { status: { $in: ["pending", "confirmed", "pending_reschedule"] }, appointmentDate: { $gte: today }} ).select("patient doctor appointmentDate bookedSlot status").populate("patient", "name").populate("doctor", "name").sort({ appointmentDate: 1, bookedSlot: 1 }).limit(5).lean(),
            Invoice.countDocuments({ status: "pending" }),
            getRecentActivityService(),
            ]);
    const users = {
        doctors: 0,
        patients: 0,
    };
    userStats.forEach((stat) => {
        if (stat._id === "doctor") users.doctors = stat.count;
        if (stat._id === "patient") users.patients = stat.count;
    });
    const appointments = {
        today: todayAppointments,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        pending_reschedule: 0
    };
    appointmentStats.forEach((stat) => {
        if (appointments[stat._id] !== undefined) {
            appointments[stat._id] = stat.count;
        }
    });
    return {
        users,
        appointments,
        revenue: 0,
        invoices: { pendingInvoices },
        upcomingAppointments,
        recentActivity,
    }
};