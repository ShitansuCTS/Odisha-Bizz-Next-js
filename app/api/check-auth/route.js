import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
    try {
        const cookieHeader = req.headers.get("cookie");
        const token = cookieHeader
            ?.split("; ")
            .find((c) => c.startsWith("token="))
            ?.split("=")[1];

        if (!token) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return NextResponse.json({ message: "Authenticated", userId: decoded.id });
    } catch (err) {
        return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }
}
