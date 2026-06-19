import { createLabResultService, getLabResultService, getMyLabResultsService, updateLabResultService, deleteLabResultService, } from "./labResult.service.js";

export const createLabResultController = async (req, res, next) => {
    try {
        const labResult = await createLabResultService(req.user, req.body, req.file);
        res.status(201).json({
            success: true,
            message: "lab result generated",
            data: labResult,
        });
    } catch (error) {
        next(error);
    }
};

export const getLabResultController = async (req, res, next) => {
    try {
        const labResult = await getLabResultService(req.user, req.params.id);
        res.status(200).json({
            success: true,
            data: labResult,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyLabResultsController = async (req, res, next) => {
    try {
        const labResults = await getMyLabResultsService(req.user);
        res.status(200).json({
            success: true,
            data: labResults,
        });
    } catch (error) {
        next(error);
    }
};

export const updateLabResultController = async (req, res, next) => {
    try {
        const labResult = await updateLabResultService(req.user, req.params.id, req.body, req.file);
        res.status(200).json({
            success: true,
            message: "lab result update successful",
            data: labResult,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteLabResultController = async (req, res, next) => {
    try {
        await deleteLabResultService(req.user, req.params.id);
        res.status(204).send({
            success: false,
            message: "lab result deleted",
        });
    } catch (error) {
        next(error);
    }
};