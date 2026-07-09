## 1. Root Check

* **Base URL**: `/api`

| Method  | Endpoint | Authorization | Description                         | Typical Response       |
| :------ | :------- | :------------ | :---------------------------------- | :--------------------- |
| **GET** | `/`      | Public        | Health check / API status indicator | `{ success, message }` |

---

# 2. User & Authentication Module

* **Base URL**: `/api/users`
* **Route Configuration**: `user.routes.js`

| Method   | Endpoint    | Authorization         | Description                               | Request Body Structure                              | Typical Response                                                                     |
| :------- | :---------- | :-------------------- | :---------------------------------------- | :-------------------------------------------------- | :----------------------------------------------------------------------------------- |
| **POST** | `/register` | Public (Rate-limited) | Register a new user                       | `{ name, email, password, role, age, gender }`      | `{ success, message, data: { role } }` *(Sets token cookie)*                         |
| **POST** | `/login`    | Public (Rate-limited) | Login user and obtain cookie session      | `{ email, password }`                               | `{ success, message, data: { role } }` *(Sets token cookie)*                         |
| **GET**  | `/logout`   | Authenticated         | Sign out and clear HTTP-only token cookie | *None*                                              | `{ success, message, data }`                                                         |
| **GET**  | `/`         | Admin                 | Get list of all users                     | *Query parameters: filtering/pagination (optional)* | `{ success, data: [{ _id, name, email, role, age, gender, createdAt, updatedAt }] }` |
| **GET**  | `/:id`      | Admin                 | Get details of a single user by ID        | *None*                                              | `{ success, data: { _id, name, email, role, age, gender } }`                         |

---

# 3. Patient Profile Module

* **Base URL**: `/api/patients`
* **Route Configuration**: `patientProfile.routes.js`

| Method    | Endpoint           | Authorization | Description                                                 | Request Payload                                                          | Typical Response                                                                                                                                   |
| :-------- | :----------------- | :------------ | :---------------------------------------------------------- | :----------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GET**   | `/me`              | Patient       | Get current logged-in patient's medical and profile details | *None*                                                                   | `{ success, data: { _id, user, bloodGroup, allergies: [allergy], medicalHistory, emergencyContact, profilePicture: { url, publicId } } }`          |
| **PATCH** | `/me`              | Patient       | Update patient profile fields                               | `{ bloodGroup, allergies: [allergy], medicalHistory, emergencyContact }` | `{ success, message, data: { _id, user, bloodGroup, allergies: [allergy], medicalHistory, emergencyContact, profilePicture: { url, publicId } } }` |
| **PATCH** | `/profile-picture` | Patient       | Upload / update profile avatar                              | Multipart Form-Data: File field `profilePicture`                         | `{ success, message, data: { _id, user, bloodGroup, allergies: [allergy], medicalHistory, emergencyContact, profilePicture: { url, publicId } } }` |

---

# 4. Doctor Search & Profiles

* **Base URLs**: `/api/doctors` and `/api/doctor-profile`
* **Route Configuration**: `doctorSearch.routes.js` & `doctorProfile.routes.js`

| Method    | Endpoint                          | Authorization | Description                              | Request/Query Payload                                                 | Typical Response                                                                                                                                |
| :-------- | :-------------------------------- | :------------ | :--------------------------------------- | :-------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| **GET**   | `/doctors`                        | Public        | Search available doctors                 | Query: `specialization`, `name`, `experience`                         | `{ success, data: [{ _id, user: { name, email }, specialization, experience, consultationFee, clinicAddress, profilePicture: { url }, bio }] }` |
| **GET**   | `/doctors/:id`                    | Public        | Get profile details of a specific doctor | *None*                                                                | `{ success, data: { _id, user: { name, email }, specialization, experience, consultationFee, clinicAddress, profilePicture: { url }, bio } }`   |
| **GET**   | `/doctors/:id/available-slots`    | Public        | Get open time slots for booking          | Query: `date` (`YYYY-MM-DD`)                                          | `{ success, data: [slot] }`                                                                                                                     |
| **GET**   | `/doctor-profile/me`              | Doctor        | Get current doctor's profile             | *None*                                                                | `{ success, data: { _id, specialization, experience, consultationFee, clinicAddress, bio, profilePicture: { url, publicId } } }`                |
| **PATCH** | `/doctor-profile/me`              | Doctor        | Update profile information               | `{ specialization, experience, consultationFee, clinicAddress, bio }` | `{ success, message, data: { _id, specialization, experience, consultationFee, clinicAddress, bio, profilePicture: { url, publicId } } }`       |
| **PATCH** | `/doctor-profile/profile-picture` | Doctor        | Update doctor bio photo                  | Multipart Form-Data: File field `profilePicture`                      | `{ success, message, data: { _id, specialization, experience, consultationFee, clinicAddress, bio, profilePicture: { url, publicId } } }`       |

