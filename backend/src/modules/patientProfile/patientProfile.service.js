import User from "../user/user.model.js";
import PatientProfile from "./patientProfile.model.js";
import { updateProfilePicture } from "../../utils/updateProfilePicture.js"
import { NotFoundError, BadRequestError } from "../../utils/error.js";

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

export const updatePatientProfilePictureService = async ( patient, file ) => {
    const patientProfile = await PatientProfile.findOne({ user: patient, });
    if (!patientProfile) {
        throw new NotFoundError("Patient profile not found");
    }
    if (!file) {
        throw new BadRequestError("Profile picture is required");
    }
    return await updateProfilePicture( patientProfile, file, "patient-profile-pictures",);
};