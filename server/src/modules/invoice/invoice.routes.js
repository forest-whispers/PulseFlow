import express from "express";
const router = express.Router();

import requireAuth from "../../middleware/requireAuth.js";
import requireRole from "../../middleware/requireRole.js";
import { createInvoiceController, getInvoiceController, getMyInvoicesController, updateInvoiceController, deleteInvoiceController } from "./invoice.controller.js";
import { validate } from "../../middleware/validate.js";
import { createInvoiceSchema, updateInvoiceSchema } from "./invoice.validation.js";

router.post("/", requireAuth, requireRole("doctor"), validate(createInvoiceSchema), createInvoiceController);

router.get("/", requireAuth, getMyInvoicesController);

router.get("/:id", requireAuth, getInvoiceController);

router.patch("/:id", requireAuth, requireRole("doctor"), validate(updateInvoiceSchema), updateInvoiceController);

router.delete("/:id", requireAuth, requireRole("doctor"), deleteInvoiceController);

export default router;