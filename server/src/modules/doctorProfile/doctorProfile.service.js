import User from "../user/user.model.js";
import DoctorProfile from "./doctorProfile.model.js";
import { uploadFile } from "../../utils/uploadFile.js";
import { deleteFile } from "../../utils/deleteFile.js";
import { NotFoundError, BadRequestError } from "../../utils/error.js";

export const getDoctorProfileService = async (currUser) => {
    const profile = await DoctorProfile.findOne({ user: currUser.id }).populate("user", "name age gender");
    if (!profile) {
        throw new NotFoundError("Doctor profile not found");
    }
    const flattenedProfile = {
        ...profile.user,
        specialization: profile.specialization,
        experience: profile.experience,
        consultationFee: profile.consultationFee,
        clinicAddress: profile.clinicAddress,
        profilePicture: profile.profilePicture,
        bio: profile.bio,
      };
    return flattenedProfile;
};

export const updateDoctorProfileService = async (currUser, updatePayload) => {
    if (Object.keys(updatePayload).length === 0) {
        throw new BadRequestError("No changes detected");
    }
    const allowedBasicsUpdate = ["name", "age", "gender"];
    const allowedSpecificsUpdate = ["specialization", "experience", "consultationFee", "clinicAddress", "bio"];
    let filteredPayload = {};
    allowedBasicsUpdate.forEach((field) => {
        if (updatePayload[field] !== undefined) {
            filteredPayload[field] = updatePayload[field];
        }
    });
    const basicProfile = await User.findOneAndUpdate(
        {
            _id: currUser.id,
            role: "doctor",
        },
        filteredPayload,
        { new: true, runValidators: true },
    );
    if (!basicProfile) {
        throw new NotFoundError("Something went wrong");
    }
    filteredPayload={};
    allowedSpecificsUpdate.forEach((field) => {
        if (updatePayload[field] !== undefined) {
            filteredPayload[field] = updatePayload[field];
        }
    });
    const specifics = await DoctorProfile.findOneAndUpdate(
        {
            user: currUser.id,
        },
        filteredPayload,
        { new: true, runValidators: true },
    );
    if (!specifics) {
        throw new NotFoundError("Doctor profile not found");
    }
    const profile = { ...basicProfile, ...specifics };
    return profile;
};

export const updateDoctorProfilePictureService = async ( currUser, file ) => {
    const doctorProfile = await DoctorProfile.findOne({ user: currUser.id, });
    if (!doctorProfile) {
        throw new NotFoundError("Doctor profile not found");
    }
    if (!file) {
        throw new BadRequestError("Profile picture is required");
    }
    return await updateProfilePicture( doctorProfile, file, "doctor-profile-pictures",);
};