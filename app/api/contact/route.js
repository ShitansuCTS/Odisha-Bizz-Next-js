import Lead from "@/models/leadsFormModel"; // adjust path if needed
import { connectDB } from "@/lib/dbConnect";

export async function POST(req) {
    try {
        await connectDB();

        const { firstName, lastName, email, phone, purpose, message } = await req.json();

        // Validation
        if (!firstName || !email || !purpose || !message) {
            return Response.json(
                { message: "Please fill all required fields." },
                { status: 400 }
            );
        }

        const lead = new Lead({
            firstName,
            lastName,
            email,
            phone,
            purpose,
            message,
        });

        await lead.save();

        return Response.json(
            { message: "Lead saved successfully", lead },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error saving lead:", error);
        return Response.json(
            { message: "Server error. Try again later." },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        await connectDB();
        const leads = await Lead.find().sort({ createdAt: -1 });
        return Response.json(leads, { status: 200 });
    } catch (error) {
        console.error("Error fetching leads:", error);
        return Response.json(
            { message: "Server error." },
            { status: 500 }
        );
    }
}
