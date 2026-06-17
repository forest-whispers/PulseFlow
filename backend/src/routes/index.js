import express from "express";
const router = express.Router();

import appointmentRoutes from "../modules/appointment/appointment.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import doctorSearchRoutes from "../modules/doctorSearch/doctorSearch.routes.js";

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API Working",
    });
});

router.use("/appointments", appointmentRoutes);
router.use("/users", userRoutes);
router.use("/doctors", doctorSearchRoutes);

export default router;