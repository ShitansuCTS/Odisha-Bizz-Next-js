import locations from "@/data/indiaLocations.json";
import { NextResponse } from "next/server";

export async function GET() {
  const states = locations.map((item) => ({
    name: item.state
  }));

  return NextResponse.json({
    success: true,
    data: { states }
  });
}