import LabResult from "./labResult.model.js";
import MedicalRecord from "../medicalRecord/medicalRecord.model.js";
import { uploadFile } from "../../utils/uploadFile.js";
import { deleteFile } from "../../utils/deleteFile.js";
import { createAuditLogService } from "../auditLog/auditLog.service.js";
import { NotFoundError, ForbiddenError } from "../../utils/error.js";

export const createLabResultService = async (currUser, body, file) => {
    const medicalRecord = await MedicalRecord.findOne({ appointment: body.appointment, });
    if (!medicalRecord) {
        throw new NotFoundError("Medical record not found");
    }
    if (medicalRecord.doctor.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot create lab result for this medical record");
    }
    const existingLabResult = await LabResult.findOne({ medicalRecord: medicalRecord._id, });
    if (existingLabResult) {
        throw new ConflictError("Lab Result already exists");
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
        medicalRecord: medicalRecord._id,
        report,
    });
    await createAuditLogService(currUser.id, "lab_result_created", "lab_result", labResult._id, {});
    return labResult;
};

export const getLabResultService = async ( currUser, labResultId,) => {
    const labResult = await LabResult.findById(labResultId).populate("patient", "name").populate("doctor", "name").populate({ path: "medicalRecord", select: "visitDate chiefComplaint", }).lean();
    if (!labResult) {
        throw new NotFoundError("Lab result not found");
    }
    if (currUser.role === "doctor" &&labResult.doctor._id.toString() !== currUser.id) {
        throw new ForbiddenError(
            "You cannot access this lab result",
        );
    }
    if (currUser.role === "patient" &&labResult.patient._id.toString() !== currUser.id) {
        throw new ForbiddenError(
            "You cannot access this lab result",
        );
    }
    return labResult;
};

export const getMyLabResultsService = async ( currUser, queryParams,) => {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    const query = { patient: currUser.id };
    const [labResults, totalLabResults] = await Promise.all([
        LabResult.find(query).select("doctor patient medicalRecord testName resultSummary report createdAt").populate("doctor", "name").populate("patient", "name").populate({ path: "medicalRecord", select: "visitDate chiefComplaint", }).sort({ createdAt: -1, }).skip(skip).limit(limit).lean(),
        LabResult.countDocuments(query),
    ]);
    const formattedLabResults = labResults.map((labResult) => ({
        ...labResult,
        report: {
            url: labResult.report.url,
            originalName: labResult.report.originalName,
        },
    }));
    return {
        labResults: formattedLabResults,
        pagination: {
            page,
            limit,
            total: totalLabResults,
            totalPages: Math.ceil(
                totalLabResults / limit,
            ),
        },
    };
};

export const updateLabResultService = async (currUser, labResultId, body, file) => {
    const labResult = await LabResult.findById(labResultId);
    if (!labResult) {
        throw new NotFoundError("Lab result not found");
    }
    if (labResult.doctor.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot update this lab result");
    }
    const allowedUpdate = ["report", "resultSummary", "testName"];
    let filteredBody = {};
    allowedUpdate.forEach((field) => {
        if (body[field] !== undefined) {
            filteredBody[field] = body[field];
        }
    });
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
    Object.assign(labResult, filteredBody);
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