import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("✅ Database Connected Successfully.");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1); // Exit the process if DB connection fails
  }
};

export default connectDB;
