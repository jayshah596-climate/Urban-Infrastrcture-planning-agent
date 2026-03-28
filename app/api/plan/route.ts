import { NextRequest, NextResponse } from "next/server";
import { runPlanningEngine } from "@/lib/engine";
import { CityInput } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body: CityInput = await req.json();

    // Basic validation
    if (!body.city_name || !body.population_current || !body.area_km2) {
      return NextResponse.json(
        { error: "Missing required fields: city_name, population_current, area_km2" },
        { status: 400 }
      );
    }

    const result = runPlanningEngine(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Plan generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate plan" },
      { status: 500 }
    );
  }
}
