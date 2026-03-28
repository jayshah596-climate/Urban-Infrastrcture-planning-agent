import { NextRequest, NextResponse } from "next/server";
import { buildExcelWorkbook } from "@/export/excel";
import { PlanResult } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const plan: PlanResult = await req.json();
    const buffer = buildExcelWorkbook(plan);
    const citySlug = plan.input.city_name.replace(/\s+/g, "_");

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${citySlug}_Infrastructure_Plan.xlsx"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("Excel export error:", err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
