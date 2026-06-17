import { createAppointmentService, getAppointmentsService, updateAppointmentStatusService } from "./appointment.service.js";

export const createAppointmentController = async (req, res, next) =>
{
    try {
        const { doctor, appointmentDate, bookedSlot, reason, notes } = req.body;
        const appointment = await createAppointmentService(req.user, { doctor, appointmentDate, bookedSlot, reason, notes,});
        res.status(201).json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        next(error);
    }
};

export const getAppointmentsController = async (req, res, next) =>
{
    try {
        const appointments = await getAppointmentsService(req.user);
        res.status(200).json({
            success: true,
            data: appointments,
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
        data: appointment,
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
                data: appointment,
            });
        } catch (error) {
            next(error);
        }
};