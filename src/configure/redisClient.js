require("dotenv").config();
const { createClient } = require("redis");

const client = createClient({
  username: process.env.REDIS_USERNAME, 
  password: process.env.REDIS_PASSWORD, 
  socket: {
    host: process.env.REDIS_HOST, 
    port: process.env.REDIS_PORT, 
  },
});

client.on("error", (err) => console.error("Redis Error:", err));

client.connect().then(() => console.log("Connected to Redis"));

module.exports = client;
