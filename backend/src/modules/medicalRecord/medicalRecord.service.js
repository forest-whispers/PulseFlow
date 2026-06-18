import MedicalRecord from './medicalRecord.model.js';
import { uploadFile } from "../../utils/uploadFile.js";
import { deleteFile } from "../../utils/deleteFile.js";
import { createAuditLogService } from "../auditLog/auditLog.service.js";
import { NotFoundError, ForbideenError } from '../../utils/error.js'

export const createMedicalRecordService = async ( doctor, body, files ) => {
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
    const medicalRecord = await MedicalRecord.create({ ...body, doctor, attachments: uploadedAttachments, });
    await createAuditLogService( doctor, "medical_record_created", "medical_record", medicalRecord._id, {}, );
    return medicalRecord;
};

export const getMedicalRecordService = async ( medicalRecordId ) => {
    return await MedicalRecord.findById( medicalRecordId, ).populate("patient", "name email").populate("doctor", "name email");
};

export const getMedicalRecordService = async ( currUser, medicalRecordId ) => {
    const medicalRecord = await MedicalRecord.findById( medicalRecordId, ).populate("patient", "name email").populate("doctor", "name email");
    if (!medicalRecord) {
        throw new NotFoundError("Medical record not found");
    }
    if ( currUser.role === "doctor" && medicalRecord.doctor._id.toString() !== currUser.id ) {
        throw new ForbiddenError( "You cannot access this medical record", );
    }
    if ( currUser.role === "patient" && medicalRecord.patient._id.toString() !== currUser.id ) {
        throw new ForbiddenError( "You cannot access this medical record", );
    }
    return medicalRecord;
};

export const getMyMedicalRecordsService = async ( patient ) => {
    return await MedicalRecord.find({ patient, }).populate("doctor", "name email").sort({ createdAt: -1, });
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
    return medicalRecord;
    const updatedMedicalRecord = await MedicalRecord.findByIdAndUpdate( medicalRecordId, body, { new: true, runValidators: true, }, );
    if (!updatedMedicalRecord) {
        throw new NotFoundError( "Medical record not found", );
    }
    return updatedMedicalRecord;
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
};