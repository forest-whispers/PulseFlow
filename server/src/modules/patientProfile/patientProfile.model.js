import mongoose from "mongoose";

const patientProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        profilePicture: {
            url: {
                type: String,
            },

            publicId: {
                type: String,
            },
        },

        bloodGroup: {
            type: String,
            trim: true,
        },

        allergies: [
            {
                type: String,
                trim: true,
            },
        ],

        medicalHistory: {
            type: String,
            trim: true,
        },

        emergencyContact: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

const PatientProfile = mongoose.model("PatientProfile",patientProfileSchema,);
export default PatientProfile;