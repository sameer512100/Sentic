import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not set in environment ❌");
  }

  await mongoose.connect(uri, {
    autoIndex: true,
  });

  console.log("MongoDB connected ✅");
};
