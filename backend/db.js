const mongoose = require("mongoose");
require("dotenv").config();
const mongoURL = process.env.MONGO_URL;
const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURL, {});
    console.log("✅ Connected to Mongo Successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Optional: stop the app if DB fails
  }
};

module.exports = connectToMongo;
