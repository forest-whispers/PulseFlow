import express from "express";
const router = express.Router();

import { getAvailableSlotsController,} from "./slot.controller.js";

router.get( "/doctor/:doctorId/slots", getAvailableSlotsController );

export default router;