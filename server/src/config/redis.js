import Redis from "ioredis";

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    maxRetriesPerRequest: null,
});

redisClient.on("connect", () => {
    console.log("Redis Connected");
});
redisClient.on("error", (error) => {
    console.error("Redis Error:", error.message);
});

export default redisClient;