# 📚 API Reference

PulseFlow exposes a RESTful API organized around feature modules. Every endpoint follows a consistent response structure and role-based authorization model.

Base URL

```text
/api
```

---

# Authentication

Authentication is performed using **JWT stored in an HTTP-only cookie**.

Protected endpoints require a valid authenticated session.

Role-based authorization is enforced throughout the service layer.

Supported roles:

- Patient
- Doctor
- Administrator

---

# Standard Response Format

Successful responses

```json
{
  "success": true,
  "data": {}
}
```

Successful responses with message

```json
{
  "success": true,
  "message": "operation successful",
  "data": {}
}
```

Error responses

```json
{
  "success": false,
  "message": "Resource not found"
}
```

---

# Role Access Matrix

| Module | Patient | Doctor | Admin |
|---------|:------:|:------:|:-----:|
| Authentication | ✅ | ✅ | ✅ |
| User Management | ❌ | ❌ | ✅ |
| Patient Profile | ✅ | ❌ | ❌ |
| Doctor Profile | ❌ | ✅ | ❌ |
| Doctor Search | ✅ | ✅ | ✅ |
| Doctor Availability | ❌ | ✅ | ❌ |
| Availability Exceptions | ❌ | ✅ | ❌ |
| Appointments | ✅ | ✅ | ✅ |
| Medical Records | ✅ | ✅ | ✅ |
| Prescriptions | ✅ | ✅ | ✅ |
| Lab Results | ✅ | ✅ | ✅ |
| Invoices | ✅ | ✅ | ✅ |
| Payments | ✅ | ❌ | ❌ |
| Notifications | ✅ | ✅ | ✅ |
| Dashboards | ✅ | ✅ | ✅ |
| Audit Logs | ❌ | ❌ | ✅ |
| Analytics | ❌ | ❌ | ✅ |

---

# API Modules

## Authentication

Base URL

```text
/api/users
```

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /register | Register account |
| POST | /login | Login |
| GET | /logout | Logout |

---

## Users

```text
/api/users
```

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | / | List all users (Admin) |
| GET | /:id | User details |

---

## Patient Profile

```text
/api/patients
```

| Method | Endpoint |
|---------|----------|
| GET | /me |
| PATCH | /me |
| PATCH | /profile-picture |

---

## Doctor Search

```text
/api/doctors
```

| Method | Endpoint |
|---------|----------|
| GET | / |
| GET | /:id |
| GET | /:id/available-slots |

---

## Doctor Profile

```text
/api/doctor-profile
```

| Method | Endpoint |
|---------|----------|
| GET | /me |
| PATCH | /me |
| PATCH | /profile-picture |

---

## Doctor Availability

```text
/api/doctor-availability
```

| Method | Endpoint |
|---------|----------|
| GET | /me |
| PATCH | / |

---

## Availability Exceptions

```text
/api/availability-exceptions
```

| Method | Endpoint |
|---------|----------|
| POST | / |
| GET | /me |
| DELETE | /:blockedDate |

---

## Appointments

```text
/api/appointments
```

| Method | Endpoint |
|---------|----------|
| POST | / |
| GET | / |
| GET | /:id |
| PATCH | /:id/status |
| PATCH | /:id/cancel |
| PATCH | /:id/reschedule |

---

## Medical Records

```text
/api/medical-records
```

| Method | Endpoint |
|---------|----------|
| POST | / |
| GET | / |
| GET | /:id |
| PATCH | /:id |
| DELETE | /:id |

---

## Prescriptions

```text
/api/prescriptions
```

| Method | Endpoint |
|---------|----------|
| POST | / |
| GET | / |
| GET | /:id |
| PATCH | /:id |
| DELETE | /:id |

---

## Lab Results

```text
/api/lab-results
```

| Method | Endpoint |
|---------|----------|
| POST | / |
| GET | / |
| GET | /:id |
| PATCH | /:id |
| DELETE | /:id |

---

## Invoices

```text
/api/invoices
```

| Method | Endpoint |
|---------|----------|
| POST | / |
| GET | / |
| GET | /:id |
| PATCH | /:id |
| DELETE | /:id |

---

## Payments

```text
/api/payments
```

| Method | Endpoint |
|---------|----------|
| POST | /create-checkout-session |
| POST | /webhook |

---

## Notifications

```text
/api/notifications
```

| Method | Endpoint |
|---------|----------|
| GET | / |
| GET | /unread-count |
| PATCH | /:id/read |
| PATCH | /read-all |

---

## Dashboards

```text
/api/dashboard
```

| Method | Endpoint |
|---------|----------|
| GET | /patient |
| GET | /doctor |
| GET | /admin |

---

## Audit Logs

```text
/api/audit-logs
```

| Method | Endpoint |
|---------|----------|
| GET | / |

---

## Analytics

```text
/api/analytics
```

| Method | Endpoint |
|---------|----------|
| GET | / |

---

# Pagination

Endpoints returning collections follow a common pagination structure.

Query parameters

```text
?page=1
&limit=10
```

Response

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 120,
    "totalPages": 12
  }
}
```

---

# Search & Filtering

Several collection endpoints support searching and filtering through query parameters.

Examples

```text
GET /appointments?status=confirmed

GET /medical-records?search=headache

GET /prescriptions?search=paracetamol

GET /users?role=doctor&search=rajesh
```

---

# File Uploads

Multipart endpoints

- Patient Profile Picture
- Doctor Profile Picture
- Medical Record Attachments
- Laboratory Reports

Cloudinary is used for persistent media storage.

---

# Payments

Stripe Checkout is used for online invoice payments.

Typical flow

```text
                           Invoice
                              │
                              ▼
                   Create Checkout Session
                              │
                              ▼
                       Stripe Checkout
                              │
                              ▼
                           Webhook
                              │
                              ▼
                       Invoice Updated
                              │
                              ▼
                         Notification
                              │
                              ▼
                          Audit Log
```

---

# Error Handling

The API returns appropriate HTTP status codes.

| Status | Meaning |
|---------|----------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

# Future Enhancements

Planned API improvements include:

- Global search
- Redis-backed caching
- Background jobs
- WebSocket events
- Broadcast notifications
- API versioning
- OpenAPI/Swagger documentation