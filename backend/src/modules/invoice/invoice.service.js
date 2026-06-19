import Invoice from "./invoice.model.js";
import Appointment from "../appointment/appointment.model.js";
import { createAuditLogService } from "../auditLog/auditLog.service.js";
import { NotFoundError, ForbiddenError, ConflictError, BadRequestError } from "../../utils/error.js";

export const createInvoiceService = async (currUser, body) => {
    const appointment = await Appointment.findById(body.appointment);
    if (!appointment) {
        throw new NotFoundError("Appointment not found");
    }
    if (appointment.doctor.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot create invoice for this appointment");
    }
    if (appointment.status !== "completed") {
        throw new BadRequestError("Invoice can only be created for completed appointments");
    }
    const existingInvoice = await Invoice.findOne({ appointment: appointment._id });
    if (existingInvoice) {
        throw new ConflictError("Invoice already exists for this appointment");
    }
    const invoice = await Invoice.create({
        appointment: appointment._id,
        patient: appointment.patient,
        doctor: appointment.doctor,
        amount: body.amount,
        description: body.description,
        paymentMethod: body.paymentMethod,
    });
    await createAuditLogService(currUser.id, "invoice_created", "invoice", invoice._id, {});
    return invoice;
};

export const getInvoiceService = async (currUser, invoiceId) => {
    const invoice = await Invoice.findById(invoiceId).populate("appointment", "appointmentDate bookedSlot status").populate("patient", "name email").populate("doctor", "name email");
    if (!invoice) {
        throw new NotFoundError("Invoice not found");
    }
    if (currUser.role === "doctor" && invoice.doctor._id.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot access this invoice");
    }
    if (currUser.role === "patient" && invoice.patient._id.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot access this invoice");
    }
    return invoice;
};

export const getMyInvoicesService = async (currUser) => {
    if (currUser.role === "patient") {
        return await Invoice.find({ patient: currUser.id }).populate("appointment", "appointmentDate bookedSlot status").populate("doctor", "name email").sort({ createdAt: -1 });
    }
    return await Invoice.find({ doctor: currUser.id }).populate("appointment", "appointmentDate bookedSlot status").populate("patient", "name email").sort({ createdAt: -1 });
};

export const updateInvoiceService = async (currUser, invoiceId, body) => {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
        throw new NotFoundError("Invoice not found");
    }
    if (invoice.doctor.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot update this invoice");
    }
    if (invoice.status === "paid") {
        throw new BadRequestError("Paid invoice cannot be updated");
    }
    if (body.amount !== undefined) {
        invoice.amount = body.amount;
    }
    if (body.description !== undefined) {
        invoice.description = body.description;
    }
    await invoice.save();
    await createAuditLogService(currUser.id, "invoice_updated", "invoice", invoice._id, {});
    return invoice;
};

export const deleteInvoiceService = async (currUser, invoiceId) => {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
        throw new NotFoundError("Invoice not found");
    }
    if (invoice.doctor.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot delete this invoice");
    }
    if (invoice.status === "paid") {
        throw new BadRequestError("Paid invoice cannot be deleted");
    }
    await invoice.deleteOne();
    await createAuditLogService(currUser.id, "invoice_deleted", "invoice", invoice._id, {});
};