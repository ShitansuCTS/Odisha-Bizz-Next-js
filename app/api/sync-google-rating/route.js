"use server";
import { NextResponse } from "next/server";
import ProductListing from "@/models/productListing";
import { connectDB } from "@/lib/dbConnect";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

export async function GET() {
    await connectDB();

    try {

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const expiryTime = new Date(Date.now() - ONE_MONTH);

        // ✅ TOTAL listings
        const total = await ProductListing.countDocuments({
            googlePlaceId: { $exists: true, $ne: "" }
        });

        // ✅ UPDATED (fresh within 24h)
        const updated = await ProductListing.countDocuments({
            googlePlaceId: { $exists: true, $ne: "" },
            googleLastUpdated: { $gte: expiryTime }
        });

        // ✅ PENDING (need update)
        const pending = await ProductListing.countDocuments({
            googlePlaceId: { $exists: true, $ne: "" },
            $or: [
                { googleLastUpdated: { $exists: false } },
                { googleLastUpdated: { $lt: expiryTime } }
            ]
        });

        // ✅ Fetch ONLY expired listings (LIMIT 20)
        const listings = await ProductListing.find({
            googlePlaceId: { $exists: true, $ne: "" },
            $or: [
                { googleLastUpdated: { $exists: false } },
                { googleLastUpdated: { $lt: expiryTime } }
            ]
        })
            .sort({ googleLastUpdated: 1 }) // 🔥 oldest first
            .limit(20);

        console.log("Updating listings count:", listings.length);

        let successUpdates = 0;

        for (let listing of listings) {
            try {
                const res = await fetch(
                    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${listing.googlePlaceId}&fields=rating,user_ratings_total&key=${process.env.GOOGLE_API_KEY}`
                );

                const data = await res.json();

                if (data.result) {
                    listing.googleRating = data.result.rating || 0;
                    listing.googleReviewsCount = data.result.user_ratings_total || 0;
                    listing.googleLastUpdated = new Date();

                    await listing.save();
                    successUpdates++;
                }

                // ✅ delay to avoid rate limit
                await new Promise((r) => setTimeout(r, 200));

            } catch (err) {
                console.error("Error updating:", listing.title);
            }
        }

        return NextResponse.json({
            success: true,

            // 🔥 CURRENT RUN
            updatedNow: successUpdates,

            // 📊 SYSTEM STATUS
            total,
            updated,
            pending,

            message: "Smart sync completed"
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false });
    }
}