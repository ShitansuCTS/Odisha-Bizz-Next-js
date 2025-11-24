import User from "@/models/UserModel";   // adjust the path as per your folder
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/dbConnect"; // you MUST connect to MongoDB

export async function POST(req) {
    try {
        await connectDB(); // Connect to MongoDB

        const body = await req.json();
        const { name, email, password } = body;

        // console.log("Signup data:", body);


        if (!name || !email || !password) {
            return Response.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return Response.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",  // default
        });


        console.log("New user created:", newUser);
        return Response.json(
            {
                message: "Signup successful",
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return Response.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
