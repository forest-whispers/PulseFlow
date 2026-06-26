import User from "../user/user.model.js";
import PatientProfile from "./patientProfile.model.js";
import { updateProfilePicture } from "../../utils/updateProfilePicture.js"
import { NotFoundError, BadRequestError } from "../../utils/error.js";

export const getPatientProfileService = async (currUser) => {
    let profile = {};
    const basicProfile = await User.findOne({ _id: currUser.id, role: "patient", }).select("name age gender");
    if (!basicProfile) {
        throw new NotFoundError("Patient profile not found");
    }
    const specifics = await PatientProfile.findOne({ user: currUser._id }).select("bloodGroup allergies medicalHistory emergencyContact");
    if(specifics)
    {
        profile = { ...basicProfile, ...specifics };
    }
    else
    {
        profile = basicProfile;
    }
    return profile;
};

export const updatePatientProfileService = async (currUser, updatePayload) => {
    if (Object.keys(updatePayload).length === 0) {
        throw new BadRequestError("No changes detected");
    }
    const allowedBasicsUpdate = ["name", "age", "gender"];
    const allowedSpecificsUpdate = ["bloodGroup", "allergies", "medicalHistory", "emergencyContact"];
    let filteredPayload = {};
    allowedBasicsUpdate.forEach((field) => {
        if (updatePayload[field] !== undefined) {
            filteredPayload[field] = updatePayload[field];
        }
    });
    const basicProfile = await User.findOneAndUpdate(
        {
            _id: currUser.id,
            role: "patient",
        },
        filteredPayload,
        { new: true, runValidators: true },
    );
    if (!basicProfile) {
        throw new NotFoundError("Patient profile not found");
    }
    filteredPayload={};
    allowedSpecificsUpdate.forEach((field) => {
        if (updatePayload[field] !== undefined) {
            filteredPayload[field] = updatePayload[field];
        }
    });
    const specifics = await PatientProfile.findOneAndUpdate(
        {
            user: currUser.id,
        },
        filteredPayload,
        { new: true, runValidators: true },
    );
    let profile={};
    if (specifics) {
        profile = { ...basicProfile, ...specifics };
    }
    else
    {
        profile = basicProfile;
    }
    return profile;
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