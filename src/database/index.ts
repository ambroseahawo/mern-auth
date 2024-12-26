import { config } from "@/config/app.config";
import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(`Error connecting to Database: ${error}`);
    process.exit(1);
  }
};

export default connectDatabase;
