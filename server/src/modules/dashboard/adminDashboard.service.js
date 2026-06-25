import Appointment from "../appointment/appointment.model.js";
import User from "../user/user.model.js";

export const getAdminDashboardService = async () => {
    const [userStats, appointmentStats, recentAppointments] = await Promise.all([
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
            Appointment.find().select("patient doctor appointmentDate bookedSlot status").populate("patient", "name").populate("doctor", "name").sort({ createdAt: -1, }).limit(5).lean(),
        ]);
    const users = {
        doctors: 0,
        patients: 0,
        admins: 0,
    };
    userStats.forEach((stat) => {
        if (stat._id === "doctor") users.doctors = stat.count;
        if (stat._id === "patient") users.patients = stat.count;
        if (stat._id === "admin") users.admins = stat.count;
    });
    const appointments = {
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
    };
    appointmentStats.forEach((stat) => {
        if (appointments[stat._id] !== undefined) {
            appointments[stat._id] = stat.count;
        }
    });
    return {
        users,
        appointments,
        recentAppointments,
    };
};