import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
    {
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        action: {
            type: String,
            required: true,
            enum: [
                "appointment_booked",
                "appointment_cancelled",
                "appointment_rescheduled",
                "appointment_status_updated",
                "availability_exception_deleted",
                "invoice_created",
                "invoice_updated",
                "invoice_deleted",
                "invoice_paid",
                "lab_result_created",
                "lab_result_updated",
                "lab_result_deleted",
                "medical_record_created",
                "medical_record_updated",
                "medical_record_deleted",
                "prescription_created",
                "prescription_updated",
                "prescription_deleted"
            ],
          },

        entityType: {
            type: String,
            required: true,
            trim: true,
        },

        entityId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    },
);

const AuditLog = mongoose.model(
    "AuditLog",
    auditLogSchema,
);
export default AuditLog;