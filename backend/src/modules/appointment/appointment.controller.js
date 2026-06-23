import { createAppointmentService, getAppointmentsService, getAppointmentService, updateAppointmentStatusService, cancelAppointmentService } from "./appointment.service.js";

export const createAppointmentController = async (req, res, next) =>
{
    try {
        const { doctor, appointmentDate, bookedSlot, reason, notes } = req.body;
        const appointment = await createAppointmentService(req.user, { doctor, appointmentDate, bookedSlot, reason, notes,});
        res.status(201).json({
            success: true,
            message: "appointment acknowledged",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

export const getAppointmentsController = async (req, res, next) =>
{
    try {
        const query = req.query;
        const appointments = await getAppointmentsService(req.user, query);
        res.status(200).json({
            success: true,
            data: appointments,
        });
    } catch (error) {
        next(error);
    }
};

export const getAppointmentController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const appointment = await getAppointmentService(req.user, id);
        res.status(200).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};

export const updateAppointmentStatusController=async (req, res, next)=>
{
    try{
        const { id }=req.params;
        const { status }=req.body;
        const appointment=await updateAppointmentStatusService(req.user, id, status);
        res.status(200).json({
            success: true,
            message: "status update successful",
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};

export const cancelAppointmentController = async ( req, res, next,) =>
{
    try {
      const { id } = req.params;
      const appointment = await cancelAppointmentService(req.user, id);
      res.status(200).json({
        success: true,
        message: "appointment cancellation successful",
        data: null,
      });
    } catch (error) {
      next(error);
    }
};

export const rescheduleAppointmentController = async (req, res, next) =>
{
        try {
            const { id } = req.params;
            const { appointmentDate, bookedSlot, } = req.body;
            const appointment = await rescheduleAppointmentService( req.user, id, appointmentDate, bookedSlot, );
            res.status(200).json({
                success: true,
                message: "appointment rescedule request has been acknowledged",
                data: appointment,
            });
        } catch (error) {
            next(error);
        }
};