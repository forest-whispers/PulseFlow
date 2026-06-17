import express from "express";
const router = express.Router();

import { searchDoctorsController } from "./doctorSearch.controller.js";
import { validate } from "../../middleware/validate.js";
import { doctorSearchQuerySchema, } from './doctorSearch.validation.js';

router.get("/", validate(doctorSearchQuerySchema, "query"), searchDoctorsController);

export default router;