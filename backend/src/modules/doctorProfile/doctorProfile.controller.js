import { getDoctorProfileService, updateDoctorProfileService } from "./doctorProfile.service.js";

export const getDoctorProfileController = async (req, res, next) => {
    try {
        const profile = await getDoctorProfileService(req.user.id);
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
        const updatedProfile = await updateDoctorProfileService(
            req.user.id,
            req.body,
        );
        res.status(200).json({
            success: true,
            data: updatedProfile,
        });
    } catch (error) {
        next(error);
    }
};