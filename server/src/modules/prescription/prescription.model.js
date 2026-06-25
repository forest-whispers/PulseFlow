import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
    {
        medicineName: {
            type: String,
            required: true,
            trim: true,
        },

        dosage: {
            type: String,
            required: true,
            trim: true,
        },

        frequency: {
            type: String,
            required: true,
            trim: true,
        },

        duration: {
            type: String,
            required: true,
            trim: true,
        },

        instructions: {
            type: String,
            trim: true,
        },
    },
    {
        _id: false,
    },
);

const prescriptionSchema = new mongoose.Schema(
    {
        medicalRecord: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MedicalRecord",
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

        medications: {
            type: [medicationSchema],
            validate: {
                validator: (value) => value.length > 0,
                message: "Prescription must contain at least one medication",
            },
        },

        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Prescription", prescriptionSchema);