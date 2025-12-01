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
