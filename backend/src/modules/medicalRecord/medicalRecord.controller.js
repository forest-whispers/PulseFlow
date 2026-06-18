import { createMedicalRecordService, getMedicalRecordService, getMyMedicalRecordsService, updateMedicalRecordService, deleteMedicalRecordService } from "./medicalRecord.service.js";

export const createMedicalRecordController =async (req, res, next) => {
        try {
            const medicalRecord = await createMedicalRecordService( req.user.id, req.body, req.files, );
            res.status(201).json(medicalRecord);
        } catch {
            next(error);
        }
};

export const getMedicalRecordController = async (req, res, next) => {
        try {
            const medicalRecord = await getMedicalRecordService( req.user, req.params.id, );
            res.status(200).json(medicalRecord);
        } catch {
            next(error);
        }
};

export const getMyMedicalRecordsController = async (req, res, next) => {
        try {
            const medicalRecords = await getMyMedicalRecordsService( req.user.id, );
            res.status(200).json(medicalRecords);
        } catch {
            next(error);
        }
};

export const updateMedicalRecordController = async (req, res, next) => {
        try {
            const medicalRecord = await updateMedicalRecordService( req.user, req.params.id, req.body, );
            res.status(200).json(medicalRecord);
        } catch {
            next(error);
        }
};

export const deleteMedicalRecordController = async (req, res, next) => {
        try {
            await deleteMedicalRecordService( req.user, req.params.id, );
            res.status(204).send();
        } catch {
            next(error);
        }
};