---

# 5. Doctor Weekly Availability Settings

* **Base URL**: `/api/doctor-availability`
* **Route Configuration**: `doctorAvailability.routes.js`

| Method    | Endpoint | Authorization | Description                                        | Request Body Structure                                                 | Typical Response                                                                                   |
| :-------- | :------- | :------------ | :------------------------------------------------- | :--------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| **GET**   | `/me`    | Doctor        | Get doctor's standard weekly availability settings | *None*                                                                 | `{ success, data: { availableDays: [day], startTime, endTime, slotDuration, isActive } }`          |
| **PATCH** | `/`      | Doctor        | Update weekly availability configuration           | `{ availableDays: [day], startTime, endTime, slotDuration, isActive }` | `{ success, message, data: { availableDays: [day], startTime, endTime, slotDuration, isActive } }` |

---

# 6. Availability Exceptions (Block Booking Dates)

* **Base URL**: `/api/availability-exceptions`
* **Route Configuration**: `availabilityException.routes.js`

| Method     | Endpoint        | Authorization | Description                                                                  | Request Payload                                 | Typical Response                                                                       |
| :--------- | :-------------- | :------------ | :--------------------------------------------------------------------------- | :---------------------------------------------- | :------------------------------------------------------------------------------------- |
| **POST**   | `/`             | Doctor        | Block a specific date (no new bookings, flags current ones for rescheduling) | `{ blockedDate, reason }`                       | `{ success, message, data: { _id, doctor, blockedDates: [{ blockedDate, reason }] } }` |
| **GET**    | `/me`           | Doctor        | List blocked date exceptions for this doctor                                 | *None*                                          | `{ success, data: [{ blockedDates: [{ blockedDate, reason }] }] }`                     |
| **DELETE** | `/:blockedDate` | Doctor        | Remove blocked exception and reopen date                                     | Date parameter in path (example: `/2026-08-15`) | *204 No Content*                                                                       |

---

# 7. Appointments Module

* **Base URL**: `/api/appointments`
* **Route Configuration**: `appointment.routes.js`

| Method    | Endpoint          | Authorization | Description                                                                                     | Request Payload                                          | Typical Response                                                                                                                                     |
| :-------- | :---------------- | :------------ | :---------------------------------------------------------------------------------------------- | :------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| **POST**  | `/`               | Patient       | Book a new doctor appointment slot                                                              | `{ doctor, appointmentDate, bookedSlot, reason, notes }` | `{ success, message, data }`                                                                                                                         |
| **GET**   | `/`               | Authenticated | Get list of appointments (filtered automatically for Patients/Doctors, or full list for Admins) | *Query options: status, date*                            | `{ success, data: [{ _id, patient: { name }, doctor: { name }, appointmentDate, bookedSlot, status, reason }] }`                                     |
| **GET**   | `/:id`            | Authenticated | Get details of a single appointment                                                             | *None*                                                   | `{ success, data: { _id, patient: { name }, doctor: { name }, appointmentDate, bookedSlot, status, reason, notes, createdAt, updatedAt } }`          |
| **PATCH** | `/:id/status`     | Doctor, Admin | Update booking status (`confirmed`/`completed` etc.)                                            | `{ status }`                                             | `{ success, message, data: { status } }`                                                                                                             |
| **PATCH** | `/:id/cancel`     | Authenticated | Cancel appointment                                                                              | *None*                                                   | `{ success, message, data }`                                                                                                                         |
| **PATCH** | `/:id/reschedule` | Authenticated | Reschedule an appointment slot                                                                  | `{ appointmentDate, bookedSlot }`                        | `{ success, message, data: { _id, patient: { name }, doctor: { name }, appointmentDate, bookedSlot, status, reason, notes, createdAt, updatedAt } }` |

---

# 8. Medical Records Module

* **Base URL**: `/api/medical-records`
* **Route Configuration**: `medicalRecord.routes.js`

