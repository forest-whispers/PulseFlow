import { getPatientProfileService, updatePatientProfileService, updatePatientProfilePictureService } from "./patientProfile.service.js";

export const getPatientProfileController = async (req, res, next) => {
    try {
        const profile = await getPatientProfileService(req.user);
        res.status(200).json({
            success: true,
            data: profile,
        });
    } catch (error) {
        next(error);
    }
};

export const updatePatientProfileController = async (req, res, next) => {
    try {
        const updatedProfile = await updatePatientProfileService( req.user, req.body, );
        res.status(200).json({
            success: true,
            message: "profile updated",
            data: updatedProfile,
        });
    } catch (error) {
        next(error);
    }
};

export const updatePatientProfilePictureController = async (req, res) => {
        const updatedProfile = await updatePatientProfilePictureService( req.user, req.file, );
        res.status(200).json({
            success: true,
            message: "profile picture updated",
            data: updatedProfile,
        });
};