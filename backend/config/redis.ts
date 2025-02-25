import { createClient } from "redis";

const redisClient = createClient({
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
  .catch((err:any) => {
    "Redis Error";
  });

redisClient.on("error", (err:any) => console.error("Redis Client Error:", err));

export default redisClient;
