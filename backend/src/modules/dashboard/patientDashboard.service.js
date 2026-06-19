import mongoose from "mongoose";

import Appointment from "../appointment/appointment.model.js";

export const getPatientDashboardService = async (patientId) => {
    const today = new Date().toISOString().split("T")[0];
    const upcomingAppointments = await Appointment.find({ patient: patientId, appointmentDate: { $gte: today }, status: { $ne: "cancelled" }, }).populate("doctor", "name email");
    const appointmentStats = await Appointment.aggregate([
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
    ]);
    const stats = {
        completed: 0,
        cancelled: 0,
    };
    appointmentStats.forEach((stat) => {
        if (stats[stat._id] !== undefined) {
            stats[stat._id] = stat.count;
        }
    });
    return {
        upcomingAppointments,
        stats,
    };
};