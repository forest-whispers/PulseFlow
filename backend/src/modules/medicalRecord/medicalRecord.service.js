import MedicalRecord from './medicalRecord.model.js';
import Prescription from "../prescription/prescription.model.js";
import LabResult from "../labResult/labResult.model.js";
import Invoice from "../invoice/invoice.model.js";
import { uploadFile } from "../../utils/uploadFile.js";
import { deleteFile } from "../../utils/deleteFile.js";
import { createAuditLogService } from "../auditLog/auditLog.service.js";
import { NotFoundError, ForbiddenError } from '../../utils/error.js'

export const createMedicalRecordService = async ( currUser, body, files ) => {
    const uploadedAttachments = [];
    if (files?.length) {
        for (const file of files) {
            const uploadedFile = await uploadFile( file, "medical-records", );
            uploadedAttachments.push({
                url: uploadedFile.secure_url,
                publicId: uploadedFile.public_id,
                originalName: file.originalname,
            });
        }
    }
    const medicalRecord = await MedicalRecord.create({ ...body, doctor: currUser.id, attachments: uploadedAttachments, });
    await createAuditLogService( currUser.id, "medical_record_created", "medical_record", medicalRecord._id, {}, );
    return medicalRecord;
};

export const getMedicalRecordService = async ( currUser, medicalRecordId ) => {
    const medicalRecord = await MedicalRecord.findById( medicalRecordId, ).populate("patient", "name").populate("doctor", "name").lean();
    const [prescription, labResult, invoice] = await Promise.all([
        Prescription.findOne({ medicalRecord: medicalRecordId, }).select("_id").lean(),
        LabResult.findOne({ medicalRecord: medicalRecordId, }).select("_id testName").lean(),
        Invoice.findOne({ medicalRecord: medicalRecordId, }).select("_id amount status").lean(),
    ]);
    if (!medicalRecord) {
        throw new NotFoundError("Medical record not found");
    }
    if ( currUser.role === "doctor" && medicalRecord.doctor._id.toString() !== currUser.id ) {
        throw new ForbiddenError( "You cannot access this medical record", );
    }
    if ( currUser.role === "patient" && medicalRecord.patient._id.toString() !== currUser.id ) {
        throw new ForbiddenError( "You cannot access this medical record", );
    }
    return {
        medicalRecord,
        related: {
            prescription,
            labResult,
            invoice,
        },
    };
};

export const getMyMedicalRecordsService = async (currUser,queryParams,) => {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    const [medicalRecords, totalMedicalRecords] = await Promise.all([
            MedicalRecord.find({ patient: currUser._id, }).select("visitDate chiefComplaint diagnosis treatment").populate("doctor", "name").sort({ visitDate: -1, }).skip(skip).limit(limit).lean(),
            MedicalRecord.countDocuments(query),
        ]);
    return {
        medicalRecords,
        pagination: {
            page,
            limit,
            total: totalMedicalRecords,
            totalPages: Math.ceil(
                totalMedicalRecords / limit,
            ),
        },
    };
};

export const updateMedicalRecordService = async ( currUser, medicalRecordId, body ) => {
    const medicalRecord = await MedicalRecord.findById( medicalRecordId, );
    if (!medicalRecord) {
        throw new NotFoundError("Medical record not found");
    }
    if (medicalRecord.doctor.toString() !== currUser.id) {
        throw new ForbiddenError( "You cannot update this medical record", );
    }
    Object.assign(medicalRecord, body);
    await medicalRecord.save();
    await createAuditLogService(currUser.id, "medical_record_updated", "medical_record", medicalRecord._id, {},);
    return medicalRecord;
};

export const deleteMedicalRecordService = async ( currUser, medicalRecordId ) => {
    const medicalRecord = await MedicalRecord.findById( medicalRecordId, );
    if (!medicalRecord) {
        throw new NotFoundError( "Medical record not found", );
    }
    if (medicalRecord.doctor.toString() !== currUser.id) {
        throw new ForbiddenError( "You cannot delete this medical record", );
    }
    for (const attachment of medicalRecord.attachments) {
        await deleteFile( attachment.publicId, );
    }
    await medicalRecord.deleteOne();
    await createAuditLogService(currUser.id, "medical_record_deleted", "medical_record", medicalRecord._id, {},);
};