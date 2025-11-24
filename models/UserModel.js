import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
    },
    { timestamps: true }
);

// Avoid model overwrite in Next.js hot reload
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
