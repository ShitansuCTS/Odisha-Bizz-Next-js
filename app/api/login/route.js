import User from "@/models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/dbConnect";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return Response.json({ message: "All fields are required" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) return Response.json({ message: "User not found" }, { status: 401 });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return Response.json({ message: "Invalid credentials" }, { status: 401 });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: true, // in prod: HTTPS only
            sameSite: "lax",
            maxAge: 24 * 60 * 60,
            path: "/",
        });

        return Response.json({ message: "Login successful", user: { id: user._id, name: user.name, email: user.email } }, { status: 200 });

    } catch (err) {
        console.error(err);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
