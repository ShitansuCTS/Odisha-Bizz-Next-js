"use server";

import { NextResponse } from "next/server";
import ProductListing from "@/models/productListing";
import { connectDB } from "@/lib/dbConnect";
import cloudinary from "@/lib/cloudinary";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(req) {
    try {
        const formData = await req.formData();

        const title = formData.get("title");
        const description = formData.get("description");
        const category = formData.get("category");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const address = JSON.parse(formData.get("address") || "{}");
        const socialMedia = JSON.parse(formData.get("socialMedia") || "{}");
        const imageFile = formData.get("image");

        if (!title || !description || !category || !email || !phone || !address.district || !address.state || !address.pincode) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        let imageUrl = "";
        let imagePublicId = "";

        if (imageFile && imageFile.size > 0) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "listings" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(buffer);
            });

            imageUrl = uploadResult.secure_url;
            imagePublicId = uploadResult.public_id;
        }

        // ✅ NEW: get logged-in user ID from JWT cookie
        const cookieStore = await cookies(); // await the cookies()
        const token = cookieStore.get("token")?.value;
        // console.log(token);


        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id; // 👈 user ID
        } catch (err) {
            return NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 });
        }


        let googlePlaceId = "";

        if (title && address?.district && address?.state) {
            try {
                const query = `${title} ${address.district} ${address.state}`;

                const res = await fetch(
                    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${process.env.GOOGLE_API_KEY}`
                );

                const data = await res.json();

                if (data.candidates && data.candidates.length > 0) {
                    googlePlaceId = data.candidates[0].place_id;
                }
            } catch (err) {
                console.error("Place ID fetch error:", err);
            }
        }




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
            owner: userId, // 👈 attach logged-in user
            googlePlaceId
        });


        console.log("The new listing Data is : ", newListing);

        await newListing.save();
        return NextResponse.json({ success: true, listing: newListing }, { status: 201 });
    } catch (err) {
        console.error("Error creating listing:", err);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
