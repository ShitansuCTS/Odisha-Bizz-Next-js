import locations from "@/data/indiaLocations.json";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("states");

    const stateData = locations.find(
        (item) => item.state === state
    );

    const districts = stateData
        ? stateData.districts.map((d) => ({ name: d }))
        : [];

    return NextResponse.json({
        success: true,
        data: { districts }
    });
}