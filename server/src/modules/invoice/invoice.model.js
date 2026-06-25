import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
            unique: true,
        },

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

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        description: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: ["pending", "paid", "cancelled", "refunded"],
            default: "pending",
        },

        paymentMethod: {
            type: String,
            enum: ["stripe", "cash"],
            default: "stripe",
        },

        stripeSessionId: {
            type: String,
        },

        stripePaymentIntentId: {
            type: String,
        },

        paidAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Invoice", invoiceSchema);