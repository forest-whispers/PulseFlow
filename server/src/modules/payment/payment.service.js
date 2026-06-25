import Invoice from "../invoice/invoice.model.js";
import stripe from "./stripe.js";
import { createNotificationService } from "../notification/notification.service.js";
import { createAuditLogService } from "../auditLog/auditLog.service.js";
import { NotFoundError, ForbiddenError, BadRequestError } from "../../utils/error.js";

export const createCheckoutSessionService = async (currUser, invoiceId) => {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
        throw new NotFoundError("Invoice not found");
    }
    if (invoice.patient.toString() !== currUser.id) {
        throw new ForbiddenError("You cannot pay this invoice");
    }
    if (invoice.status === "paid") {
        throw new BadRequestError("Invoice has already been paid");
    }
    if (invoice.paymentMethod !== "stripe") {
        throw new BadRequestError("This invoice cannot be paid using Stripe");
    }
    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Hospital Invoice",
                        description: invoice.description || "Hospital Consultation",
                    },
                    unit_amount: invoice.amount * 100,
                },
                quantity: 1,
            },
        ],
        metadata: {
            invoiceId: invoice._id.toString(),
        },
        success_url: `${process.env.CLIENT_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/payments/cancel`,
    });
    invoice.stripeSessionId = session.id;
    await invoice.save();
    return { checkoutUrl: session.url, };
};

export const stripeWebhookService = async (signature, rawBody) => {
    let event;
    try {
        event = stripe.webhooks.constructEvent( rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET, );
    }
    catch (error) {
        throw error;
    }
    if (event.type !== "checkout.session.completed") {
        return;
    }
    const session = event.data.object;
    if (session.payment_status !== "paid") {
        return;
    }
    const invoice = await Invoice.findById(session.metadata.invoiceId);
    if (!invoice) {
        return;
    }
    if (invoice.stripeSessionId !== session.id) {
        return;
    }
    if (invoice.status === "paid") {
        return;
    }
    invoice.status = "paid";
    invoice.paidAt = new Date();
    invoice.stripePaymentIntentId = session.payment_intent;
    await invoice.save();
    await createNotificationService( invoice.patient, "Payment Successful", "Your invoice has been paid successfully.",);
    await createAuditLogService( invoice.patient, "invoice_paid", "invoice", invoice._id, {}, );
};