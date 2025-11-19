// lib/db.js
import mongoose from "mongoose";

let isConnected = false; // Track the connection

export async function connectDB() {
    if (isConnected) {
        console.log("MongoDB already connected");
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);

        isConnected = conn.connections[0].readyState === 1;

        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log("MongoDB Connection Error:", error.message);
        throw new Error("Database connection failed");
    }
}
