import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import requireRole from "../../middleware/requireRole.js";
import { createCheckoutSessionController, } from "./payment.controller.js";

router.post( "/create-checkout-session", requireAuth, requireRole("patient"), createCheckoutSessionController );

export default router;