import "./config/env.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import User from "./modules/user/user.model.js";
import DoctorProfile from "./modules/doctorProfile/doctorProfile.model.js";
import PatientProfile from "./modules/patientProfile/patientProfile.model.js";
import DoctorAvailability from "./modules/doctorAvailability/doctorAvailability.model.js";
import AvailabilityException from "./modules/availabilityException/availabilityException.model.js";
import Appointment from "./modules/appointment/appointment.model.js";
import MedicalRecord from "./modules/medicalRecord/medicalRecord.model.js";
import Prescription from "./modules/prescription/prescription.model.js";
import Invoice from "./modules/invoice/invoice.model.js";
import Notification from "./modules/notification/notification.model.js";
import AuditLog from "./modules/auditLog/auditLog.model.js";
import LabResult from "./modules/labResult/labResult.model.js";

// Helper to safely format a Date to YYYY-MM-DD
const formatDateStr = (dateObj) => {
    return dateObj.toISOString().split("T")[0];
};

// Helper to find a date with an offset that matches doctor's active days
const getValidDateForDoctor = (baseOffset, availableDays) => {
    let offset = baseOffset;
    const direction = baseOffset >= 0 ? 1 : -1;
    for (let i = 0; i < 14; i++) {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        const weekday = d.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
        if (availableDays.includes(weekday)) {
            return formatDateStr(d);
        }
        offset += direction;
    }
    return formatDateStr(new Date());
};

// Helper for relative timestamps
const getPastTimestamp = (daysAgo, hoursAgo = 0) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(d.getHours() - hoursAgo);
    return d;
};

