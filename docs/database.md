# 🗄 Database Design

PulseFlow uses **MongoDB Atlas** as its primary database, with Mongoose providing schema definition, validation, and relationship management.

The data model is organized around real clinical workflows rather than isolated entities. Documents remain relatively independent while references connect related resources throughout the consultation lifecycle.

---

# Database Philosophy

The database is designed around the following principles:

- Reference over embedding for major entities
- Independent feature modules
- Workflow-driven relationships
- Minimal data duplication
- Aggregation-friendly schemas
- Role-aware ownership

This approach keeps documents small, reusable, and easy to query while supporting future scalability.

---

# Entity Relationship Overview

![Database Design](../assets/docs/database.svg)

---

# Core Collections

| Collection | Purpose |
|------------|---------|
| User | Authentication and account information |
| DoctorProfile | Professional information for doctors |
| PatientProfile | Medical information for patients |
| Appointment | Appointment scheduling and lifecycle |
| MedicalRecord | Consultation documentation |
| Prescription | Medication issued during consultation |
| LabResult | Diagnostic reports |
| Invoice | Billing and payment information |
| AuditLog | System activity history |
| Notification | User notifications |

---

# Consultation Lifecycle

The application's data revolves around appointments.

```text       
                                Patient
                                   │
                                   ▼
                         ┌───────────────────┐
                         │ Book Appointment  │
                         └───────────────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │   Consultation    │
                         └───────────────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │  Medical Record   │
                         └───────────────────┘
                                   │
                       ┌───────────┴───────────┐
                       ▼                       ▼
             ┌───────────────────┐   ┌───────────────────┐
             │   Prescription    │   │    Lab Result     │
             └───────────────────┘   └───────────────────┘
                       │                       │
                       └───────────┬───────────┘
                                   ▼
                         ┌───────────────────┐
                         │      Invoice      │
                         └───────────────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │      Stripe       │
                         └───────────────────┘
                                   │
                                   ▼
                         ┌───────────────────┐
                         │    Audit Logs     │
                         └───────────────────┘
```

A completed appointment may generate one medical record, which can then be associated with prescriptions, laboratory results, and invoices.

---

# Collection Relationships

## User

Stores account information shared across all roles.

Each user has one role:

- Patient
- Doctor
- Administrator

Doctor and Patient accounts are extended through profile collections.

---

## Doctor Profile

Stores professional information including:

- Specialization
- Experience
- Consultation fee
- Clinic address
- Biography

Relationship:

```text
                             User
                              │
                              ▼
                        DoctorProfile
```

---

## Patient Profile

Stores patient-specific medical information.

Includes:

- Blood group
- Allergies
- Medical history
- Emergency contact

Relationship:

```text
                             User
                              │
                              ▼
                        PatientProfile
```

---

## Appointment

Acts as the central entity of the healthcare workflow.

References:

- Patient
- Doctor

Stores:

- Appointment date
- Time slot
- Status
- Reason

---

## Medical Record

Created after consultation.

References:

- Appointment
- Doctor
- Patient

Stores:

- Chief complaint
- Diagnosis
- Treatment
- Advice
- Attachments

---

## Prescription

Associated with one medical record.

References:

- Medical Record
- Patient
- Doctor

Contains one or more medications.

---

## Lab Result

Associated with one medical record.

References:

- Medical Record
- Patient
- Doctor

Stores:

- Test name
- Result summary
- Report file

---

## Invoice

Represents billing for an appointment.

References:

- Appointment
- Patient
- Doctor

Stores:

- Amount
- Description
- Payment method
- Status
- Payment timestamp

---

## Audit Log

Tracks important system events.

Stores:

- Actor
- Action
- Entity type
- Entity identifier
- Metadata

Audit logs power administrative activity history.

---

## Notification

Represents user notifications generated by the platform.

Notifications may be created from:

- Appointment events
- Payments
- Consultation updates
- Administrative actions

---

# Aggregation Usage

MongoDB aggregations power the administrative analytics dashboard.

Examples include:

- Appointment status distribution
- Revenue analytics
- Doctor workload
- Top specializations
- Growth metrics
- Dashboard KPIs

These queries are optimized to minimize application-side processing.

---

# File Storage

Binary files are not stored inside MongoDB.

Uploaded resources such as:

- Medical attachments
- Laboratory reports

are stored in **Cloudinary**, while MongoDB stores only their metadata.

```text
                        MongoDB
                           │
                           ▼
                     Cloudinary URL
                           │
                           ▼
                      Application
```

---

# Future Evolution

The current schema is designed to support additional infrastructure with minimal structural changes.

Planned enhancements include:

- Redis caching
- Global search indexing
- Background processing
- Real-time synchronization
- Reporting services
- Monitoring and observability

The modular collection design allows these capabilities to be introduced without restructuring existing data.