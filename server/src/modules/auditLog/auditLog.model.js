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