import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // ✅ Await cookies() first
    const cookieStore = await cookies();

    // Delete the token cookie
    cookieStore.delete("token", { path: "/" });

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
