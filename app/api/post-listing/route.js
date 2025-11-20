"use server";

import { NextResponse } from "next/server";
import ProductListing from "@/models/productListing";
import { connectDB } from "@/lib/dbConnect";
import cloudinary from "@/lib/cloudinary";

// Connect to MongoDB
connectDB();

export async function POST(req) {
    try {
        // Parse multipart/form-data
        const formData = await req.formData();

        // Extract fields
        let title = formData.get("title");
        let description = formData.get("description");
        let category = formData.get("category");
        let email = formData.get("email");
        let phone = formData.get("phone");
        let address = JSON.parse(formData.get("address") || "{}");
        let socialMedia = JSON.parse(formData.get("socialMedia") || "{}");
        const imageFile = formData.get("image"); // File

        if (!title || !description || !category || !email || !phone || !address.district || !address.state || !address.pincode) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Upload image to Cloudinary
        let imageUrl = "";
        let imagePublicId = "";
        if (imageFile && imageFile.size > 0) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const uploadRes = await cloudinary.uploader.upload_stream(
                { folder: "listings" },
                async (error, result) => {
                    if (error) throw error;
                    imageUrl = result.secure_url;
                    imagePublicId = result.public_id;
                }
            );
            const stream = uploadRes;
            stream.end(buffer);
        }

        // Create listing
        const newListing = new ProductListing({
            title,
            description,
            category,
            email,
            phone,
            address,
            socialMedia,
            imageUrl,
            imagePublicId,
        });

        await newListing.save();
        // console.log(newListing);

        return NextResponse.json({ success: true, listing: newListing }, { status: 201 });
    } catch (err) {
        console.error("Error creating listing:", err);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
