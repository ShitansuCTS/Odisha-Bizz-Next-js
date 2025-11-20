import ProductListing from "@/models/productListing";
import { connectDB } from "@/lib/dbConnect";

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
            return new Response(JSON.stringify({ mainListings: [], related: [] }), { status: 400 });
        }

        // 1️⃣ Get main listings in the same district with the slug
        const mainListings = await ProductListing.find({
            categorySlug: slug,
            "address.district": { $regex: district, $options: "i" },
        });

        if (!mainListings.length) {
            return new Response(JSON.stringify({ mainListings: [], related: [] }), { status: 200 });
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
            categorySlug: { $ne: slug },
            status: "active",
            $or: keywordRegexArr,
        });

        return new Response(JSON.stringify({ mainListings, related }), { status: 200 });
    } catch (err) {
        console.error("Error fetching listings:", err);
        return new Response(JSON.stringify({ mainListings: [], related: [], error: "Server error" }), { status: 500 });
    }
}
