export const formatAuditLog = (log) => {
    const actorName = log.actor?.name || "Someone";
    let description = "";
    switch (log.action) {
        case "appointment_booked":
            description = `${actorName} booked an appointment`;
            break;
        case "appointment_cancelled":
            description = `${actorName} cancelled an appointment`;
            break;
        case "appointment_rescheduled":
            description = `${actorName} rescheduled an appointment`;
            break;
        case "appointment_status_updated":
            description = `${actorName} updated an appointment status`;
            break;
        case "availability_exception_deleted":
            description = `${actorName} updated availability`;
            break;
        case "medical_record_created":
            description = `${actorName} created a medical record`;
            break;
        case "medical_record_updated":
            description = `${actorName} updated a medical record`;
            break;
        case "medical_record_deleted":
            description = `${actorName} deleted a medical record`;
            break;
        case "prescription_created":
            description = `${actorName} created a prescription`;
            break;
        case "prescription_updated":
            description = `${actorName} updated a prescription`;
            break;
        case "prescription_deleted":
            description = `${actorName} deleted a prescription`;
            break;
        case "lab_result_created":
            description = `${actorName} created a lab result`;
            break;
        case "lab_result_updated":
            description = `${actorName} updated a lab result`;
            break;
        case "lab_result_deleted":
            description = `${actorName} deleted a lab result`;
            break;
        case "invoice_created":
            description = `${actorName} created an invoice`;
            break;
        case "invoice_updated":
            description = `${actorName} updated an invoice`;
            break;
        case "invoice_deleted":
            description = `${actorName} deleted an invoice`;
            break;
        case "invoice_paid":
            description = `${actorName} completed an invoice payment`;
            break;
        default:
            description = `${actorName} performed an activity`;
    }
    return {
        _id: log._id,
        actor: {
            _id: log.actor?._id,
            name: actorName,
            role: log.actor?.role,
        },
        activityType: log.action,
        description,
        entityType: log.entityType,
        entityId: log.entityId,
        timestamp: log.createdAt,
    };
};