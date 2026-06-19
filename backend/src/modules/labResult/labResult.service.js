import LabResult from "./labResult.model.js";
import MedicalRecord from "../medicalRecord/medicalRecord.model.js";
import { uploadFile } from "../../utils/uploadFile.js";
import { deleteFile } from "../../utils/deleteFile.js";
import { createAuditLogService } from "../auditLog/auditLog.service.js";
import { NotFoundError, ForbiddenError } from "../../utils/error.js";

export const createLabResultService = async (currUser, body, file) => {
    const medicalRecord = await MedicalRecord.findById(body.medicalRecord);
    if (!medicalRecord) {
        throw new NotFoundError("Medical record not found");
    }
    if (medicalRecord.doctor.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot create lab result for this medical record");
    }
    let report;
    if (file) {
        const uploadedFile = await uploadFile(file, "lab-results");
        report = {
            url: uploadedFile.secure_url,
            publicId: uploadedFile.public_id,
            originalName: file.originalname,
        };
    }
    const labResult = await LabResult.create({
        ...body,
        patient: medicalRecord.patient,
        doctor: currUser.id,
        report,
    });
    await createAuditLogService(currUser.id, "lab_result_created", "lab_result", labResult._id, {});
    return labResult;
};

export const getLabResultService = async (currUser, labResultId) => {
    const labResult = await LabResult.findById(labResultId).populate("patient", "name email").populate("doctor", "name email").populate("medicalRecord");
    if (!labResult) {
        throw new NotFoundError("Lab result not found");
    }
    if (currUser.role === "doctor" && labResult.doctor._id.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot access this lab result");
    }
    if (currUser.role === "patient" && labResult.patient._id.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot access this lab result");
    }
    return labResult;
};

export const getMyLabResultsService = async (currUser) => {
    if (currUser.role === "patient") {
        return await LabResult.find({ patient: currUser.id }).populate("doctor", "name email").populate("medicalRecord").sort({ createdAt: -1 });
    }
    return await LabResult.find({ doctor: currUser.id }).populate("patient", "name email").populate("medicalRecord").sort({ createdAt: -1 });
};

export const updateLabResultService = async (currUser, labResultId, body, file) => {
    const labResult = await LabResult.findById(labResultId);
    if (!labResult) {
        throw new NotFoundError("Lab result not found");
    }
    if (labResult.doctor.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot update this lab result");
    }
    if (file) {
        if (labResult.report?.publicId) {
            await deleteFile(labResult.report.publicId);
        }
        const uploadedFile = await uploadFile(file, "lab-results");
        labResult.report = {
            url: uploadedFile.secure_url,
            publicId: uploadedFile.public_id,
            originalName: file.originalname,
        };
    }
    Object.assign(labResult, body);
    await labResult.save();
    await createAuditLogService(currUser.id, "lab_result_updated", "lab_result", labResult._id, {});
    return labResult;
};

export const deleteLabResultService = async (currUser, labResultId) => {
    const labResult = await LabResult.findById(labResultId);
    if (!labResult) {
        throw new NotFoundError("Lab result not found");
    }
    if (labResult.doctor.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot delete this lab result");
    }
    if (labResult.report?.publicId) {
        await deleteFile(labResult.report.publicId);
    }
    await labResult.deleteOne();
    await createAuditLogService(currUser.id, "lab_result_deleted", "lab_result", labResult._id, {});
}