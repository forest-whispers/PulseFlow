import { Queue } from "bullmq";

import redisConnection from "../config/redis.js";

const reminderQueue = new Queue("appointment-reminders", {
    connection: redisConnection,
    defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 500,
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
    },
});

export default reminderQueue;