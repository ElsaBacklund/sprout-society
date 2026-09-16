import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI saknas i miljövariablerna (.env)");
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Ansluten till MongoDB");
  } catch (error) {
    console.error("❌ Kunde inte ansluta till MongoDB:", error);
    process.exit(1);
  }
}
