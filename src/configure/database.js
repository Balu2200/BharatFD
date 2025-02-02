const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION, {});
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Error in connection", err.message);
    process.exit(1);
  }
};

const disconnectDb = async () => {
  try {
    await mongoose.disconnect();
    console.log("Database disconnected successfully");
  } catch (err) {
    console.error("Error in disconnecting", err.message);
  }
};

module.exports = {
  connectDb,
  disconnectDb,
};
