# 🔄 Business Workflows

This document describes how users interact with PulseFlow and how the frontend communicates with the backend throughout common workflows.

The flows below represent the typical request lifecycle from the user's perspective.

---

# 👤 Patient Workflows

## Authentication

```text
                Landing Page
                    │
                    ▼
                 Register
         POST /api/users/register
                    │
                    ▼
            JWT Cookie Issued
                    │
                    ▼
                 Redirect
                    │
                    ▼
            Patient Dashboard
       GET /api/dashboard/patient
```

Existing users

```text
                Landing Page
                    │
                    ▼
                  Login
          POST /api/users/login
                    │
                    ▼
            JWT Cookie Issued
                    │
                    ▼
            Patient Dashboard
       GET /api/dashboard/patient
```

---

## Doctor Discovery

```text
               Doctor Search Page
                        │
                        ▼
                User types search
  GET /api/doctors?name=&specialization=&experience=
                        │
                        ▼
              Doctor Cards Updated
```

Selecting a doctor

```text
              Doctor Details Page
                       │
                       ▼
              GET /api/doctors/:id
                       │
                       ▼
            Doctor Profile Displayed
```

Checking availability

```text
                                Choose Date
                                     │
                                     ▼
            GET /api/doctors/:id/available-slots?date=YYYY-MM-DD
                                     │
                                     ▼
                         Available Slots Displayed
```

---

## Booking Appointment

```text
               Appointment Form
                       │
                       ▼
             POST /api/appointments
                       │
                       ▼
              Appointment Created
                       │
                       ▼
                    Redirect
                       │
                       ▼
               Appointments Page
```

---

## Appointment History

```text
               Appointments Page
                       │
                       ▼
     GET /api/appointments?page=1&limit=10
                       │
                       ▼
              Appointments Loaded
```

Searching

```text
               User types search
                       │
                       ▼
       GET /api/appointments?search=...
                       │
                       ▼
                Filtered Results
```

Selecting appointment

```text
              Appointment Details
                       │
                       ▼
            GET /api/appointments/:id
```

---

## Medical Records

```text
              Medical Records Page
                       │
                       ▼
            GET /api/medical-records
                       │
                       ▼
                 Records Loaded
```

Search

```text
        GET /api/medical-records?search=...
```

Selecting record

```text
          GET /api/medical-records/:id
```

---

## Prescriptions

```text
              Medical Records Page
                       │
                       ▼
            GET /api/medical-records
                       │
                       ▼
                 Records Loaded
```

Search

```text
         GET /api/prescriptions?search=...
```

Details

```text
          GET /api/prescriptions/:id
```

---

## Lab Results

```text
                Lab Results Page
                       │
                       ▼
              GET /api/lab-results
```

Search

```text
           GET /api/lab-results?search=...
```

Details

```text
             GET /api/lab-results/:id
```

---

## Invoices

```text
                 Invoices Page
                       │
                       ▼
               GET /api/invoices
```

Search

```text
           GET /api/invoices?search=...
```

Details

```text
            GET /api/invoices/:id
```

Payment

```text
                     Pay Now
                        │
                        ▼
    POST /api/payments/create-checkout-session
                        │
                        ▼
           Redirect to Stripe Checkout
                        │
                        ▼
            Webhook Updates Invoice
                        │
                        ▼
            Invoice Status Updated
```

---

# 👨‍⚕️ Doctor Workflows

## Dashboard

```text
                 Doctor Login
                      │
                      ▼
          GET /api/dashboard/doctor
```

---

## Availability

```text
               Availability Page
                       │
                       ▼
         GET /api/doctor-availability/me
```

Save

```text
          PATCH /api/doctor-availability
```

Blocked Dates

```text
         GET /api/availability-exceptions/me

           POST /api/availability-exceptions

      DELETE /api/availability-exceptions/:blockedDate
```

---

## Consultation

```text
               Appointment Details
                       │
                       ▼
            GET /api/appointments/:id
```

Create Medical Record

```text
            POST /api/medical-records
```

Create Prescription

```text
             POST /api/prescriptions
```

Create Lab Result

```text
              POST /api/lab-results
```

Create Invoice

```text
                POST /api/invoices
```

---

# 👨‍💼 Administrator Workflows

Dashboard

```text
               GET /api/dashboard/admin
```

Users

```text
                    GET /api/users
                           │
                           ▼
                  GET /api/users/:id
```

Appointments

```text
                GET /api/appointments
                           │
                           ▼
               GET /api/appointments/:id
```

Medical Records

```text
                GET /api/medical-records
                           │
                           ▼
              GET /api/medical-records/:id
```

Prescriptions

```text
                GET /api/prescriptions
                           │
                           ▼
               GET /api/prescriptions/:id
```

Lab Results

```text
                GET /api/lab-results
                           │
                           ▼
               GET /api/lab-results/:id
```

Invoices

```text
                   GET /api/invoices
                           │
                           ▼
                 GET /api/invoices/:id
```

Audit Logs

```text
                  GET /api/audit-logs
```

Analytics

```text
                   GET /api/analytics
```

---

# 🔐 Authorization Flow

```text
                        Request
                           │
                           ▼
                   JWT Authentication
                           │
                           ▼
                    Role Verification
                           │
                           ▼
                 Service Authorization
                           │
                           ▼
                    Business Logic
                           │
                           ▼
                        Response
```

---

# 🔍 Search Flow

Every searchable module follows the same pattern.

```text
                      User Types
                          │
                          ▼
                   Debounced Input
                          │
                          ▼
             GET /resource?search=value
                          │
                          ▼
                   Filtered Response
                          │
                          ▼
              React Query Cache Updated
                          │
                          ▼
                     UI Re-render
```