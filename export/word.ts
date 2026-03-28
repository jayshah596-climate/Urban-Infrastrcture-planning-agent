import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
} from "docx";
import { PlanResult } from "@/lib/types";

function heading1(text: string) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
  });
}

function heading2(text: string) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
  });
}

function body(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    spacing: { after: 120 },
  });
}

function bullet(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22 })],
    bullet: { level: 0 },
    spacing: { after: 80 },
  });
}

function spacer() {
  return new Paragraph({ text: "", spacing: { after: 100 } });
}

function simpleTable(headers: string[], rows: string[][]) {
  const headerRow = new TableRow({
    children: headers.map(
      (h) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: h, bold: true, size: 20 })],
              alignment: AlignmentType.CENTER,
            }),
          ],
          shading: { type: ShadingType.SOLID, color: "3B82F6", fill: "3B82F6" },
          width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
        })
    ),
    tableHeader: true,
  });

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: cell, size: 20 })],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            })
        ),
      })
  );

  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

export async function buildWordDocument(plan: PlanResult): Promise<Buffer> {
  const { input, projections, sectors, scenarios, recommendations } = plan;
  const city = input.city_name;
  const year2030 = projections[0];
  const year2050 = projections[projections.length - 1];

  const children = [
    // ── Title ──────────────────────────────────────────
    new Paragraph({
      children: [
        new TextRun({
          text: `Urban Infrastructure Master Plan`,
          bold: true,
          size: 48,
          color: "1E3A5F",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${city}, ${input.country}`,
          bold: true,
          size: 36,
          color: "3B82F6",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated: ${new Date(plan.generated_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} | Planning Horizon: 2026–2050`,
          size: 20,
          color: "666666",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),

    // ── 1. Executive Summary ────────────────────────────
    heading1("1. Executive Summary"),
    body(
      `This master plan provides a comprehensive infrastructure assessment and planning framework for ${city}, ${input.country}. ` +
      `With a current population of ${input.population_current.toLocaleString()} and a projected annual growth rate of ${input.population_growth_rate}%, ` +
      `the city will require significant infrastructure investment across all key sectors to meet the demands of ${year2050.population.toLocaleString()} residents by 2050.`
    ),
    body(
      `This plan covers water supply, wastewater management, solid waste, transportation, road networks, and green infrastructure, ` +
      `evaluated under three scenarios: Sustainable (Net Zero aligned), Business as Usual, and High Growth Stress.`
    ),
    spacer(),

    // ── 2. City Profile ─────────────────────────────────
    heading1("2. City Profile"),
    simpleTable(
      ["Parameter", "Value"],
      [
        ["City Name", city],
        ["Country", input.country],
        ["Current Population", input.population_current.toLocaleString()],
        ["Annual Growth Rate", `${input.population_growth_rate}%`],
        ["City Area", `${input.area_km2} km²`],
        ["Climate Zone", input.climate_zone],
        ["Population Density", `${(input.population_current / input.area_km2).toFixed(0)} persons/km²`],
      ]
    ),
    spacer(),
    heading2("Land Use Distribution"),
    simpleTable(
      ["Land Use Type", "Percentage (%)", "Area (km²)"],
      [
        ["Residential", `${input.land_use.residential}%`, `${(input.area_km2 * input.land_use.residential / 100).toFixed(1)}`],
        ["Commercial", `${input.land_use.commercial}%`, `${(input.area_km2 * input.land_use.commercial / 100).toFixed(1)}`],
        ["Industrial", `${input.land_use.industrial}%`, `${(input.area_km2 * input.land_use.industrial / 100).toFixed(1)}`],
        ["Green Space", `${input.land_use.green_space}%`, `${(input.area_km2 * input.land_use.green_space / 100).toFixed(1)}`],
      ]
    ),
    spacer(),

    // ── 3. Population Forecast ──────────────────────────
    heading1("3. Population Forecast"),
    body(`Formula: P_future = P_current × (1 + r)ⁿ, where r = ${input.population_growth_rate / 100} and n = years from 2026`),
    simpleTable(
      ["Year", "Population", "Increase from 2026", "Growth (%)"],
      [
        ["2026 (Base)", input.population_current.toLocaleString(), "—", "—"],
        ...projections.map((p) => [
          String(p.year),
          p.population.toLocaleString(),
          `+${(p.population - input.population_current).toLocaleString()}`,
          `+${(((p.population - input.population_current) / input.population_current) * 100).toFixed(1)}%`,
        ]),
      ]
    ),
    spacer(),

    // ── 4. Infrastructure Gap Analysis ──────────────────
    heading1("4. Infrastructure Gap Analysis"),
    simpleTable(
      ["Sector", "Current Status", "Standard/Target", "Gap"],
      [
        ["Water Supply", `${input.current.water_supply_lpcd} LPCD`, "135–150 LPCD", input.current.water_supply_lpcd < 135 ? `${150 - input.current.water_supply_lpcd} LPCD deficit` : "Meeting standard"],
        ["Wastewater Coverage", `${input.current.wastewater_coverage_percent}%`, "80%+", input.current.wastewater_coverage_percent < 80 ? `${80 - input.current.wastewater_coverage_percent}% gap` : "Meeting target"],
        ["Road Density", `${input.current.road_density_km_per_km2} km/km²`, "10–12 km/km²", input.current.road_density_km_per_km2 < 10 ? `${(10 - input.current.road_density_km_per_km2).toFixed(1)} km/km² below` : "Adequate"],
        ["Green Space", `${input.land_use.green_space}% of area`, `${(input.population_current * 10.5 / 10000).toFixed(0)} ha needed`, `${Math.max(0, (input.population_current * 10.5 / 10000) - (input.area_km2 * 100 * input.land_use.green_space / 100)).toFixed(0)} ha gap`],
      ]
    ),
    spacer(),

    // ── 5. Sector-Wise Planning ──────────────────────────
    heading1("5. Sector-Wise Planning"),

    // Water
    heading2("5.1 Water Supply"),
    body("Standard: 150 LPCD (litres per capita per day). Demand = Population × 150 ÷ 1,000,000 MLD"),
    simpleTable(
      ["Year", "Population", "Demand (MLD)", "Storage (ML)", "Treatment Capacity (MLD)"],
      sectors.water.map((w) => [
        String(w.year), w.population.toLocaleString(), String(w.demand_mld),
        String(w.storage_ml), String(w.treatment_capacity_mld),
      ])
    ),
    spacer(),

    // Wastewater
    heading2("5.2 Wastewater & Sewerage"),
    body("Assumption: 80% of water supply becomes wastewater. STP capacity = Sewage × 1.25 (reserve margin)."),
    simpleTable(
      ["Year", "Sewage (MLD)", "STP Capacity (MLD)", "Sewer Network (km)"],
      sectors.wastewater.map((w) => [
        String(w.year), String(w.sewage_mld), String(w.stp_capacity_mld), String(w.sewer_length_km),
      ])
    ),
    spacer(),

    // Waste
    heading2("5.3 Solid Waste Management"),
    body("Standard: 0.6 kg per capita per day. Strategy: 30% recycling, 20% composting, 50% landfill (BAU)."),
    simpleTable(
      ["Year", "Total (TPD)", "Recycling (TPD)", "Composting (TPD)", "Landfill (TPD)"],
      sectors.waste.map((w) => [
        String(w.year), String(w.generation_tpd), String(w.recycling_tpd),
        String(w.composting_tpd), String(w.landfill_tpd),
      ])
    ),
    spacer(),

    // Transport
    heading2("5.4 Transportation Planning"),
    body("Trip rate: 1.8 trips per capita per day. Public transport share: 40% (BAU). Bus fleet = PT trips ÷ 400."),
    simpleTable(
      ["Year", "Daily Trips", "PT Trips", "Bus Fleet", "EV Charging Points"],
      sectors.transport.map((t) => [
        String(t.year), t.trips_per_day.toLocaleString(), t.public_transport_trips.toLocaleString(),
        String(t.bus_fleet), String(t.ev_charging_points),
      ])
    ),
    spacer(),

    // Roads
    heading2("5.5 Road Infrastructure"),
    body("Benchmark: 11 km of road per km² of city area. Hierarchy: 15% arterial, 25% sub-arterial, 60% local."),
    simpleTable(
      ["Metric", "Value"],
      [
        ["Required Road Network", `${sectors.roads[0].required_road_km} km`],
        ["Current Road Network", `${sectors.roads[0].current_road_km} km`],
        ["Network Gap", `${sectors.roads[0].gap_km} km`],
        ["  — Arterial Roads", `${sectors.roads[0].arterial_km} km`],
        ["  — Sub-Arterial Roads", `${sectors.roads[0].sub_arterial_km} km`],
        ["  — Local Roads", `${sectors.roads[0].local_km} km`],
      ]
    ),
    spacer(),

    // Green
    heading2("5.6 Green Infrastructure"),
    body("WHO standard: 10.5 m² of green space per capita. Required green area = Population × 10.5 ÷ 10,000 ha."),
    simpleTable(
      ["Year", "Required (ha)", "Current (ha)", "Gap (ha)", "New Parks Needed"],
      sectors.green.map((g) => [
        String(g.year), String(g.required_green_ha), String(g.current_green_ha),
        String(g.gap_ha), String(g.num_parks),
      ])
    ),
    spacer(),

    // ── 6. Scenario Analysis ────────────────────────────
    heading1("6. Scenario Analysis"),
    body("Three scenarios are modelled to bracket the planning uncertainty:"),
    bullet("Sustainable (Net Zero): Efficient resource use, 65% public transport, 50% recycling."),
    bullet("Business as Usual: Current trends continue with standard growth projections."),
    bullet("High Growth Stress: Rapid urbanisation, high resource demand, infrastructure strain."),
    spacer(),
    simpleTable(
      ["Metric (2050)", "Sustainable", "Business as Usual", "High Growth"],
      [
        ["Population", scenarios.sustainable.sectors.water[2]?.population.toLocaleString() ?? "-", scenarios.bau.sectors.water[2]?.population.toLocaleString() ?? "-", scenarios.highGrowth.sectors.water[2]?.population.toLocaleString() ?? "-"],
        ["Water Demand (MLD)", String(scenarios.sustainable.sectors.water[2]?.demand_mld ?? "-"), String(scenarios.bau.sectors.water[2]?.demand_mld ?? "-"), String(scenarios.highGrowth.sectors.water[2]?.demand_mld ?? "-")],
        ["Solid Waste (TPD)", String(scenarios.sustainable.sectors.waste[2]?.generation_tpd ?? "-"), String(scenarios.bau.sectors.waste[2]?.generation_tpd ?? "-"), String(scenarios.highGrowth.sectors.waste[2]?.generation_tpd ?? "-")],
        ["Bus Fleet", String(scenarios.sustainable.sectors.transport[2]?.bus_fleet ?? "-"), String(scenarios.bau.sectors.transport[2]?.bus_fleet ?? "-"), String(scenarios.highGrowth.sectors.transport[2]?.bus_fleet ?? "-")],
        ["Green Space Gap (ha)", String(scenarios.sustainable.sectors.green[2]?.gap_ha ?? "-"), String(scenarios.bau.sectors.green[2]?.gap_ha ?? "-"), String(scenarios.highGrowth.sectors.green[2]?.gap_ha ?? "-")],
      ]
    ),
    spacer(),

    // ── 7. Recommendations ──────────────────────────────
    heading1("7. Recommendations & Phasing Plan"),
    ...recommendations.map((rec) => [
      new Paragraph({
        children: [
          new TextRun({ text: `[${rec.severity}] ${rec.sector}: ${rec.title}`, bold: true, size: 22 }),
        ],
        spacing: { before: 200, after: 80 },
      }),
      body(rec.detail),
      new Paragraph({
        children: [
          new TextRun({ text: "Action: ", bold: true, size: 22 }),
          new TextRun({ text: rec.action, size: 22 }),
        ],
        spacing: { after: 160 },
      }),
    ]).flat(),

    spacer(),
    heading2("Phasing Plan"),
    simpleTable(
      ["Phase", "Timeline", "Key Actions"],
      [
        ["Short Term", "2026–2030", "Close critical gaps: water supply, wastewater coverage, emergency road widening"],
        ["Medium Term", "2030–2040", "Expand STP network, build green corridors, scale public transport fleet"],
        ["Long Term", "2040–2050", "Net Zero infrastructure transition, full EV fleet, urban forest programme"],
      ]
    ),
    spacer(),

    // ── Footer ───────────────────────────────────────────
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated by Urban Infrastructure Planning Agent (UIPA) | ${city} Master Plan | ${new Date().getFullYear()}`,
          size: 18,
          color: "999999",
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
    }),
  ];

  const doc = new Document({
    sections: [{ children }],
    creator: "Urban Infrastructure Planning Agent",
    title: `${city} Infrastructure Master Plan`,
    description: `Infrastructure master plan for ${city}, ${input.country}`,
  });

  return await Packer.toBuffer(doc);
}