export const seedDatabase = async () => {
    console.log("==================================================");
    console.log(" PulseFlow Seed Script: Initializing Execution");
    console.log("==================================================");

    if (mongoose.connection.readyState === 0) {
        console.log("Connecting to MongoDB via MONGO_URI...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connection established.");
    }

    // 1. Flush existing collections
    console.log("\n[1/11] Flushing existing data from collections...");
    await Promise.all([
        User.deleteMany({}),
        DoctorProfile.deleteMany({}),
        PatientProfile.deleteMany({}),
        DoctorAvailability.deleteMany({}),
        AvailabilityException.deleteMany({}),
        Appointment.deleteMany({}),
        MedicalRecord.deleteMany({}),
        Prescription.deleteMany({}),
        Invoice.deleteMany({}),
        Notification.deleteMany({}),
        AuditLog.deleteMany({}),
        LabResult.deleteMany({}),
    ]);
    console.log(" Collections flushed successfully.");

    // 2. Hash default development password
    console.log("\n[2/11] Hashing development password ('admin@123')...");
    const hashedPassword = await bcrypt.hash("admin@123", 10);

    // 3. Create Users (1 Admin, 6 Doctors, 2 Patients)
    console.log("\n[3/11] Seeding User accounts...");
    const adminUser = await User.create({
        name: "Admin User",
        email: "admin@admin.com",
        password: hashedPassword,
        role: "admin",
        age: 38,
        gender: "female",
        createdAt: getPastTimestamp(30),
    });

    const doctorsData = [
        {
            email: "doctor1@doctor.com",
            name: "Dr. Arjun Mehta",
            age: 46,
            gender: "male",
            createdAt: getPastTimestamp(28),
        },
        {
            email: "doctor2@doctor.com",
            name: "Dr. Priya Sharma",
            age: 39,
            gender: "female",
            createdAt: getPastTimestamp(26),
        },
        {
            email: "doctor3@doctor.com",
            name: "Dr. Rahul Verma",
            age: 52,
            gender: "male",
            createdAt: getPastTimestamp(25),
        },
        {
            email: "doctor4@doctor.com",
            name: "Dr. Neha Kapoor",
            age: 36,
            gender: "female",
            createdAt: getPastTimestamp(24),
        },
        {
            email: "doctor5@doctor.com",
            name: "Dr. Vikram Singh",
            age: 44,
            gender: "male",
            createdAt: getPastTimestamp(22),
        },
        {
            email: "doctor6@doctor.com",
            name: "Dr. Ananya Rao",
            age: 41,
            gender: "female",
            createdAt: getPastTimestamp(20),
        },
    ];

    const doctorUsers = [];
    for (const doc of doctorsData) {
        const u = await User.create({
            ...doc,
            password: hashedPassword,
            role: "doctor",
        });
        doctorUsers.push(u);
    }

    const patientUsers = await Promise.all([
        User.create({
            name: "Rohan Malhotra",
            email: "patient1@patient.com",
            password: hashedPassword,
            role: "patient",
            age: 34,
            gender: "male",
            createdAt: getPastTimestamp(25),
        }),
        User.create({
            name: "Sneha Gupta",
            email: "patient2@patient.com",
            password: hashedPassword,
            role: "patient",
            age: 29,
            gender: "female",
            createdAt: getPastTimestamp(22),
        }),
    ]);

    console.log(` Created 1 Admin, ${doctorUsers.length} Doctors, ${patientUsers.length} Patients.`);

    // 4. Create Doctor Profiles & Doctor Availabilities
    console.log("\n[4/11] Seeding Doctor Profiles and Availabilities...");
    const doctorProfilesData = [
        {
            user: doctorUsers[0]._id, // Dr. Arjun Mehta
            specialization: "Cardiology",
            experience: 18,
            consultationFee: 1200,
            clinicAddress: "Heart & Vascular Pavilion, Suite 402, Metro Health Park, Mumbai",
            bio: "Senior Consultant Cardiologist specializing in preventive cardiology, echocardiography, hypertension, and coronary artery disease management.",
            availability: {
                availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
                startTime: "09:00",
                endTime: "17:00",
                slotDuration: 30,
                isActive: true,
            },
        },
        {
            user: doctorUsers[1]._id, // Dr. Priya Sharma
            specialization: "Dermatology",
            experience: 12,
            consultationFee: 800,
            clinicAddress: "Skin & Aesthetic Care Clinic, 2nd Floor, Apex Tower, Bangalore",
            bio: "Board-certified Dermatologist focusing on clinical dermatology, eczema, acne management, and allergic cutaneous manifestations.",
            availability: {
                availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
                startTime: "10:00",
                endTime: "18:00",
                slotDuration: 30,
                isActive: true,
            },
        },
        {
            user: doctorUsers[2]._id, // Dr. Rahul Verma
            specialization: "Neurology",
            experience: 24,
            consultationFee: 1500,
            clinicAddress: "NeuroScience Center, Wing B, City Care Hospital, New Delhi",
            bio: "Leading Neurologist with extensive expertise in stroke rehabilitation, migraine disorders, neuropathies, and cognitive neurological assessments.",
            availability: {
                availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
                startTime: "09:00",
                endTime: "16:00",
                slotDuration: 30,
                isActive: true,
            },
        },
        {
            user: doctorUsers[3]._id, // Dr. Neha Kapoor
            specialization: "Pediatrics",
            experience: 10,
            consultationFee: 700,
            clinicAddress: "Little Bloom Children's Clinic, Sector 14, Gurgaon",
            bio: "Pediatrician dedicated to comprehensive child wellness, developmental milestones, pediatric immunizations, and adolescent preventive care.",
            availability: {
                availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
                startTime: "09:30",
                endTime: "17:30",
                slotDuration: 30,
                isActive: true,
            },
        },
        {
            user: doctorUsers[4]._id, // Dr. Vikram Singh
            specialization: "Orthopedics",
            experience: 16,
            consultationFee: 1000,
            clinicAddress: "Joint & Spine Orthopedic Pavilion, Ring Road, Hyderabad",
            bio: "Orthopedic Surgeon specialized in joint preservation, sports injury rehabilitation, degenerative arthritis, and post-trauma recovery.",
            availability: {
                availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
                startTime: "10:00",
                endTime: "17:00",
                slotDuration: 30,
                isActive: true,
            },
        },
        {
            user: doctorUsers[5]._id, // Dr. Ananya Rao
            specialization: "General Medicine",
            experience: 15,
            consultationFee: 600,
            clinicAddress: "Wellness First Family Clinic, Indiranagar, Pune",
            bio: "Physician in Internal Medicine providing comprehensive adult health examinations, chronic condition care, and lifestyle risk factor mitigation.",
            availability: {
                availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
                startTime: "08:30",
                endTime: "16:30",
                slotDuration: 30,
                isActive: true,
            },
        },
    ];

    for (const item of doctorProfilesData) {
        await DoctorProfile.create({
            user: item.user,
            specialization: item.specialization,
            experience: item.experience,
            consultationFee: item.consultationFee,
            clinicAddress: item.clinicAddress,
            bio: item.bio,
        });

        // Ensure the doctor's available days also include today's weekday so 'today' appointments work reliably on any day
        const todayWeekday = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
        const days = Array.from(new Set([...item.availability.availableDays, todayWeekday]));

        await DoctorAvailability.create({
            doctor: item.user,
            availableDays: days,
            startTime: item.availability.startTime,
            endTime: item.availability.endTime,
            slotDuration: item.availability.slotDuration,
            isActive: item.availability.isActive,
        });
    }

    // Availability exceptions
    await AvailabilityException.create({
        doctor: doctorUsers[1]._id, // Dr. Priya Sharma
        blockedDates: [
            {
                blockedDate: formatDateStr(new Date(Date.now() + 10 * 86400000)),
                reason: "Attending National Dermatology Conference",
            },
        ],
    });

    await AvailabilityException.create({
        doctor: doctorUsers[4]._id, // Dr. Vikram Singh
        blockedDates: [
            {
                blockedDate: formatDateStr(new Date(Date.now() + 14 * 86400000)),
                reason: "Scheduled Hospital Surgical Ward Duty",
            },
        ],
    });

    console.log(` Created 6 Doctor Profiles, 6 Doctor Availabilities, and 2 Availability Exceptions.`);

    // 5. Create Patient Profiles
    console.log("\n[5/11] Seeding Patient Profiles...");
    await PatientProfile.create({
        user: patientUsers[0]._id, // Rohan Malhotra
        bloodGroup: "O+",
        allergies: ["Penicillin", "Dust Mites", "Sulfa drugs"],
        medicalHistory: "Essential hypertension diagnosed in 2023, seasonal allergic rhinitis. Non-smoker, exercises regularly.",
        emergencyContact: "+91 98765 43210 (Pooja Malhotra - Spouse)",
    });

    await PatientProfile.create({
        user: patientUsers[1]._id, // Sneha Gupta
        bloodGroup: "B+",
        allergies: ["Latex", "Peanuts"],
        medicalHistory: "History of recurring migraine with aura, mild contact dermatitis, occasional cervical spine strain.",
        emergencyContact: "+91 98111 22334 (Vikram Gupta - Brother)",
    });
    console.log(` Created 2 Patient Profiles with clinical allergies and history.`);

    // 6. Create Realistic Appointments (20 total)
    console.log("\n[6/11] Seeding 20 Appointments across doctors and patients...");
    const todayStr = formatDateStr(new Date());

    const doc1Days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const doc2Days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const doc3Days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const doc4Days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const doc5Days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const doc6Days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    // Date computation ensuring doctor availability:
    const d1_past1 = getValidDateForDoctor(-12, doc1Days);
    const d1_past2 = getValidDateForDoctor(-4, doc1Days);
    const d1_future = getValidDateForDoctor(3, doc1Days);

    const d2_past1 = getValidDateForDoctor(-14, doc2Days);
    const d2_past2 = getValidDateForDoctor(-6, doc2Days);
    const d2_future = getValidDateForDoctor(2, doc2Days);

    const d3_past1 = getValidDateForDoctor(-9, doc3Days);
    const d3_past2 = getValidDateForDoctor(-2, doc3Days);
    const d3_cancelled = getValidDateForDoctor(-8, doc3Days);

    const d4_past1 = getValidDateForDoctor(-10, doc4Days);
    const d4_reschedule = getValidDateForDoctor(4, doc4Days);

    const d5_past1 = getValidDateForDoctor(-11, doc5Days);
    const d5_past2 = getValidDateForDoctor(-3, doc5Days);

    const d6_past1 = getValidDateForDoctor(-13, doc6Days);
    const d6_past2 = getValidDateForDoctor(-5, doc6Days);
    const d6_past3 = getValidDateForDoctor(-7, doc6Days);
    const d6_future1 = getValidDateForDoctor(1, doc6Days);
    const d6_future2 = getValidDateForDoctor(5, doc6Days);

    const appointmentsConfig = [
        // Doctor 1 (Cardiology) - Dr. Arjun Mehta
        {
            key: "appt1",
            patient: patientUsers[0]._id, // Rohan
            doctor: doctorUsers[0]._id,
            appointmentDate: d1_past1,
            bookedSlot: "10:00",
            status: "completed",
            reason: "Routine cardiovascular checkup and blood pressure monitoring",
            notes: "Patient reporting occasional palpitations during exertion.",
            createdAt: getPastTimestamp(14),
        },
        {
            key: "appt2",
            patient: patientUsers[0]._id, // Rohan
            doctor: doctorUsers[0]._id,
            appointmentDate: d1_past2,
            bookedSlot: "10:30",
            status: "completed",
            reason: "Follow-up consultation for hypertension medication adjustment",
            notes: "Reviewing response to prescribed antihypertensive therapy.",
            createdAt: getPastTimestamp(6),
        },
        {
            key: "appt3",
            patient: patientUsers[0]._id, // Rohan
            doctor: doctorUsers[0]._id,
            appointmentDate: d1_future,
            bookedSlot: "11:00",
            status: "confirmed",
            reason: "Cardiac stress test evaluation and resting ECG review",
            notes: "Bring previous test records and diagnostic reports.",
            createdAt: getPastTimestamp(2),
        },

        // Doctor 2 (Dermatology) - Dr. Priya Sharma
        {
            key: "appt4",
            patient: patientUsers[1]._id, // Sneha
            doctor: doctorUsers[1]._id,
            appointmentDate: d2_past1,
            bookedSlot: "11:30",
            status: "completed",
            reason: "Skin allergy rash on forearm with severe pruritus",
            notes: "Suspected acute contact dermatitis from household cleaning chemical.",
            createdAt: getPastTimestamp(15),
        },
        {
            key: "appt5",
            patient: patientUsers[1]._id, // Sneha
            doctor: doctorUsers[1]._id,
            appointmentDate: d2_past2,
            bookedSlot: "14:00",
            status: "completed",
            reason: "Dermatological checkup for facial eczema flare-up",
            notes: "Evaluate response to topical barrier repair moisturizers.",
            createdAt: getPastTimestamp(8),
        },
        {
            key: "appt6",
            patient: patientUsers[0]._id, // Rohan
            doctor: doctorUsers[1]._id,
            appointmentDate: d2_future,
            bookedSlot: "15:00",
            status: "pending",
            reason: "Persistent skin peeling and seasonal dermatitis consult",
            notes: "Symptoms worsen in dry air conditioned environments.",
            createdAt: getPastTimestamp(1),
        },

        // Doctor 3 (Neurology) - Dr. Rahul Verma
        {
            key: "appt7",
            patient: patientUsers[1]._id, // Sneha
            doctor: doctorUsers[2]._id,
            appointmentDate: d3_past1,
            bookedSlot: "10:00",
            status: "completed",
            reason: "Chronic migraine with visual aura episodes",
            notes: "Patient completed 30-day headache diary for assessment.",
            createdAt: getPastTimestamp(11),
        },
        {
            key: "appt8",
            patient: patientUsers[1]._id, // Sneha
            doctor: doctorUsers[2]._id,
            appointmentDate: d3_past2,
            bookedSlot: "11:00",
            status: "completed",
            reason: "Neurological review of migraine prophylactic therapy",
            notes: "Frequency reduced substantially from 4 attacks/week to 1.",
            createdAt: getPastTimestamp(4),
        },
        {
            key: "appt9",
            patient: patientUsers[1]._id, // Sneha
            doctor: doctorUsers[2]._id,
            appointmentDate: todayStr, // TODAY
            bookedSlot: "14:30",
            status: "confirmed",
            reason: "Follow-up neurological assessment and cranial reflex check",
            notes: "Routine quarterly evaluation.",
            createdAt: getPastTimestamp(1),
        },
        {
            key: "appt10",
            patient: patientUsers[0]._id, // Rohan
            doctor: doctorUsers[2]._id,
            appointmentDate: d3_cancelled,
            bookedSlot: "15:00",
            status: "cancelled",
            reason: "Tension headache and sleep disturbance consultation",
            notes: "Appointment cancelled by patient due to urgent family travel.",
            createdAt: getPastTimestamp(10),
        },

        // Doctor 4 (Pediatrics) - Dr. Neha Kapoor
        {
            key: "appt11",
            patient: patientUsers[0]._id, // Rohan
            doctor: doctorUsers[3]._id,
            appointmentDate: d4_past1,
            bookedSlot: "10:00",
            status: "completed",
            reason: "Family pediatric wellness and nutrition advisory consultation",
            notes: "Discussion on developmental milestones and seasonal immunizations.",
            createdAt: getPastTimestamp(12),
        },
        {
            key: "appt12",
            patient: patientUsers[1]._id, // Sneha
            doctor: doctorUsers[3]._id,
            appointmentDate: d4_reschedule,
            bookedSlot: "11:30",
            status: "pending_reschedule",
            reason: "Pediatric allergy advisory and immunization consultation",
            notes: "Patient requested reschedule due to transportation conflict.",
            createdAt: getPastTimestamp(3),
        },

        // Doctor 5 (Orthopedics) - Dr. Vikram Singh
        {
            key: "appt13",
            patient: patientUsers[1]._id, // Sneha
            doctor: doctorUsers[4]._id,
            appointmentDate: d5_past1,
            bookedSlot: "14:00",
            status: "completed",
            reason: "Persistent cervical neck strain and upper back stiffness",
            notes: "Ergonomic evaluation and cervical spine mobility review.",
            createdAt: getPastTimestamp(13),
        },
        {
            key: "appt14",
            patient: patientUsers[1]._id, // Sneha
            doctor: doctorUsers[4]._id,
            appointmentDate: d5_past2,
            bookedSlot: "15:30",
            status: "completed",
            reason: "Follow-up orthopedic assessment of cervical range of motion",
            notes: "Noted significant 70% reduction in neck stiffness.",
            createdAt: getPastTimestamp(5),
        },
        {
            key: "appt15",
            patient: patientUsers[0]._id, // Rohan
            doctor: doctorUsers[4]._id,
            appointmentDate: todayStr, // TODAY
            bookedSlot: "11:00",
            status: "confirmed",
            reason: "Right knee joint discomfort during morning jogs",
            notes: "Mild patellofemoral pain syndrome suspected.",
            createdAt: getPastTimestamp(1),
        },

        // Doctor 6 (General Medicine) - Dr. Ananya Rao
        {
            key: "appt16",
            patient: patientUsers[0]._id, // Rohan
            doctor: doctorUsers[5]._id,
            appointmentDate: d6_past1,
            bookedSlot: "09:30",
            status: "completed",
            reason: "Annual comprehensive physical examination and metabolic screening",
            notes: "Fasting lipid panel and 25-OH Vitamin D blood work ordered.",
            createdAt: getPastTimestamp(15),
        },
        {
            key: "appt17",
            patient: patientUsers[0]._id, // Rohan
            doctor: doctorUsers[5]._id,
            appointmentDate: d6_past2,
            bookedSlot: "10:00",
            status: "completed",
            reason: "Review of comprehensive laboratory blood panel",
            notes: "Serum Vitamin D deficiency detected; all other parameters normal.",
            createdAt: getPastTimestamp(7),
        },
        {
            key: "appt18",
            patient: patientUsers[1]._id, // Sneha
            doctor: doctorUsers[5]._id,
            appointmentDate: d6_past3,
            bookedSlot: "11:30",
            status: "completed",
            reason: "Seasonal flu symptoms and acute upper respiratory tract irritation",
            notes: "Nasal congestion and low grade pyrexia. Hydration advised.",
            createdAt: getPastTimestamp(9),
        },
        {
            key: "appt19",
            patient: patientUsers[1]._id, // Sneha
            doctor: doctorUsers[5]._id,
            appointmentDate: d6_future1,
            bookedSlot: "10:30",
            status: "confirmed",
            reason: "Post-viral recovery review and immunity counseling",
            notes: "Patient reports feeling significantly better.",
            createdAt: getPastTimestamp(2),
        },
        {
            key: "appt20",
            patient: patientUsers[0]._id, // Rohan
            doctor: doctorUsers[5]._id,
            appointmentDate: d6_future2,
            bookedSlot: "14:00",
            status: "pending",
            reason: "Follow-up on Vitamin D supplementation and fatigue evaluation",
            notes: "Routine progress assessment.",
            createdAt: getPastTimestamp(1),
        },
    ];

    const appointmentsMap = {};
    for (const conf of appointmentsConfig) {
        const { key, createdAt, ...apptFields } = conf;
        const appt = await Appointment.create({
            ...apptFields,
            createdAt: createdAt || new Date(),
        });
        appointmentsMap[key] = appt;
    }
    console.log(` Created ${Object.keys(appointmentsMap).length} Appointments (Completed: 12, Confirmed: 4 [2 for Today], Pending: 2, Pending Reschedule: 1, Cancelled: 1).`);

    // 7. Create Medical Records (10 records for completed appointments)
    console.log("\n[7/11] Seeding 10 Medical Records...");
    const medicalRecordsConfig = [
        {
            key: "mr1",
            apptKey: "appt1",
            chiefComplaint: "Elevated blood pressure readings at home (145/95 mmHg) and occasional lightheadedness",
            diagnosis: "Stage 1 Essential Hypertension with mild sinus tachycardia",
            treatment: "Prescribed Telmisartan 40mg daily, low-sodium DASH diet, 30 minutes daily aerobic exercise",
            notes: "Patient advised to monitor home blood pressure morning and evening. Return in 1 week.",
            createdAt: getPastTimestamp(12),
        },
        {
            key: "mr2",
            apptKey: "appt2",
            chiefComplaint: "Follow-up evaluation for hypertension treatment response",
            diagnosis: "Controlled Essential Hypertension; BP normalized to 124/82 mmHg",
            treatment: "Continue Telmisartan 40mg once daily in morning. Maintain sodium restriction.",
            notes: "Patient tolerated medication well with no orthostatic symptoms. Schedule follow-up in 3 months.",
            createdAt: getPastTimestamp(4),
        },
        {
            key: "mr3",
            apptKey: "appt4",
            chiefComplaint: "Pruritic erythematous rash with small vesicles on bilateral forearms for 4 days",
            diagnosis: "Acute Contact Dermatitis, likely secondary to household cleaning detergent",
            treatment: "Topical Hydrocortisone 1% cream twice daily for 7 days, oral Levocetirizine 5mg at night, gentle emollient moisturizer",
            notes: "Avoid direct contact with suspected chemical irritants. Use protective nitrile gloves.",
            createdAt: getPastTimestamp(14),
        },
        {
            key: "mr4",
            apptKey: "appt5",
            chiefComplaint: "Dry, scaly erythematous patches on bilateral cheeks with moderate pruritus",
            diagnosis: "Mild Facial Eczema (Atopic Diathesis)",
            treatment: "Ceramide-based barrier repair cream twice daily, Tacrolimus 0.03% ointment for flare-ups",
            notes: "Avoid harsh facial cleansers and fragranced cosmetics. Significant clinical improvement noted.",
            createdAt: getPastTimestamp(6),
        },
        {
            key: "mr5",
            apptKey: "appt7",
            chiefComplaint: "Severe unilateral pulsating headaches with photophobia, nausea, and visual aura occurring 3-4 times per week",
            diagnosis: "Migraine with Aura (Episodic, frequent)",
            treatment: "Propranolol 40mg daily for prophylaxis, Rizatriptan 10mg orally as abortive therapy at onset",
            notes: "Advised maintaining headache diary, consistent sleep schedule, and limiting screen exposure during prodrome.",
            createdAt: getPastTimestamp(9),
        },
        {
            key: "mr6",
            apptKey: "appt8",
            chiefComplaint: "Follow-up to assess efficacy of migraine prophylaxis",
            diagnosis: "Well-controlled Episodic Migraine under prophylactic regimen",
            treatment: "Maintain Propranolol 40mg once daily. Keep Rizatriptan available for acute breakthrough episodes.",
            notes: "Headache frequency decreased by >70%. Sleep quality and daytime alertness markedly improved.",
            createdAt: getPastTimestamp(2),
        },
        {
            key: "mr7",
            apptKey: "appt13",
            chiefComplaint: "Dull aching pain in cervical neck region radiating to right trapezius, exacerbated by prolonged desk posture",
            diagnosis: "Cervical Postural Strain with Myofascial Pain Syndrome",
            treatment: "Diclofenac gel application thrice daily, ergonomic workstation adjustment, physical therapy cervical stretches",
            notes: "Recommended 10-minute posture breaks every hour and ergonomic monitor elevation.",
            createdAt: getPastTimestamp(11),
        },
        {
            key: "mr8",
            apptKey: "appt16",
            chiefComplaint: "Annual health screening checkup; reports mild midday lethargy",
            diagnosis: "Routine Health Examination; suspected mild hypovitaminosis D",
            treatment: "Ordered complete blood count, fasting lipid panel, and Serum 25-OH Vitamin D test",
            notes: "Cardiovascular and respiratory auscultation clear. Awaiting diagnostic lab report.",
            createdAt: getPastTimestamp(13),
        },
        {
            key: "mr9",
            apptKey: "appt17",
            chiefComplaint: "Review of laboratory diagnostic reports",
            diagnosis: "Vitamin D Deficiency (Serum 25-OH Vit D: 14 ng/mL); normal lipid and renal panels",
            treatment: "Cholecalciferol 60,000 IU capsule once weekly for 8 weeks, followed by monthly maintenance",
            notes: "Patient counseled on morning sunlight exposure and dietary calcium sources. Recheck in 10 weeks.",
            createdAt: getPastTimestamp(5),
        },
        {
            key: "mr10",
            apptKey: "appt18",
            chiefComplaint: "Acute low-grade fever (100.2°F), nasal congestion, sore throat, and generalized malaise for 2 days",
            diagnosis: "Acute Viral Upper Respiratory Tract Infection (Common Cold)",
            treatment: "Paracetamol 650mg SOS for fever/bodyache, saline nasal spray thrice daily, warm saline gargles",
            notes: "Adequate hydration, steam inhalation, and 3 days of rest advised. Red flag warning signs explained.",
            createdAt: getPastTimestamp(7),
        },
    ];

    const medicalRecordsMap = {};
    for (const conf of medicalRecordsConfig) {
        const appt = appointmentsMap[conf.apptKey];
        const record = await MedicalRecord.create({
            patient: appt.patient,
            doctor: appt.doctor,
            appointment: appt._id,
            visitDate: appt.appointmentDate,
            chiefComplaint: conf.chiefComplaint,
            diagnosis: conf.diagnosis,
            treatment: conf.treatment,
            notes: conf.notes,
            attachments: [],
            createdAt: conf.createdAt,
        });
        medicalRecordsMap[conf.key] = record;
    }
    console.log(` Created ${Object.keys(medicalRecordsMap).length} Medical Records (5 for Patient 1, 5 for Patient 2).`);

    // 8. Create Prescriptions (7 prescriptions)
    console.log("\n[8/11] Seeding 7 Prescriptions...");
    const prescriptionsConfig = [
        {
            mrKey: "mr1",
            medications: [
                {
                    medicineName: "Telmisartan 40mg",
                    dosage: "1 Tablet",
                    frequency: "Once daily in the morning",
                    duration: "30 Days",
                    instructions: "Take with water after breakfast",
                },
                {
                    medicineName: "Amlodipine 5mg",
                    dosage: "1 Tablet",
                    frequency: "Once daily at bedtime",
                    duration: "15 Days",
                    instructions: "Monitor blood pressure weekly",
                },
            ],
            notes: "Limit daily dietary salt intake to under 5 grams.",
            createdAt: getPastTimestamp(12),
        },
        {
            mrKey: "mr3",
            medications: [
                {
                    medicineName: "Hydrocortisone 1% Cream",
                    dosage: "Thin application",
                    frequency: "Twice daily",
                    duration: "7 Days",
                    instructions: "Apply sparingly to affected forearm skin only",
                },
                {
                    medicineName: "Levocetirizine 5mg",
                    dosage: "1 Tablet",
                    frequency: "Once daily at night",
                    duration: "10 Days",
                    instructions: "May cause mild drowsiness; take at bedtime",
                },
            ],
            notes: "Keep affected skin well moisturized with hypoallergenic lotion.",
            createdAt: getPastTimestamp(14),
        },
        {
            mrKey: "mr4",
            medications: [
                {
                    medicineName: "Tacrolimus 0.03% Ointment",
                    dosage: "Pea-sized amount",
                    frequency: "Once daily at bedtime",
                    duration: "14 Days",
                    instructions: "Avoid sun exposure immediately after application",
                },
                {
                    medicineName: "Ceramide Moisturizing Cream",
                    dosage: "Liberal application",
                    frequency: "Thrice daily",
                    duration: "30 Days",
                    instructions: "Apply within 3 minutes of gentle facial cleansing",
                },
            ],
            notes: "Avoid soap-based cleansers and direct sun exposure.",
            createdAt: getPastTimestamp(6),
        },
        {
            mrKey: "mr5",
            medications: [
                {
                    medicineName: "Propranolol 40mg",
                    dosage: "1 Tablet",
                    frequency: "Once daily in the morning",
                    duration: "30 Days",
                    instructions: "Do not discontinue abruptly without physician advice",
                },
                {
                    medicineName: "Rizatriptan 10mg",
                    dosage: "1 Tablet",
                    frequency: "As needed for acute attack",
                    duration: "10 Days",
                    instructions: "Take at earliest onset of headache or visual aura; max 2 doses in 24 hours",
                },
            ],
            notes: "Avoid dietary triggers such as aged cheese, nitrates, and irregular meals.",
            createdAt: getPastTimestamp(9),
        },
        {
            mrKey: "mr7",
            medications: [
                {
                    medicineName: "Diclofenac Sodium Gel 1%",
                    dosage: "Topical application",
                    frequency: "Three times daily",
                    duration: "7 Days",
                    instructions: "Massage gently onto neck and upper trapezius muscles",
                },
                {
                    medicineName: "Thiocolchicoside 4mg",
                    dosage: "1 Capsule",
                    frequency: "Twice daily after meals",
                    duration: "5 Days",
                    instructions: "Take with food to minimize gastric discomfort",
                },
            ],
            notes: "Perform gentle cervical range-of-motion exercises twice daily.",
            createdAt: getPastTimestamp(11),
        },
        {
            mrKey: "mr9",
            medications: [
                {
                    medicineName: "Cholecalciferol 60,000 IU",
                    dosage: "1 Capsule",
                    frequency: "Once weekly on Sundays",
                    duration: "8 Weeks",
                    instructions: "Take with milk or fatty meal for optimal absorption",
                },
                {
                    medicineName: "Calcium Citrate 500mg",
                    dosage: "1 Tablet",
                    frequency: "Once daily after dinner",
                    duration: "30 Days",
                    instructions: "Maintain adequate daily water intake",
                },
            ],
            notes: "Repeat Serum 25-OH Vitamin D assay upon completion of 8-week therapy.",
            createdAt: getPastTimestamp(5),
        },
        {
            mrKey: "mr10",
            medications: [
                {
                    medicineName: "Paracetamol 650mg",
                    dosage: "1 Tablet",
                    frequency: "Every 6-8 hours as needed",
                    duration: "3 Days",
                    instructions: "Do not exceed 4 tablets in 24 hours",
                },
                {
                    medicineName: "Cetirizine 10mg",
                    dosage: "1 Tablet",
                    frequency: "Once daily at night",
                    duration: "5 Days",
                    instructions: "Take with water before sleeping",
                },
            ],
            notes: "Continue saline steam inhalation and warm fluids.",
            createdAt: getPastTimestamp(7),
        },
    ];

    for (const conf of prescriptionsConfig) {
        const mr = medicalRecordsMap[conf.mrKey];
        await Prescription.create({
            medicalRecord: mr._id,
            patient: mr.patient,
            doctor: mr.doctor,
            medications: conf.medications,
            notes: conf.notes,
            createdAt: conf.createdAt,
        });
    }
    console.log(` Created ${prescriptionsConfig.length} Prescriptions with complete medication regimens.`);

    // 9. Create Invoices (11 invoices: 9 paid, 2 pending)
    console.log("\n[9/11] Seeding 11 Invoices...");
    const invoicesConfig = [
        { apptKey: "appt1", amount: 1200, status: "paid", method: "stripe", daysAgo: 12 },
        { apptKey: "appt2", amount: 1200, status: "paid", method: "stripe", daysAgo: 4 },
        { apptKey: "appt4", amount: 800, status: "paid", method: "cash", daysAgo: 14 },
        { apptKey: "appt5", amount: 800, status: "paid", method: "stripe", daysAgo: 6 },
        { apptKey: "appt7", amount: 1500, status: "paid", method: "stripe", daysAgo: 9 },
        { apptKey: "appt8", amount: 1500, status: "paid", method: "cash", daysAgo: 2 },
        { apptKey: "appt11", amount: 700, status: "paid", method: "stripe", daysAgo: 10 },
        { apptKey: "appt13", amount: 1000, status: "pending", method: "stripe", daysAgo: 11 }, // pending invoice for Sneha
        { apptKey: "appt16", amount: 600, status: "paid", method: "cash", daysAgo: 13 },
        { apptKey: "appt17", amount: 600, status: "pending", method: "stripe", daysAgo: 5 }, // pending invoice for Rohan
        { apptKey: "appt18", amount: 600, status: "paid", method: "stripe", daysAgo: 5 },
    ];

    for (const inv of invoicesConfig) {
        const appt = appointmentsMap[inv.apptKey];
        const isPaid = inv.status === "paid";
        const createdAt = getPastTimestamp(inv.daysAgo, 2);
        const paidAt = isPaid ? getPastTimestamp(inv.daysAgo, 1) : undefined;

        await Invoice.create({
            appointment: appt._id,
            patient: appt.patient,
            doctor: appt.doctor,
            amount: inv.amount,
            description: `Consultation fee for ${appt.reason}`,
            status: inv.status,
            paymentMethod: inv.method,
            paidAt,
            createdAt,
        });
    }
    console.log(` Created 11 Invoices (9 Paid across Stripe/Cash, 2 Pending).`);

    // 10. Create Lab Results (2 records)
    console.log("\n[10/11] Seeding Lab Results...");
    await LabResult.create({
        medicalRecord: medicalRecordsMap["mr8"]._id,
        patient: patientUsers[0]._id,
        doctor: doctorUsers[5]._id,
        testName: "Comprehensive Metabolic & Vitamin D Panel",
        resultSummary: "Serum 25-OH Vitamin D: 14 ng/mL (Deficient). Fasting Blood Glucose: 92 mg/dL. Total Cholesterol: 185 mg/dL.",
        createdAt: getPastTimestamp(6),
    });

    await LabResult.create({
        medicalRecord: medicalRecordsMap["mr1"]._id,
        patient: patientUsers[0]._id,
        doctor: doctorUsers[0]._id,
        testName: "12-Lead Resting Electrocardiogram (ECG)",
        resultSummary: "Normal sinus rhythm at 76 bpm. No acute ST-T wave changes or conduction defects. PR interval: 160ms.",
        createdAt: getPastTimestamp(12),
    });
    console.log(` Created 2 Lab Results linked to clinical records.`);

    // 11. Create Notifications & Audit Logs
    console.log("\n[11/11] Seeding Notifications and Audit Logs...");
    const notificationsConfig = [
        // Admin Notifications
        {
            recipient: adminUser._id,
            title: "New Doctor Registration",
            message: "Dr. Arjun Mehta has completed profile registration with Cardiology specialization.",
            isRead: true,
            createdAt: getPastTimestamp(14),
        },
        {
            recipient: adminUser._id,
            title: "System Analytics Summary",
            message: "Weekly appointment throughput and revenue statistics are compiled for administrative review.",
            isRead: false,
            createdAt: getPastTimestamp(1),
        },

        // Doctor 1 Notifications
        {
            recipient: doctorUsers[0]._id,
            title: "New Appointment Scheduled",
            message: "Rohan Malhotra has scheduled a consultation for cardiovascular checkup.",
            isRead: true,
            createdAt: getPastTimestamp(12),
        },
        {
            recipient: doctorUsers[0]._id,
            title: "Upcoming Appointment Reminder",
            message: "You have an upcoming consultation with Rohan Malhotra scheduled for this week.",
            isRead: false,
            createdAt: getPastTimestamp(0, 4),
        },

        // Doctor 2 Notifications
        {
            recipient: doctorUsers[1]._id,
            title: "Appointment Booking Request",
            message: "New appointment booking request received from Rohan Malhotra for review.",
            isRead: false,
            createdAt: getPastTimestamp(1),
        },

        // Doctor 3 Notifications
        {
            recipient: doctorUsers[2]._id,
            title: "Follow-up Consultation Confirmed",
            message: "Appointment confirmed with Sneha Gupta for migraine neurological review.",
            isRead: true,
            createdAt: getPastTimestamp(2),
        },
        {
            recipient: doctorUsers[2]._id,
            title: "Today's Consultation Schedule",
            message: "Reminder: You have an appointment with Sneha Gupta today at 14:30.",
            isRead: false,
            createdAt: getPastTimestamp(0, 2),
        },

        // Patient 1 Notifications
        {
            recipient: patientUsers[0]._id,
            title: "Appointment Confirmed",
            message: "Your appointment with Dr. Arjun Mehta has been successfully confirmed.",
            isRead: true,
            createdAt: getPastTimestamp(12),
        },
        {
            recipient: patientUsers[0]._id,
            title: "Prescription Issued",
            message: "Dr. Arjun Mehta has issued a digital prescription for your hypertension management.",
            isRead: true,
            createdAt: getPastTimestamp(4),
        },
        {
            recipient: patientUsers[0]._id,
            title: "Upcoming Consultation Today",
            message: "Reminder: You have an orthopedic consultation today at 11:00 with Dr. Vikram Singh.",
            isRead: false,
            createdAt: getPastTimestamp(0, 3),
        },
        {
            recipient: patientUsers[0]._id,
            title: "Invoice Pending Payment",
            message: "An invoice of ₹600 is pending payment for your consultation with Dr. Ananya Rao.",
            isRead: false,
            createdAt: getPastTimestamp(1),
        },

        // Patient 2 Notifications
        {
            recipient: patientUsers[1]._id,
            title: "Appointment Rescheduled Notice",
            message: "Your appointment with Dr. Neha Kapoor is pending reschedule. Please confirm an available slot.",
            isRead: false,
            createdAt: getPastTimestamp(1),
        },
        {
            recipient: patientUsers[1]._id,
            title: "Prescription Issued",
            message: "Dr. Rahul Verma has issued a digital prescription for your migraine treatment plan.",
            isRead: true,
            createdAt: getPastTimestamp(2),
        },
        {
            recipient: patientUsers[1]._id,
            title: "Payment Receipt",
            message: "Payment of ₹800 received for consultation with Dr. Priya Sharma. Thank you.",
            isRead: true,
            createdAt: getPastTimestamp(6),
        },
    ];

    for (const notif of notificationsConfig) {
        await Notification.create(notif);
    }
    console.log(` Created ${notificationsConfig.length} Notifications (Read & Unread across Admin, Doctors, and Patients).`);

    // Audit Logs
    const auditLogsConfig = [
        {
            actor: patientUsers[0]._id,
            action: "appointment_booked",
            entityType: "appointment",
            entityId: appointmentsMap["appt1"]._id,
            metadata: { doctor: doctorUsers[0]._id, slot: "10:00" },
            createdAt: getPastTimestamp(14),
        },
        {
            actor: doctorUsers[0]._id,
            action: "appointment_status_updated",
            entityType: "appointment",
            entityId: appointmentsMap["appt1"]._id,
            metadata: { newStatus: "completed" },
            createdAt: getPastTimestamp(12),
        },
        {
            actor: doctorUsers[0]._id,
            action: "medical_record_created",
            entityType: "medical_record",
            entityId: medicalRecordsMap["mr1"]._id,
            metadata: { patient: patientUsers[0]._id },
            createdAt: getPastTimestamp(12),
        },
        {
            actor: doctorUsers[0]._id,
            action: "invoice_created",
            entityType: "invoice",
            entityId: appointmentsMap["appt1"]._id,
            metadata: { amount: 1200 },
            createdAt: getPastTimestamp(12),
        },
        {
            actor: patientUsers[0]._id,
            action: "invoice_paid",
            entityType: "invoice",
            entityId: appointmentsMap["appt1"]._id,
            metadata: { amount: 1200, method: "stripe" },
            createdAt: getPastTimestamp(12),
        },
        {
            actor: patientUsers[0]._id,
            action: "appointment_cancelled",
            entityType: "appointment",
            entityId: appointmentsMap["appt10"]._id,
            metadata: { doctor: doctorUsers[2]._id },
            createdAt: getPastTimestamp(10),
        },
        {
            actor: patientUsers[1]._id,
            action: "appointment_booked",
            entityType: "appointment",
            entityId: appointmentsMap["appt4"]._id,
            metadata: { doctor: doctorUsers[1]._id, slot: "11:30" },
            createdAt: getPastTimestamp(15),
        },
        {
            actor: doctorUsers[1]._id,
            action: "medical_record_created",
            entityType: "medical_record",
            entityId: medicalRecordsMap["mr3"]._id,
            metadata: { patient: patientUsers[1]._id },
            createdAt: getPastTimestamp(14),
        },
        {
            actor: patientUsers[1]._id,
            action: "appointment_booked",
            entityType: "appointment",
            entityId: appointmentsMap["appt7"]._id,
            metadata: { doctor: doctorUsers[2]._id, slot: "10:00" },
            createdAt: getPastTimestamp(11),
        },
        {
            actor: doctorUsers[2]._id,
            action: "appointment_status_updated",
            entityType: "appointment",
            entityId: appointmentsMap["appt7"]._id,
            metadata: { newStatus: "completed" },
            createdAt: getPastTimestamp(9),
        },
        {
            actor: doctorUsers[2]._id,
            action: "medical_record_created",
            entityType: "medical_record",
            entityId: medicalRecordsMap["mr5"]._id,
            metadata: { patient: patientUsers[1]._id },
            createdAt: getPastTimestamp(9),
        },
        {
            actor: patientUsers[1]._id,
            action: "invoice_paid",
            entityType: "invoice",
            entityId: appointmentsMap["appt7"]._id,
            metadata: { amount: 1500, method: "stripe" },
            createdAt: getPastTimestamp(9),
        },
        {
            actor: patientUsers[0]._id,
            action: "appointment_booked",
            entityType: "appointment",
            entityId: appointmentsMap["appt15"]._id,
            metadata: { doctor: doctorUsers[4]._id, slot: "11:00" },
            createdAt: getPastTimestamp(1),
        },
        {
            actor: patientUsers[1]._id,
            action: "appointment_booked",
            entityType: "appointment",
            entityId: appointmentsMap["appt9"]._id,
            metadata: { doctor: doctorUsers[2]._id, slot: "14:30" },
            createdAt: getPastTimestamp(1),
        },
    ];

    for (const log of auditLogsConfig) {
        await AuditLog.create(log);
    }
    console.log(` Created ${auditLogsConfig.length} Audit Logs representing genuine user actions.`);

    console.log("\n==================================================");
    console.log(" PulseFlow Database Seeding Complete!");
    console.log("==================================================");
    console.log(`
SUMMARY:
- Admin: 1 (admin@admin.com)
- Doctors: 6 (doctor1@doctor.com to doctor6@doctor.com)
- Patients: 2 (patient1@patient.com, patient2@patient.com)
- Common Development Password: admin@123
- Doctor Profiles: 6
- Doctor Availabilities: 6
- Availability Exceptions: 2
- Patient Profiles: 2
- Appointments: 20 (Completed: 12, Confirmed: 4 [2 for Today], Pending: 2, Reschedule: 1, Cancelled: 1)
- Medical Records: 10
- Prescriptions: 7
- Invoices: 11 (9 Paid, 2 Pending)
- Lab Results: 2
- Notifications: 14
- Audit Logs: 14
`);
};

// If run directly from CLI (e.g. node src/seed.js)
const isDirectRun = import.meta.url === `file://${process.argv[1]}` ||
    (process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("server/src/seed.js"));

if (isDirectRun) {
    seedDatabase()
        .then(() => {
            console.log("Seeding process completed successfully.");
            process.exit(0);
        })
        .catch((err) => {
            console.error("Seeding failed with error:", err);
            process.exit(1);
        });
}
