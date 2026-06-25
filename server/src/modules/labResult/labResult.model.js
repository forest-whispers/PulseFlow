import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
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

const labResultSchema = new mongoose.Schema(
    {
        medicalRecord: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MedicalRecord",
            required: true,
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

        testName: {
            type: String,
            required: true,
            trim: true,
        },

        resultSummary: {
            type: String,
            trim: true,
        },

        report: reportSchema,
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("LabResult", labResultSchema);