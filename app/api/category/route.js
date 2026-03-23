"use server";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Category from "@/models/categoryModel";
import cloudinary from "@/lib/cloudinary";

await connectDB();

/**
 * ✅ GET ALL CATEGORIES
 */
export async function GET() {
    try {
        const categories = await Category.find()
            .sort({ order: 1, createdAt: -1 });

        return NextResponse.json(
            { success: true, categories },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET CATEGORY ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch categories" },
            { status: 500 }

        );
    }
}






/**
 * ✅ CREATE CATEGORY
 */
export async function POST(req) {
    try {
        const formData = await req.formData();

        const name = formData.get("name");
        const order = formData.get("order") || 0;
        const imageFile = formData.get("image");

        if (!name) {
            return NextResponse.json(
                { success: false, message: "Name is required" },
                { status: 400 }
            );
        }

        // 🔍 Check duplicate
        const existing = await Category.findOne({
            name: name.toLowerCase().trim(),
        });

        if (existing) {
            return NextResponse.json(
                { success: false, message: "Category already exists" },
                { status: 400 }
            );
        }

        let imageUrl = "";
        let imagePublicId = "";

        // 📤 Upload image (optional)
        if (imageFile && imageFile.size > 0) {
            const buffer = Buffer.from(await imageFile.arrayBuffer());

            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "categories" },
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

        const newCategory = new Category({
            name,
            order,
            imageUrl,
            imagePublicId,
        });

        await newCategory.save();

        return NextResponse.json(
            { success: true, category: newCategory },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST CATEGORY ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create category" },
            { status: 500 }
        );
    }
}