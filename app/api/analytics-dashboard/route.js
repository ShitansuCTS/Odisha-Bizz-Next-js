import ProductListing from "@/models/productListing"; // Adjust path
import {connectDB} from "@/lib/dbConnect"; // Your Mongoose connect helper

export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const state = searchParams.get("state");
    const status = searchParams.get("status");

    const match = {};
    if (category) match.category = category.trim().toLowerCase();
    if (state) match["address.state"] = state.trim().toLowerCase();
    if (status) match.status = status.trim().toLowerCase();

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
    };

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
