import mongoose from "mongoose";
import env from "./env.config";

export default async function connectDB() {
  try {
    await mongoose.connect(env.ATLAS);
    console.info("[success] Connected to Atlas database server.");
  } catch (error) {
    console.error("[error] Failed to connect to Atlas database server. Error:", (error as Error).message);
    process.exit(2);
  }
}