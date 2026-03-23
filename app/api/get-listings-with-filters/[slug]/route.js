import ProductListing from "@/models/productListing";
import { connectDB } from "@/lib/dbConnect";
import Category from "@/models/categoryModel";
import { ThermometerSnowflake } from "lucide-react";

connectDB(); // connect to MongoDB

// Escape regex special characters
const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

// Helper: extract keywords from a string
const extractKeywords = (text) => {
    if (!text) return [];
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/gi, "") // remove special chars
        .split(/\s+/)
        .filter((word) => word.length > 3); // ignore very short words
};

// GET /api/get-listings-with-filters/[slug]?district=...
export async function GET(req, { params }) {
    try {
        const { slug } = await params; // 👈 FIX

        const url = new URL(req.url);
        const district = url.searchParams.get("district");






        if (!district || !slug) {
            return new Response(JSON.stringify({ mainListings: [], related: [], otherListings: [] }), { status: 400 });
        }

        // here i am getting ThermometerSnowflake
        // The data is : { slug: 'internet-service-provider', district: 'Khordha' }




        // ✅ Get category document
        const categoryDoc = await Category.findOne({ slug });


        // console.log("The data is :", { slug, district, categoryDoc });


        if (!categoryDoc) {
            return new Response(JSON.stringify({
                mainListings: [],
                related: [],
                otherListings: []
            }), { status: 404 });
        }

        // 1️⃣ Get main listings in the same district with the slug
        const mainListings = await ProductListing.find({
            category: categoryDoc._id,
            "address.district": { $regex: district, $options: "i" },
            status: "active",
        })
            .populate("category", "name slug imageUrl") // ✅ ADD THIS
            .sort({ googleRating: -1, googleReviewsCount: -1 });

        // console.log("mainListings", mainListings);


        if (!mainListings.length) {
            return new Response(JSON.stringify({ mainListings: [], related: [], otherListings: [] }), { status: 200 });
        }

        // 2️⃣ Extract keywords from titles and descriptions
        let keywords = [];
        mainListings.forEach((listing) => {
            keywords.push(...extractKeywords(listing.title));
            keywords.push(...extractKeywords(listing.description));
        });
        keywords = [...new Set(keywords)]; // unique

        if (!keywords.length) {
            return new Response(JSON.stringify({ mainListings, related: [] }), { status: 200 });
        }

        // 3️⃣ Find related categories in the same district matching these keywords
        const keywordRegexArr = keywords.map((word) => ({
            $or: [
                { title: { $regex: `.*${escapeRegex(word)}.*`, $options: "i" } },
                { description: { $regex: `.*${escapeRegex(word)}.*`, $options: "i" } },
            ],
        }));

        const related = await ProductListing.distinct("category", {
            "address.district": { $regex: district, $options: "i" },
            category: { $ne: categoryDoc._id },
            status: "active",
            $or: keywordRegexArr,
        });


        // 4️⃣ OTHER LISTINGS (Grouped by category)
        const otherListings = await ProductListing.aggregate([
            {
                $match: {
                    "address.district": { $regex: district, $options: "i" },
                    categorySlug: { $ne: slug },
                    status: "active"
                }
            },

            // 🔥 JOIN with category collection
            {
                $lookup: {
                    from: "categories", // ⚠️ collection name in MongoDB
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryData"
                }
            },

            // convert array → object
            {
                $unwind: "$categoryData"
            },

            {
                $group: {
                    _id: {
                        category: "$categoryData.name",
                        slug: "$categoryData.slug"
                    },
                    count: { $sum: 1 }
                }
            },

            {
                $project: {
                    _id: 0,
                    category: "$_id.category",
                    categorySlug: "$_id.slug",
                    count: 1
                }
            }
        ]);


        console.log("Othe listing are :", otherListings);


        return new Response(JSON.stringify({ mainListings, related, otherListings }), { status: 200 });
    } catch (err) {
        console.error("Error fetching listings:", err);
        return new Response(JSON.stringify({ mainListings: [], related: [], otherListings: [], error: "Server error" }), { status: 500 });
    }
}
