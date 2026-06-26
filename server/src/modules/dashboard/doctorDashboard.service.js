import mongoose from "mongoose";

import Appointment from "../appointment/appointment.model.js";

export const getDoctorDashboardService = async (doctorId) => {
    const today = new Date().toISOString().split("T")[0];
    const [todayAppointments, appointmentStats] = await Promise.all([
        Appointment.find({ doctor: doctorId, appointmentDate: today, }).select("patient appointmentDate bookedSlot status reason").populate("patient", "name").sort({ bookedSlot: 1, }).lean(),
        Appointment.aggregate([
            {
                $match: {
                    doctor: new mongoose.Types.ObjectId(doctorId),
                    appointmentDate: today,
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1, },
                },
            },
        ]),
    ]);
    const stats = {
        total: todayAppointments.length,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
    };
    appointmentStats.forEach((stat) => {
        if (stats[stat._id] !== undefined) {
            stats[stat._id] = stat.count;
        }
    });
    return {
        stats,
        todayAppointments,
    };
};