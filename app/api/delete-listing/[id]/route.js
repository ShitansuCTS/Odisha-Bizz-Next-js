import { connectDB } from "@/lib/dbConnect";
import ProductListing from "@/models/productListing";

export async function DELETE(req, { params }) {
    await connectDB();

    const resolvedParams = await params; // unwrap the promise
    const { id } = resolvedParams;

    try {
        const deletedListing = await ProductListing.findByIdAndDelete(id);
        if (!deletedListing) {
            return new Response(JSON.stringify({ success: false, message: "Listing not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
        }
        return new Response(JSON.stringify({ success: true, message: "Deleted successfully", deletedListing }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}

