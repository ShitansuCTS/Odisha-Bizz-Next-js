import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import ProductListing from "@/models/productListing";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

connectDB();

export async function GET(req) {
    try {
        // Get JWT token from cookie
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id; // the logged-in user's ID
        } catch (err) {
            return NextResponse.json({ message: "Invalid token" }, { status: 403 });
        }

        // Pagination (optional)
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        // Filter by owner
        const filter = { owner: userId };

        const listings = await ProductListing.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await ProductListing.countDocuments(filter);

        return NextResponse.json({
            listings,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error("Error fetching my listings:", err);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
