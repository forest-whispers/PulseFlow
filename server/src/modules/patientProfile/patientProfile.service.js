import User from "../user/user.model.js";
import PatientProfile from "./patientProfile.model.js";
import { updateProfilePicture } from "../../utils/updateProfilePicture.js"
import { NotFoundError, BadRequestError } from "../../utils/error.js";

export const getPatientProfileService = async (currUser) => {
    let profile = {};
    const basicProfile = await User.findOne({ _id: currUser.id, role: "patient", }).select("user", "name age gender");
    if (!basicProfile) {
        throw new NotFoundError("Patient profile not found");
    }
    const specifics = await PatientProfile.findById(currUser._id).select("bloodGroup allergies medicalHistory emergencyContact");
    if(specifics)
    {
        profile = { ...basicProfile, ...specifics };
    }
    return profile;
};

export const updatePatientProfileService = async (currUser, updatePayload) => {
    if(Array.from(updatePayload).length === 0)
    {
        throw new BadRequestError("No changes detected");
    }
    const allowedUpdates = ["name", "age", "gender"];
    const filteredPayload = {};
    allowedUpdates.forEach((field) => {
        if (updatePayload[field] !== undefined) {
            filteredPayload[field] = updatePayload[field];
        }
    });
    const updatedProfile = await User.findOneAndUpdate(
        {
            _id: currUser.id,
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

export const updatePatientProfilePictureService = async ( currUser, file ) => {
    const patientProfile = await PatientProfile.findOne({ user: currUser.id, });
    if (!patientProfile) {
        throw new NotFoundError("Patient profile not found");
    }
    if (!file) {
        throw new BadRequestError("Profile picture is required");
    }
    return await updateProfilePicture( patientProfile, file, "patient-profile-pictures",);
};