import { createPrescriptionService, getPrescriptionService, getMyPrescriptionsService, updatePrescriptionService, deletePrescriptionService } from "./prescription.service.js";

export const createPrescriptionController = async (req, res, next) => {
    try {
        const prescription = await createPrescriptionService(req.user, req.body);
        res.status(201).json(prescription);
    } catch (error) {
        next(error);
    }
};

export const getPrescriptionController = async (req, res, next) => {
    try {
        const prescription = await getPrescriptionService(req.user, req.params.id);
        res.status(200).json(prescription);
    } catch (error) {
        next(error);
    }
};

export const getMyPrescriptionsController = async (req, res, next) => {
    try {
        const prescriptions = await getMyPrescriptionsService(req.user);
        res.status(200).json(prescriptions);
    } catch (error) {
        next(error);
    }
};

export const updatePrescriptionController = async (req, res, next) => {
    try {
        const prescription = await updatePrescriptionService(req.user, req.params.id, req.body);
        res.status(200).json(prescription);
    } catch (error) {
        next(error);
    }
};

export const deletePrescriptionController = async (req, res, next) => {
    try {
        await deletePrescriptionService(req.user, req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};