"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    socket: {
        host: "redis-12675.c212.ap-south-1-1.ec2.cloud.redislabs.com",
        port: 12675,
        connectTimeout: 10000,
    },
    password: "dssYpBnYQrl01GbCGVhVq2e4dYvUrKJB",
    username: "default",
});
redisClient
    .connect()
    .then(() => {
    console.log("Connected to Redis");
})
    .catch((err) => {
    "Redis Error";
});
redisClient.on("error", (err) => console.error("Redis Client Error:", err));
exports.default = redisClient;
