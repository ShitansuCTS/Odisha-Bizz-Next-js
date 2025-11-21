import { connectDB } from "@/lib/dbConnect"; // Your MongoDB connection helper
import ProductListing from "@/models/productListing";

connectDB(); // Ensure DB is connected

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category") || "";
        const status = searchParams.get("status") || "";
        const state = searchParams.get("state") || "";
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;

        // Build filter dynamically
        const filter = {};
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (state) filter["address.state"] = state;

        const skip = (page - 1) * limit;

        const listings = await ProductListing.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await ProductListing.countDocuments(filter);

        return new Response(
            JSON.stringify({
                listings,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("Error fetching listings:", err);
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
