import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
    try {
        console.log("Trying to connect to:", process.env.MONGODB_URI);
        //Attempt to connect to the database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("Error connecting to MongoDB:", error.message);
        // Exit the Node process if the connection fails (prevents the app from running broken)
        process.exit(1);
    }
}

export default connectDB;