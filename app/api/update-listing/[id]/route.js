import { connectDB } from "@/lib/dbConnect";
import ProductListing from "@/models/productListing";
import { v2 as cloudinary } from "cloudinary";



// ⭐ FIX: Cloudinary config IN THIS ROUTE
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function PUT(req, context) {
    try {
        await connectDB();

        // ⬅️ FIXED: unwrap params
        const { id } = await context.params;

        const contentType = req.headers.get("content-type");

        let title, description, category, email, phone, address, socialMedia, status;
        let file = null;

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();

            title = formData.get("title");
            description = formData.get("description");
            category = formData.get("category");
            email = formData.get("email");
            phone = formData.get("phone");
            status = formData.get("status");

            address = JSON.parse(formData.get("address"));
            socialMedia = JSON.parse(formData.get("socialMedia"));

            file = formData.get("image");
        } else {
            const body = await req.json();
            ({ title, description, category, email, phone, address, socialMedia, status } = body);
        }

        const listing = await ProductListing.findById(id);
        if (!listing) {
            return new Response(JSON.stringify({ success: false, message: "Listing not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        listing.title = title || listing.title;
        listing.description = description || listing.description;
        listing.category = category || listing.category;
        listing.email = email || listing.email;
        listing.phone = phone || listing.phone;
        listing.address = address || listing.address;
        listing.socialMedia = socialMedia || listing.socialMedia;
        listing.status = status || listing.status;

        if (file) {
            if (listing.imagePublicId) {
                try {
                    await cloudinary.uploader.destroy(listing.imagePublicId);
                } catch (err) {
                    console.log("❌ Cloudinary delete failed:", err);
                }
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream({ folder: "listings" }, (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    })
                    .end(buffer);
            });

            listing.imageUrl = uploadResponse.secure_url;
            listing.imagePublicId = uploadResponse.public_id;
        }

        await listing.save();

        return new Response(
            JSON.stringify({
                success: true,
                message: "Listing updated successfully",
                listing,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("🔥 Error updating listing:", err);
        return new Response(
            JSON.stringify({ success: false, message: err.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
