import Prescription from "./prescription.model.js";
import MedicalRecord from "../medicalRecord/medicalRecord.model.js";
import { createAuditLogService } from "../auditLog/auditLog.service.js";
import { NotFoundError, ForbiddenError, ConflictError } from "../../utils/error.js";

export const createPrescriptionService = async (currUser, body) => {
    const medicalRecord = await MedicalRecord.findOne({ appointment: body.appointment, });
    if (!medicalRecord) {
        throw new NotFoundError("Medical record not found");
    }
    if (medicalRecord.doctor.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot create prescription for this medical record");
    }
    const existingPrescription = await Prescription.findOne({ medicalRecord: medicalRecord._id, });
    if (existingPrescription) {
        throw new ConflictError("Prescription already exists");
    }
    const prescription = await Prescription.create({
        ...body,
        patient: medicalRecord.patient,
        doctor: currUser.id,
        medicalRecord: medicalRecord._id,
    });
    await createAuditLogService( currUser.id, "prescription_created", "prescription", prescription._id, {}, );
    return prescription;
}

export const getPrescriptionService = async (currUser, prescriptionId) => {
    const prescription = await Prescription.findById(prescriptionId).populate("patient", "name").populate("doctor", "name").populate({ path: "medicalRecord", select: "visitDate chiefComplaint", }).lean();
    if (!prescription) {
        throw new NotFoundError("Prescription not found");
    }
    if (currUser.role === "doctor" && prescription.doctor._id.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot access this prescription");
    }
    if (currUser.role === "patient" && prescription.patient._id.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot access this prescription");
    }
    return prescription;
};

export const getMyPrescriptionsService = async ( currUser, queryParams ) => {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    const query = { patient: currUser.id };
    const [prescriptions, totalPrescriptions] = await Promise.all([
        Prescription.find(query).select("patient doctor medicalRecord medications createdAt").populate("patient", "name").populate("doctor", "name").populate({ path: "medicalRecord", select: "visitDate chiefComplaint", }) .sort({ createdAt: -1, }).skip(skip).limit(limit).lean(),
            Prescription.countDocuments(query),
        ]);
    const formattedPrescriptions = prescriptions.map(
        ({ medications, ...prescription }) => ({
            ...prescription,
            medicineCount: medications.length,
        }),
    );
    return {
        prescriptions: formattedPrescriptions,
        pagination: {
            page,
            limit,
            total: totalPrescriptions,
            totalPages: Math.ceil(totalPrescriptions / limit),
        },
    };
};

export const updatePrescriptionService = async (currUser, prescriptionId, body) => {
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
        throw new NotFoundError("Prescription not found");
    }
    if (prescription.doctor.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot update this prescription");
    }
    const allowedUpdate = ["notes", "medications"];
    let filteredBody = {};
    allowedUpdate.forEach((field) => {
        if (body[field] !== undefined) {
            filteredBody[field] = body[field];
        }
    });
    Object.assign(prescription, filteredBody);
    await prescription.save();
    await createAuditLogService( currUser.id, "prescription_updated", "prescription", prescription._id, {},
    );
    return prescription;
};

export const deletePrescriptionService = async (currUser, prescriptionId) => {
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
        throw new NotFoundError("Prescription not found");
    }
    if (prescription.doctor.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot delete this prescription");
    }
    await prescription.deleteOne();
    await createAuditLogService( currUser.id, "prescription_deleted", "prescription", prescription._id, {},
    );
};