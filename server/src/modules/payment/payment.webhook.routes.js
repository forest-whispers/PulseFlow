import express from "express";
const router = express.Router();

import { stripeWebhookController, } from "./payment.controller.js";

router.post("/", express.raw({ type: "application/json", }), stripeWebhookController);

export default router;