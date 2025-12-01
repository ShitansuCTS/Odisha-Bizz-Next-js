import ProductListing from "@/models/productListing";
import { connectDB } from "@/lib/dbConnect";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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

    // ------------------------------
    // 2️⃣ Get query filters
    // ------------------------------
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const state = searchParams.get("state");
    const status = searchParams.get("status");

    const match = {};

    // If user is not admin → restrict to their own listings
    if (userRole !== "admin") {
      match.owner = new mongoose.Types.ObjectId(userId);
    }

    if (category) match.category = category.trim().toLowerCase();
    if (state) match["address.state"] = state.trim().toLowerCase();
    if (status) match.status = status.trim().toLowerCase();

    // ------------------------------
    // 3️⃣ Aggregation Pipeline
    // ------------------------------
    const aggregationPipeline = [
      { $match: match },
      {
        $facet: {
          totalListings: [{ $count: "count" }],
          byCategory: [
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          byState: [
            { $group: { _id: "$address.state", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          byDistrict: [
            { $group: { _id: "$address.district", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          byStatus: [
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ];

    const result = await ProductListing.aggregate(aggregationPipeline);

    const analytics = {
      totalListings: result[0].totalListings[0]?.count || 0,
      byCategory: result[0].byCategory,
      byState: result[0].byState,
      byDistrict: result[0].byDistrict,
      byStatus: result[0].byStatus,
      role: userRole,
    };

    // ------------------------------
    // 4️⃣ Return analytics
    // ------------------------------
    return new Response(JSON.stringify({ success: true, data: analytics }), {
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
