import dotenv from "dotenv";
import mongoose from "mongoose";
import Admin from "./models/Admin.model.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const exists = await Admin.findOne({ username: "admin" });
    if (exists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    await Admin.create({ username: "admin", password: "admin123" });
    console.log("✅ Admin created successfully");
    console.log("Username: admin");
    console.log("Password: admin123");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedAdmin();
