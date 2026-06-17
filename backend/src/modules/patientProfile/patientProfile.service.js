import User from "../user/user.model.js";
import { NotFoundError } from "../../utils/error.js";

export const getPatientProfileService = async (patient) => {
    const profile = await User.findOne({  _id: patient, role: "patient", });
    if (!profile) {
        throw new NotFoundError("Patient profile not found");
    }
    return profile;
};

export const updatePatientProfileService = async (patient, updatePayload) => {
    const allowedUpdates = ["name", "age", "gender"];
    const filteredPayload = {};
    allowedUpdates.forEach((field) => {
        if (updatePayload[field] !== undefined) {
            filteredPayload[field] = updatePayload[field];
        }
    });
    const updatedProfile = await User.findOneAndUpdate(
        {
            _id: patient,
            role: "patient",
        },
        filteredPayload,
        { new: true, runValidators: true },
    );
    if (!updatedProfile) {
        throw new NotFoundError("Patient profile not found");
    }
    return updatedProfile;
};