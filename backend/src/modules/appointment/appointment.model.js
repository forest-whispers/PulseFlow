import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        appointmentDate: {
            type: String,
            required: true,
        },

        bookedSlot: {
            type: String,
            required: true,
          },

        status: {
            type: String,
            enum: ["pending", "confirmed", "completed", "pending_reschedule", "cancelled"],
            default: "pending",
        },

        reason: {
            type: String,
            required: true,
            trim: true,
        },

        notes: {
            type: String,
            trim: true,
        },
        reminderSent: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;