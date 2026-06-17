import mongoose from "mongoose";

const availabilityExceptionSchema = new mongoose.Schema(
    {
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        blockedDate: {
            type: String,
            required: true,
        },
        reason: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

const AvailabilityException = mongoose.model( "AvailabilityException", availabilityExceptionSchema );
export default AvailabilityException;