require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully", process.env.MONGO_URI);

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
