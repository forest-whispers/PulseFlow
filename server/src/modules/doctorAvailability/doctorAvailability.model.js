import mongoose from "mongoose";

const doctorAvailabilitySchema = new mongoose.Schema(
    {
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        availableDays: [
            {
                type: String,
                enum: [
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                ],
            },
        ],

        startTime: {
            type: String,
            required: true,
        },

        endTime: {
            type: String,
            required: true,
        },

        slotDuration: {
            type: Number,
            default: 30,
        },

        isActive: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

const DoctorAvailability = mongoose.model("DoctorAvailability", doctorAvailabilitySchema,);
export default DoctorAvailability;