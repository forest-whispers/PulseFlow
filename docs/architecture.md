# 🏗 PulseFlow Architecture

PulseFlow is designed as a **feature-oriented, role-aware full-stack application** that models real healthcare workflows rather than isolated CRUD modules.

The application separates routing, business logic, persistence, validation, and presentation into independent layers to maximize maintainability, scalability, and extensibility.

---

# Architectural Philosophy

PulseFlow follows a few core engineering principles:

- Feature-based modular architecture
- Separation of concerns
- Thin controllers and service-driven business logic
- Role-based authorization
- RESTful API design
- Reusable validation and utility layers
- Frontend state synchronization using TanStack Query
- Clear ownership boundaries between Patient, Doctor, and Administrator workflows

Every feature is implemented as an independent module while still participating in larger clinical workflows.

---

# High-Level Architecture

![Architecture](../assets/docs/architecture.svg)

---

# Repository Structure

## Backend

```text
server/
└── src/
    ├── config/
    ├── cron/
    ├── jobs/
    ├── middleware/
    ├── modules/
    │   ├── analytics/
    │   ├── appointment/
    │   ├── auditLog/
    │   ├── availabilityException/
    │   ├── dashboard/
    │   ├── doctorAvailability/
    │   ├── doctorProfile/
    │   ├── doctorSearch/
    │   ├── invoice/
    │   ├── labResult/
    │   ├── medicalRecord/
    │   ├── notification/
    │   ├── patientProfile/
    │   ├── payment/
    │   ├── prescription/
    │   ├── search/
    │   └── user/
    ├── queues/
    ├── routes/
    ├── socket/
    ├── utils/
    └── workers/
```

## Frontend

```text
client/
├── public/
└── src/
    ├── assets/
    ├── components/
    │   └── ui/
    ├── features/
    │   ├── admin/
    │   ├── auth/
    │   ├── doctor/
    │   ├── landing/
    │   ├── notifications/
    │   └── patient/
    ├── layouts/
    ├── lib/
    ├── providers/
    ├── routes/
    └── store/
```

---

# Layer Responsibilities

## Routes

Define API endpoints and attach middleware.

Responsibilities:

- Route registration
- Authentication middleware
- Authorization middleware
- Request delegation

---

## Controllers

Controllers remain intentionally thin.

Responsibilities:

- Read request data
- Call services
- Return HTTP responses
- Forward errors

No business rules are implemented inside controllers.

---

## Services

Services contain the application's business logic.

Responsibilities include:

- Authorization checks
- Workflow orchestration
- Database operations
- Aggregations
- Validation beyond request schemas
- Audit logging
- Integration with external services

Services are designed to be reusable across controllers and internal modules.

---

## Models

Mongoose models define the application's persistent data layer.

Each feature owns its own schema while maintaining references to related entities where appropriate.

---

## Middleware

Middleware provides reusable request processing.

Examples include:

- JWT authentication
- Role-based authorization
- Error handling
- File uploads

---

## Utilities

Shared utilities provide reusable functionality across modules.

Examples:

- Cloudinary helpers
- Error classes
- Response helpers
- Formatting utilities

---

# Backend Request Lifecycle

Every request follows the same execution pipeline.

```text
                            Client
                              │
                              ▼
                        Express Route
                              │
                              ▼
                        Authentication
                              │
                              ▼
                        Authorization
                              │
                              ▼
                          Controller
                              │
                              ▼
                        Service Layer
                              │
                              ▼
                           MongoDB
                              │
                              ▼
                        HTTP Response
```

This predictable flow keeps the codebase easy to navigate and simplifies testing and debugging.

---

# Authentication & Authorization

Authentication is performed using JWT tokens.

Protected routes first verify authentication before enforcing role-specific access.

```text
                             JWT
                              │
                              ▼
                         requireAuth
                              │
                              ▼
                         requireRole
                              │
                              ▼
                         Controller
                              │
                              ▼
                     Service Authorization
                              │
                              ▼
                           Database
```

Critical authorization rules are enforced inside services to prevent bypassing business constraints even if endpoints are reused internally.

---

# Frontend Architecture

The frontend is organized by **feature** rather than by technical layer.

Each feature owns its:

- Pages
- Components
- API layer
- React Query hooks
- Validation schemas

This keeps related functionality together and scales naturally as new modules are added.

Request flow:

```text
                            Page
                              │
                              ▼
                      React Query Hook
                              │
                              ▼
                          API Layer
                              │
                              ▼
                            Axios
                              │
                              ▼
                           Backend
```

---

# Core Business Modules

| Module | Responsibility |
|---------|----------------|
| User | Authentication and accounts |
| Appointment | Scheduling and lifecycle |
| Doctor Search | Search and discovery |
| Doctor Availability | Availability management |
| Medical Record | Consultation documentation |
| Prescription | Medication management |
| Lab Result | Diagnostic reports |
| Invoice | Billing |
| Payment | Stripe Checkout |
| Dashboard | Role-specific dashboards |
| Analytics | Administrative insights |
| Audit Log | System activity history |
| Notification | User notifications |
| Search | Unified application search |

---

# Cross-Cutting Concerns

Several capabilities are shared across the platform.

- JWT Authentication
- Role-Based Access Control (RBAC)
- Zod validation
- TanStack Query cache synchronization
- Cloudinary file storage
- Stripe payment processing
- Audit logging
- Aggregation-based analytics

These concerns remain independent from feature modules to encourage reuse.

---

# Scalability Considerations

PulseFlow is structured to support future enhancements without major architectural changes.

Planned additions include:

- Redis caching
- Socket.IO real-time synchronization
- Background job processing
- Queue workers
- Email notifications
- Global search infrastructure
- Monitoring and observability
- Reporting services

The existing service-oriented architecture allows these capabilities to be introduced incrementally while minimizing changes to existing modules.