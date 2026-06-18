import { getPatientProfileService, updatePatientProfileService, updatePatientProfilePictureService } from "./patientProfile.service.js";

export const getPatientProfileController = async (req, res, next) => {
    try {
        const profile = await getPatientProfileService(req.user.id);
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
        const updatedProfile = await updatePatientProfileService( req.user.id, req.body, );
        res.status(200).json({
            success: true,
            data: updatedProfile,
        });
    } catch (error) {
        next(error);
    }
};

export const updatePatientProfilePictureController = async (req, res) => {
        const patient = req.user.id;
        const updatedProfile = await updatePatientProfilePictureService( patient, req.file, );
        res.status(200).json(updatedProfile);
};