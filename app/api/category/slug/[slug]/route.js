import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Category from "@/models/categoryModel";

export async function GET(req, { params }) {
    try {
        await connectDB();

        const { slug } = await params;

        console.log("slug", slug);

        const category = await Category.findOne({ slug });

        console.log("category", category);

        if (!category) {
            return NextResponse.json(
                { success: false, message: "Category not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, category },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Error fetching category" },
            { status: 500 }
        );
    }
}