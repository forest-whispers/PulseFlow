import { getDoctorProfileService, updateDoctorProfileService, updateDoctorProfilePictureService } from "./doctorProfile.service.js";

export const getDoctorProfileController = async (req, res, next) => {
    try {
        const profile = await getDoctorProfileService(req.user);
        res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        next(error);
    }
};

export const updateDoctorProfileController = async (req, res, next) => {
    try {
        const updatedProfile = await updateDoctorProfileService( req.user, req.body, );
        res.status(200).json({
            success: true,
            message: "profile updated",
            data: updatedProfile,
        });
    } catch (error) {
        next(error);
    }
};

export const updateDoctorProfilePictureController = async (req, res) => {
        const updatedProfile = await updateDoctorProfilePictureService( req.user, req.file, );
        res.status(200).json({
            success: true,
            message: "profile picture updated",
            data: updatedProfile,
        });
};