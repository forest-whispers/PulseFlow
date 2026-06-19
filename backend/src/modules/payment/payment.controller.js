import { createCheckoutSessionService, stripeWebhookService } from "./payment.service.js";

export const createCheckoutSessionController = async (req, res, next) => {
    try {
        const { invoiceId } = req.body;
        const checkoutSession = await createCheckoutSessionService( req.user, invoiceId, );
        res.status(200).json(checkoutSession);
    }
    catch (error) {
        next(error);
    }
};

export const stripeWebhookController = async (req, res, next) => {
    try {
        const signature = req.headers["stripe-signature"];
        await stripeWebhookService(signature, req.body);
        res.status(200).json({
            received: true,
        });
    }
    catch (error) {
        next(error);
    }
};