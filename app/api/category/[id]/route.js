import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Category from "@/models/categoryModel";
import cloudinary from "@/lib/cloudinary";




/**
 * ✅ UPDATE CATEGORY
 */
export async function PUT(req, { params }) {
    try {

        await connectDB();
        const { id } = await params; // ✅ FIX

        const formData = await req.formData();
        const name = formData.get("name");
        const order = formData.get("order") || 0;
        const imageFile = formData.get("image");
        const metaTitle = formData.get("metaTitle");
        const metaDescription = formData.get("metaDescription");

        const category = await Category.findById(id);

        if (!category) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        if (name) category.name = name;
        category.order = order;

        // ✅ SEO update
        if (metaTitle !== null) category.metaTitle = metaTitle;
        if (metaDescription !== null) category.metaDescription = metaDescription;

        if (imageFile && imageFile.size > 0) {
            if (category.imagePublicId) {
                await cloudinary.uploader.destroy(category.imagePublicId);
            }

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

            category.imageUrl = uploadResult.secure_url;
            category.imagePublicId = uploadResult.public_id;
        }

        await category.save();

        return NextResponse.json(
            { success: true, category },
            { status: 200 }
        );

    } catch (error) {
        console.error("UPDATE ERROR:", error); // 👈 ADD THIS
        return NextResponse.json(
            { success: false, message: "Update failed" },
            { status: 500 }
        );
    }
}


/**
 * ✅ DELETE CATEGORY
 */

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = await params; // ✅ FIX

        const category = await Category.findById(id);

        if (!category) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        // delete image
        if (category.imagePublicId) {
            await cloudinary.uploader.destroy(category.imagePublicId);
        }

        await Category.findByIdAndDelete(id);

        return NextResponse.json(
            { success: true, message: "Deleted successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("DELETE ERROR:", error); // 👈 ADD THIS
        return NextResponse.json(
            { success: false, message: "Delete failed" },
            { status: 500 }
        );
    }
}