| Method     | Endpoint | Authorization  | Description                                       | Request Payload                                                                                                                                            | Typical Response                                                                                                                                                                                             |
| :--------- | :------- | :------------- | :------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **POST**   | `/`      | Doctor         | Create a patient medical record (attaching files) | Multipart Form-Data: Files field `attachments` (max 5); fields: `patient`, `appointment`, `visitDate`, `chiefComplaint`, `diagnosis`, `treatment`, `notes` | `{ success, message, data: { _id } }`                                                                                                                                                                        |
| **GET**    | `/`      | Patient, Admin | View medical history records                      | *None*                                                                                                                                                     | `{ success, data: [{ _id, patient: { name }, doctor: { name }, visitDate, chiefComplaint, diagnosis, treatment, attachments: [{ url, originalName }] }] }`                                                   |
| **GET**    | `/:id`   | Authenticated  | Get specific medical record details               | *None*                                                                                                                                                     | `{ success, data: { _id, patient: { name }, doctor: { name }, appointment, visitDate, chiefComplaint, diagnosis, treatment, notes, attachments: [{ url, publicId, originalName }], createdAt, updatedAt } }` |
| **PATCH**  | `/:id`   | Doctor         | Update an existing medical record                 | Multipart Form-Data updates                                                                                                                                | `{ success, message, data: { _id, patient, doctor, appointment, visitDate, chiefComplaint, diagnosis, treatment, notes, attachments: [{ url, publicId, originalName }], createdAt, updatedAt } }`            |
| **DELETE** | `/:id`   | Doctor         | Remove a medical record                           | *None*                                                                                                                                                     | *204 No Content*                                                                                                                                                                                             |

---

# 9. Prescriptions Module

* **Base URL**: `/api/prescriptions`
* **Route Configuration**: `prescription.routes.js`

| Method     | Endpoint | Authorization  | Description                       | Request Payload                                                                                                 | Typical Response                                                                                                                                                      |
| :--------- | :------- | :------------- | :-------------------------------- | :-------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **POST**   | `/`      | Doctor         | Write a new prescription          | `{ medicalRecord, patient, medications: [{ medicineName, dosage, frequency, duration, instructions }], notes }` | `{ success, message, data: { _id } }`                                                                                                                                 |
| **GET**    | `/`      | Patient, Admin | View list of prescriptions        | *None*                                                                                                          | `{ success, data: [{ _id, medications: [{ medicineName, dosage, frequency, duration, instructions }], doctor: { name }, createdAt }] }`                               |
| **GET**    | `/:id`   | Authenticated  | Get specific prescription details | *None*                                                                                                          | `{ success, data: { _id, medicalRecord, patient, doctor, medications: [{ medicineName, dosage, frequency, duration, instructions }], notes, createdAt, updatedAt } }` |
| **PATCH**  | `/:id`   | Doctor         | Modify medication list / details  | `{ medications: [{ medicineName, dosage, frequency, duration, instructions }], notes }`                         | `{ success, message, data: { _id, medications: [{ medicineName, dosage, frequency, duration, instructions }], notes } }`                                              |
| **DELETE** | `/:id`   | Doctor         | Delete a prescription             | *None*                                                                                                          | *204 No Content*                                                                                                                                                      |

---

# 10. Lab Results Module

* **Base URL**: `/api/lab-results`
* **Route Configuration**: `labResult.routes.js`

| Method     | Endpoint | Authorization  | Description                                  | Request Payload                                                                                           | Typical Response                                                                                                                           |
| :--------- | :------- | :------------- | :------------------------------------------- | :-------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| **POST**   | `/`      | Doctor         | Upload a lab test result and report document | Multipart Form-Data: File field `report`; fields: `medicalRecord`, `patient`, `testName`, `resultSummary` | `{ success, message, data: { _id } }`                                                                                                      |
| **GET**    | `/`      | Patient, Admin | Get lab results                              | *None*                                                                                                    | `{ success, data: [{ _id, testName, resultSummary, report: { url, originalName } }] }`                                                     |
| **GET**    | `/:id`   | Authenticated  | View a single lab result detail              | *None*                                                                                                    | `{ success, data: { _id, medicalRecord, patient, doctor, testName, resultSummary, report: { url, originalName }, createdAt, updatedAt } }` |
| **PATCH**  | `/:id`   | Doctor         | Update test result summary / report document | Multipart Form-Data fields                                                                                | `{ success, message, data: { _id, testName, resultSummary, report: { url, originalName } } }`                                              |
| **DELETE** | `/:id`   | Doctor         | Delete a lab result                          | *None*                                                                                                    | *204 No Content*                                                                                                                           |

---

# 11. Invoices & Payments (Stripe Checkout)

* **Base URLs**: `/api/invoices` and `/api/payments`
* **Route Configuration**: `invoice.routes.js` & `payment.routes.js`

