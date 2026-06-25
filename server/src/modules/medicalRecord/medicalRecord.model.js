import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },

        publicId: {
            type: String,
            required: true,
        },

        originalName: {
            type: String,
            required: true,
        },
    },
    {
        _id: false,
    },
);

const medicalRecordSchema = new mongoose.Schema(
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

        visitDate: {
            type: String,
            required: true,
        },

        chiefComplaint: {
            type: String,
            required: true,
            trim: true,
        },

        diagnosis: {
            type: String,
            trim: true,
        },

        treatment: {
            type: String,
            trim: true,
        },

        notes: {
            type: String,
            trim: true,
        },

        attachments: [attachmentSchema],
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("MedicalRecord", medicalRecordSchema );