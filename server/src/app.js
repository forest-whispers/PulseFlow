import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { globalRateLimiter } from "./middleware/rateLimiter.js";
import errorHandler from './utils/error.js'
import indexRouter from "./routes/index.js";
import paymentWebhookRouter from "./modules/payment/payment.webhook.routes.js";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://pulse-flow-6tvh981sk-forest-whispers-projects.vercel.app",
    "https://pulse-flow-two.vercel.app"
];

app.use(globalRateLimiter);

app.use("/api/payments/webhook", paymentWebhookRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true
    }),
);
app.use(helmet());

// app.use(mongoSanitize());

app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("API Running");
});

app.use("/api", indexRouter);

app.use(errorHandler);

export default app;