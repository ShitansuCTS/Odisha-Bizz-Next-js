import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next(); // token valid → continue
  } catch (err) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  // matcher: ["/admin/:path*"],
  matcher: ["/admin/dashboard"],
  runtime: "nodejs", // Important: use Node runtime for jsonwebtoken
};
