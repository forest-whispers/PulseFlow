import Appointment from "../appointment/appointment.model.js";
import User from "../user/user.model.js";

export const getAdminDashboardService = async () => {
    const userStats = await User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 },
            },
        },
    ]);
    const appointmentStats = await Appointment.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
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
        completed: 0,
        cancelled: 0,
        confirmed: 0,
    };
    appointmentStats.forEach((stat) => {
        appointments[stat._id] = stat.count;
    });
    return {
        users,
        appointments,
    };
};