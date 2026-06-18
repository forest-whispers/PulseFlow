import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        specialization: {
            type: String,
            required: true,
            trim: true,
        },

        experience: {
            type: Number,
            default: 0,
        },

        consultationFee: {
            type: Number,
            default: 0,
        },

        clinicAddress: {
            type: String,
            trim: true,
        },

        profilePicture: {
            url: {
                type: String,
            },

            publicId: {
                type: String,
            },
        },

        bio: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

const DoctorProfile = mongoose.model("DoctorProfile",doctorProfileSchema,);
export default DoctorProfile;