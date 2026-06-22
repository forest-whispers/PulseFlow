import express from "express";
const router = express.Router();

import { searchDoctorsController, getDoctorDetailsController, getAvailableSlotsController, } from "./doctorSearch.controller.js";
import { validate } from "../../middleware/validate.js";
import { doctorSearchQuerySchema, } from './doctorSearch.validation.js';

router.get("/", validate(doctorSearchQuerySchema, "query"), searchDoctorsController);
router.get("/:id", getDoctorDetailsController);
router.get("/:id/available-slots", getAvailableSlotsController);

export default router;