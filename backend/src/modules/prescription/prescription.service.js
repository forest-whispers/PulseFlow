import Prescription from "./prescription.model.js";
import MedicalRecord from "../medicalRecord/medicalRecord.model.js";
import { createAuditLogService } from "../auditLog/auditLog.service.js";
import { NotFoundError, ForbiddenError, ConflictError } from "../../utils/error.js";

export const createPrescriptionService = async (currUser, body) => {
    const medicalRecord = await MedicalRecord.findById(body.medicalRecord);
    if (!medicalRecord) {
        throw new NotFoundError("Medical record not found");
    }
    if (medicalRecord.doctor.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot create prescription for this medical record");
    }
    const existingPrescription = await Prescription.findOne({
        medicalRecord: medicalRecord._id,
    });
    if (existingPrescription) {
        throw new ConflictError("Prescription already exists");
    }
    const prescription = await Prescription.create({
        ...body,
        patient: medicalRecord.patient,
        doctor: currUser.id,
    });
    await createAuditLogService( currUser.id, "prescription_created", "prescription", prescription._id, {}, );
    return prescription;
}

export const getPrescriptionService = async (currUser, prescriptionId) => {
    const prescription = await Prescription.findById(prescriptionId).populate("patient", "name email").populate("doctor", "name email").populate("medicalRecord");
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

export const getMyPrescriptionsService = async (currUser) => {
    if (currUser.role === "patient") {
        return Prescription.find({ patient: currUser.id }).populate("doctor", "name email").populate("medicalRecord").sort({ createdAt: -1 });;
    }
    return Prescription.find({ doctor: currUser.id }).populate("doctor", "name email").populate("medicalRecord").sort({ createdAt: -1 });;
};

export const updatePrescriptionService = async (currUser, prescriptionId, body) => {
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
        throw new NotFoundError("Prescription not found");
    }
    if (prescription.doctor.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot update this prescription");
    }
    Object.assign(prescription, body);
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