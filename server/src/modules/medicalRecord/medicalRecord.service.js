import MedicalRecord from './medicalRecord.model.js';
import Prescription from "../prescription/prescription.model.js";
import LabResult from "../labResult/labResult.model.js";
import Invoice from "../invoice/invoice.model.js";
import Appointment from "../appointment/appointment.model.js";
import { uploadFile } from "../../utils/uploadFile.js";
import { deleteFile } from "../../utils/deleteFile.js";
import { createAuditLogService } from "../auditLog/auditLog.service.js";
import { NotFoundError, ConflictError, ForbiddenError, BadRequestError } from '../../utils/error.js'

export const createMedicalRecordService = async ( currUser, body, files ) => {
    const existingRecord = await MedicalRecord.findOne({ appointment: body.appointment, });
    if (existingRecord) {
        throw new ConflictError("Medical record already exists for this appointment");
    }
    const appointment = await Appointment.findById(body.appointment);
    if (!appointment) {
        throw new NotFoundError("Appointment not found");
    }
    if (appointment.doctor.toString() !== currUser.id) {
        
    }
    const allowedStatuses = ["confirmed", "completed"];
    if(!allowedStatuses.includes(appointment.status))
    {
        throw new BadRequestError("Medical Record cannot be created for an appointment in states other than confirmed and completed");
    }
    const uploadedAttachments = [];
    if (files && files.length > 0) {
        for (const file of files) {
            const uploadedFile = await uploadFile( file, "medical-records", );
            uploadedAttachments.push({
                url: uploadedFile.secure_url,
                publicId: uploadedFile.public_id,
                originalName: file.originalname,
            });
        }
    }
    const medicalRecord = await MedicalRecord.create({ ...body, doctor: currUser.id, patient: appointment.patient, appointment: appointment._id, attachments: uploadedAttachments, });
    await createAuditLogService( currUser.id, "medical_record_created", "medical_record", medicalRecord._id, {}, );
    return medicalRecord;
};

export const getMedicalRecordService = async ( currUser, medicalRecordId ) => {
    const medicalRecord = await MedicalRecord.findById(medicalRecordId).populate("patient", "name").populate("doctor", "name").populate("appointment", "appointmentDate bookedSlot status").lean();
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
    const query = { patient: currUser.id };
    const [medicalRecords, totalMedicalRecords] = await Promise.all([
        MedicalRecord.find(query).select("appointment patient doctor visitDate chiefComplaint diagnosis treatment").populate("patient", "name").populate("doctor", "name").populate("appointment", "appointmentDate bookedSlot status").sort({ visitDate: -1, }).skip(skip).limit(limit).lean(),
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

export const updateMedicalRecordService = async ( currUser, medicalRecordId, body, files ) => {
    const medicalRecord = await MedicalRecord.findById( medicalRecordId );
    if (!medicalRecord) {
        throw new NotFoundError("Medical record not found");
    }
    if (medicalRecord.doctor.toString() !== currUser.id) {
        throw new ForbiddenError( "You cannot update this medical record", );
    }
    let uploadedAttachments = [];
    if (files && files.length > 0) {
        for (const file of files) {
            const uploadedFile = await uploadFile(file, "medical-records",);
            uploadedAttachments.push({
                url: uploadedFile.secure_url,
                publicId: uploadedFile.public_id,
                originalName: file.originalname,
            });
        }
    }
    if (medicalRecord.attachments && medicalRecord.attachments.length > 0)
    {
        uploadedAttachments = [...uploadedAttachments, ...medicalRecord.attachments];
    }
    const allowedUpdate = ["chiefComplaint", "diagnosis", "treatment", "notes"];
    let filteredBody = {};
    allowedUpdate.forEach((field) => {
        if (body[field] !== undefined) {
            filteredBody[field] = body[field];
        }
    });
    Object.assign(medicalRecord, { ...filteredBody, attachments: uploadedAttachments });
    await medicalRecord.save();
    await createAuditLogService(currUser.id, "medical_record_updated", "medical_record", medicalRecord._id, {},);
    return medicalRecord;
};

export const deleteMedicalRecordService = async ( currUser, medicalRecordId ) => {
    const medicalRecord = await MedicalRecord.findById( medicalRecordId );
    if (!medicalRecord) {
        throw new NotFoundError( "Medical record not found", );
    }
    if (medicalRecord.doctor.toString() !== currUser.id) {
        throw new ForbiddenError( "You cannot delete this medical record", );
    }
    const [prescription, labResult, invoice] = await Promise.all([
        Prescription.findOne({ medicalRecord: medicalRecordId }).select("_id"),
        LabResult.findOne({ medicalRecord: medicalRecordId }).select("_id"),
        Invoice.findOne({ medicalRecord: medicalRecordId }).select("_id"),
    ]);
    if(prescription)
    {
        throw new BadRequestError("This medical record cannot be deleted because an associated prescription exists.");
    }
    if(labResult)
    {
        throw new BadRequestError("This medical record cannot be deleted because an associated lab result exists.");
    }
    if(invoice)
    {
        throw new BadRequestError("This medical record cannot be deleted because an associated invoice exists.");
    }
    for (const attachment of medicalRecord.attachments) {
        await deleteFile( attachment.publicId, );
    }
    await medicalRecord.deleteOne();
    await createAuditLogService(currUser.id, "medical_record_deleted", "medical_record", medicalRecord._id, {},);
};