import Appointment from "../appointment/appointment.model.js";
import User from "../user/user.model.js";
import DoctorProfile from "../doctorProfile/doctorProfile.model.js";
import Invoice from "../invoice/invoice.model.js";

const calculateGrowth = (current, previous) => {
    if (previous === 0) {
        return current > 0 ? 100 : 0;
    }
    return Number((((current - previous) / previous) * 100).toFixed(1));
};

export const getAnalyticsService = async (queryParams) => {
    const range = queryParams?.range;
    const today = new Date();
    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 6);
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currentMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1, 0, 23, 59, 59, 999);
    const previousMonthStart = new Date( today.getFullYear(), today.getMonth() - 1, 1, );
    const previousMonthEnd = new Date( today.getFullYear(), today.getMonth(), 0, );
    const [
        users,
        appointmentStats,
        invoiceStats,
        doctorWorkload,
        appointmentsTrend,
        revenueTrend,
        specializations,
        paymentMethods,
        invoiceStatus,
        currentMonthAppointments,
        previousMonthAppointments,
        currentMonthRevenue,
        previousMonthRevenue,
        currentMonthPatients,
        previousMonthPatients,
    ] = await Promise.all([
        User.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            }]),
        Appointment.aggregate([
            {
                $group: {
                    _id: null,
                    totalAppointments: {
                        $sum: 1
                    },
                    completedAppointments: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "completed"] },
                                1,
                                0
                            ]
                        }
                    },
                    pending: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "pending"] },
                                1,
                                0
                            ]
                        }
                    },
                    confirmed: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "confirmed"] },
                                1,
                                0
                            ]
                        }
                    },
                    cancelled: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "cancelled"] },
                                1,
                                0
                            ]
                        }
                    },
                    pendingReschedule: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "pending_reschedule"] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }]),
        Invoice.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "paid"] },
                                "$amount",
                                0
                            ]
                        }
                    },
                    averageInvoice: {
                        $avg: "$amount"
                    },
                    pendingInvoices: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "pending"] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }]),
        Appointment.aggregate([
            {
                $group: {
                    _id: "$doctor",
                    appointments: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    appointments: -1
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "doctor"
                }
            },
            {
                $unwind: "$doctor"
            },
            {
                $project: {
                    _id: 1,
                    doctorName: "$doctor.name",
                    appointments: 1
                }
            }]),
        Appointment.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: last7Days
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    appointments: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }]),
        Invoice.aggregate([
            {
                $match: {
                    status: "paid"
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$paidAt"
                        }
                    },
                    revenue: {
                        $sum: "$amount"
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }]),
        Appointment.aggregate([
            {
                $lookup: {
                    from: "doctorprofiles",
                    localField: "doctor",
                    foreignField: "user",
                    as: "doctorProfile"
                }
            },
            {
                $unwind: "$doctorProfile"
            },
            {
                $group: {
                    _id: "$doctorProfile.specialization",
                    appointments: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    appointments: -1
                }
            }]),
        Invoice.aggregate([
            {
                $group: {
                    _id: "$paymentMethod",
                    count: {
                        $sum: 1
                    }
                }
            }]),
        Invoice.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1
                    }
                }
            }]),
        Appointment.countDocuments({
            createdAt: {
                $gte: currentMonthStart,
                $lte: currentMonthEnd
            }}),
        Appointment.countDocuments({
            createdAt: {
                $gte: previousMonthStart,
                $lte: previousMonthEnd
            }}),
        Invoice.aggregate([
            {
                $match: {
                    status: "paid",
                    paidAt: {
                        $gte: currentMonthStart
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount"
                    }
                }
            }]),
        Invoice.aggregate([
            {
                $match: {
                    status: "paid",
                    paidAt: {
                        $gte: previousMonthStart,
                        $lte: previousMonthEnd
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount"
                    }
                }
            }]),
        User.countDocuments({
            role: "patient",
            createdAt: {
                $gte: currentMonthStart
            }}),
        User.countDocuments({
            role: "patient",
            createdAt: {
                $gte: previousMonthStart,
                $lte: previousMonthEnd
            }}),
    ])
    const doctors = users.find(x => x._id === "doctor")?.count || 0;
    const patients = users.find(x => x._id === "patient")?.count || 0;
    const appointment = appointmentStats[0] || {};
    const invoice = invoiceStats[0] || {};
    const activeDoctors = new Set(await Appointment.distinct("doctor")).size;
    const completionRate = appointment.totalAppointments ? Number(
                (appointment.completedAppointments / appointment.totalAppointments * 100).toFixed(1)) :0;
    return {
        kpis: {
            totalRevenue: invoice.totalRevenue || 0,
            totalAppointments: appointment.totalAppointments || 0,
            completionRate,
            averageConsultationFee: Math.round(invoice.averageInvoice || 0),
            activeDoctors,
            registeredPatients: patients
        },
        appointmentStatusDistribution: {
            pending: appointment.pending || 0,
            confirmed: appointment.confirmed || 0,
            completed: appointment.completedAppointments || 0,
            cancelled: appointment.cancelled || 0,
            pendingReschedule: appointment.pendingReschedule || 0
        },
        appointmentsTrend,
        revenueTrend,
        doctorWorkload,
        topSpecializations: specializations,
        paymentMethods,
        invoiceStatus,
        averageRevenuePerDoctor: activeDoctors ? Number((
            (invoice.totalRevenue || 0) / activeDoctors).toFixed(2)): 0,
        recentGrowth: {
            appointments:
                calculateGrowth( currentMonthAppointments, previousMonthAppointments ),
            revenue:
                calculateGrowth(currentMonthRevenue[0]?.total || 0,previousMonthRevenue[0]?.total || 0),
            patients:
                calculateGrowth(currentMonthPatients,previousMonthPatients)
        }
    };
}