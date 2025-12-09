import ProductListing from "@/models/productListing";
import { connectDB } from "@/lib/dbConnect";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/UserModel";

export async function GET(req) {
    await connectDB();

    try {
        // ------------------------------
        // 1️⃣ Read token & decode user
        // ------------------------------
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return new Response(
                JSON.stringify({ success: false, message: "Unauthorized" }),
                { status: 401 }
            );
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return new Response(
                JSON.stringify({ success: false, message: "Invalid token" }),
                { status: 403 }
            );
        }

        const userId = decoded.id;
        const userRole = decoded.role;


        const user = await User.findById(userId).select("name email role createdAt updatedAt -_id").lean();
        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found" }),
                { status: 404 }
            );
        }


        // ------------------------------
        // 4️⃣ Return analytics
        // ------------------------------
        return new Response(JSON.stringify({ success: true, user }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (err) {
        console.error("Error fetching analytics:", err);
        return new Response(
            JSON.stringify({ success: false, message: "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}






export async function PUT(req) {
    await connectDB();

    try {
        // ✅ Await the cookies() promise
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            // console.log("No token found");
            return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            // console.log("JWT verification failed:", err);
            return new Response(JSON.stringify({ success: false, message: "Invalid token" }), { status: 403 });
        }

        const userId = decoded.id;

        // Read JSON safely
        let body;
        try {
            body = await req.json();
        } catch (err) {
            // console.log("Failed to parse JSON body:", err);
            return new Response(JSON.stringify({ success: false, message: "Invalid JSON body" }), { status: 400 });
        }

        const { name, email } = body;
        if (!name || !email) {
            // console.log("Missing name or email");
            return new Response(JSON.stringify({ success: false, message: "Name and Email are required" }), { status: 400 });
        }

        // console.log("Updating user:", userId, "with", name, email);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true, runValidators: true, select: "name email role createdAt updatedAt -_id" }
        ).lean();

        if (!updatedUser) {
            // console.log("User not found for update:", userId);
            return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
        }

        // console.log("User updated successfully:", updatedUser);
        return new Response(JSON.stringify({ success: true, user: updatedUser }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (err) {
        // console.error("Error updating user:", err);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500 });
    }
}