| Method     | Endpoint                            | Authorization | Description                                         | Request/Query Payload                           | Typical Response                                                                                                     |
| :--------- | :---------------------------------- | :------------ | :-------------------------------------------------- | :---------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| **POST**   | `/invoices`                         | Doctor, Admin | Create a billing invoice for an appointment         | `{ appointment, patient, amount, description }` | `{ success, message, data: { _id } }`                                                                                |
| **GET**    | `/invoices`                         | Authenticated | Get invoices list                                   | Query: `status`                                 | `{ success, data: [{ _id, amount, status, paymentMethod, createdAt }] }`                                             |
| **GET**    | `/invoices/:id`                     | Authenticated | Get details of a single invoice                     | *None*                                          | `{ success, data: { _id, appointment, patient, amount, description, status, paymentMethod, createdAt, updatedAt } }` |
| **PATCH**  | `/invoices/:id`                     | Doctor, Admin | Update invoice pricing / description / status       | `{ amount, description, status }`               | `{ success, message, data: { _id, amount, description, status } }`                                                   |
| **DELETE** | `/invoices/:id`                     | Doctor, Admin | Remove invoice                                      | *None*                                          | *204 No Content*                                                                                                     |
| **POST**   | `/payments/create-checkout-session` | Patient       | Generate Stripe payment URL checkout session        | `{ invoiceId }`                                 | `{ success, data: { id, url } }`                                                                                     |
| **POST**   | `/payments/webhook`                 | Public        | Stripe payment events listener (signature verified) | Stripe Webhook Event Payload                    | `{ received }`                                                                                                       |

---

# 12. Notifications Module

* **Base URL**: `/api/notifications`
* **Route Configuration**: `notification.routes.js`

| Method    | Endpoint        | Authorization | Description                             | Typical Response                                       |
| :-------- | :-------------- | :------------ | :-------------------------------------- | :----------------------------------------------------- |
| **GET**   | `/`             | Authenticated | Retrieve list of user notifications     | `{ success, data: [{ _id, title, message, isRead }] }` |
| **GET**   | `/unread-count` | Authenticated | Retrieve total count of unread messages | `{ success, data }`                                    |
| **PATCH** | `/:id/read`     | Authenticated | Mark a single notification as read      | `{ success, data }`                                    |
| **PATCH** | `/read-all`     | Authenticated | Mark all user notifications as read     | `{ success, data }`                                    |

---

# 13. Dynamic Statistics Dashboards

* **Base URL**: `/api/dashboard`
* **Route Configurations**: `adminDashboard.routes.js` | `doctorDashboard.routes.js` | `patientDashboard.routes.js`

| Method  | Endpoint   | Authorization | Description                                                        | Typical Response                                                                                                                                                                                                                                      |
| :------ | :--------- | :------------ | :----------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GET** | `/admin`   | Admin         | Overall clinic and user status analytics                           | `{ success, data: { users: { doctors, patients }, appointments: { today, pending, confirmed, completed, cancelled, pending_reschedule }, revenue, invoices: { pendingInvoices }, upcomingAppointments: [appointment], recentActivity: [activity] } }` |
| **GET** | `/doctor`  | Doctor        | Dashboard showing today's patient agenda and daily statistics      | `{ success, data: { stats: { total, pending, confirmed, completed, cancelled }, todayAppointments: [{ _id, patient: { name }, bookedSlot, status }] } }`                                                                                              |
| **GET** | `/patient` | Patient       | Dashboard showing pending bills, next visit timeline, and counters | `{ success, data: { stats: { upcomingAppointments, pendingReschedules, pendingInvoices }, nextAppointment: { appointmentDate, bookedSlot, doctor: { name } }, pendingInvoice: { amount, description } } }`                                            |

---

# 14. Audit Logs & Advanced Analytics (Admin Only)

* **Base URLs**: `/api/audit-logs` and `/api/analytics`
* **Route Configurations**: `auditLog.routes.js` & `analytics.routes.js`

| Method  | Endpoint      | Authorization | Description                                                        | Typical Response                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| :------ | :------------ | :------------ | :----------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GET** | `/audit-logs` | Admin         | Paginated database of actions/history for security audit           | `{ success, data: { auditLogs: [{ actor: { name, role }, action, entityType, timestamp, metadata }], pagination: { page, limit, total, totalPages } } }`                                                                                                                                                                                                                                                                                                                                   |
| **GET** | `/analytics`  | Admin         | Growth charts, KPIs, revenue trends, and specialized distributions | `{ success, data: { kpis: { totalRevenue, totalAppointments, completionRate, averageConsultationFee, activeDoctors, registeredPatients }, appointmentStatusDistribution: { pending, confirmed, completed, cancelled }, appointmentsTrend: [{ _id, appointments }], revenueTrend: [{ _id, revenue }], doctorWorkload: [{ doctorName, appointments }], topSpecializations: [{ _id, appointments }], paymentMethods: [{ _id, count }], recentGrowth: { appointments, revenue, patients } } }` |

---