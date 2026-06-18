import DoctorProfile from "./doctorProfile.model.js";
import { uploadFile } from "../../utils/uploadFile.js";
import { deleteFile } from "../../utils/deleteFile.js";
import { NotFoundError, BadRequestError } from "../../utils/error.js";

export const getDoctorProfileService = async (doctor) => {
    const profile = await DoctorProfile.findOne({ user: doctor }).populate("user", "name email age gender");
    if (!profile) {
        throw new NotFoundError("Doctor profile not found");
    }
    return profile;
};

export const updateDoctorProfileService = async (doctor, updatePayload) => {
    const updatedProfile = await DoctorProfile.findOneAndUpdate( { user: doctor }, updatePayload, { new: true, runValidators: true }, ).populate("user", "name email age gender");
    if (!updatedProfile) {
        throw new NotFoundError("Doctor profile not found");
    }
    return updatedProfile;
};

export const updateDoctorProfilePictureService = async ( doctor, file ) => {
    const doctorProfile = await DoctorProfile.findOne({ user: doctor, });
    if (!doctorProfile) {
        throw new NotFoundError("Doctor profile not found");
    }
    if (!file) {
        throw new BadRequestError("Profile picture is required");
    }
    return await updateProfilePicture( doctorProfile, file, "doctor-profile-pictures",);
};