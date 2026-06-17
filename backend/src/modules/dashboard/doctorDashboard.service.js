import Appointment from "../appointment/appointment.model.js";

export const getDoctorDashboardService = async (doctor) => {
    const today = new Date().toISOString().split("T")[0];
    const todayAppointments = await Appointment.find({doctor, appointmentDate: today,}).populate("patient", "name email");
    const appointmentStats = await Appointment.aggregate([
        {
            $match: {
                doctor: new mongoose.Types.ObjectId(doctor),
                appointmentDate: today,
            },
            $group: {
                _id: "$status",
                count: {$sum:1},
            }
        }
    ])
    const stats = {
        pending: 0,
        completed: 0,
        cancelled: 0,
    };
    appointmentStats.forEach((stat)=>
    {
        stats[stat._id]=stat.count;
    })
    return {
        todayAppointments,
        stats,
    };
};