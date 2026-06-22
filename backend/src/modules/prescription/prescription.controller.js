import { createPrescriptionService, getPrescriptionService, getMyPrescriptionsService, updatePrescriptionService, deletePrescriptionService } from "./prescription.service.js";

export const createPrescriptionController = async (req, res, next) => {
    try {
        const prescription = await createPrescriptionService(req.user, req.body);
        res.status(201).json({
            success: true,
            message: "prescription designed",
            data: prescription,
        });
    } catch (error) {
        next(error);
    }
};

export const getPrescriptionController = async (req, res, next) => {
    try {
        const prescription = await getPrescriptionService(req.user, req.params.id);
        res.status(200).json({
            success: true,
            data: prescription,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyPrescriptionsController = async (req, res, next) => {
    try {
        const prescriptions = await getMyPrescriptionsService(req.user, req.query);
        res.status(200).json({
            success: true,
            data: prescriptions,
        });
    } catch (error) {
        next(error);
    }
};

export const updatePrescriptionController = async (req, res, next) => {
    try {
        const prescription = await updatePrescriptionService(req.user, req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "prescription changed",
            data: prescription,
        });
    } catch (error) {
        next(error);
    }
};

export const deletePrescriptionController = async (req, res, next) => {
    try {
        await deletePrescriptionService(req.user, req.params.id);
        res.status(204).send({
            success: false,
            message: "prescription deleted",
        });
    } catch (error) {
        next(error);
    }
};