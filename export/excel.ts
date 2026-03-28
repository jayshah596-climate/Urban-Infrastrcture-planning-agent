import * as XLSX from "xlsx";
import { PlanResult } from "@/lib/types";

function makeHeader(headers: string[]): string[][] {
  return [headers];
}

export function buildExcelWorkbook(plan: PlanResult): Buffer {
  const wb = XLSX.utils.book_new();

  // ── Summary Sheet ────────────────────────────────────
  const summaryData = [
    ["Urban Infrastructure Planning Agent — Master Plan"],
    [""],
    ["City", plan.input.city_name],
    ["Country", plan.input.country],
    ["Generated", new Date(plan.generated_at).toLocaleString()],
    [""],
    ["Current Population", plan.input.population_current],
    ["Growth Rate (%/yr)", plan.input.population_growth_rate],
    ["Area (km²)", plan.input.area_km2],
    ["Climate Zone", plan.input.climate_zone],
    [""],
    ["Land Use Distribution"],
    ["Residential (%)", plan.input.land_use.residential],
    ["Commercial (%)", plan.input.land_use.commercial],
    ["Industrial (%)", plan.input.land_use.industrial],
    ["Green Space (%)", plan.input.land_use.green_space],
    [""],
    ["Current Infrastructure"],
    ["Water Supply (LPCD)", plan.input.current.water_supply_lpcd],
    ["Wastewater Coverage (%)", plan.input.current.wastewater_coverage_percent],
    ["Solid Waste (TPD)", plan.input.current.solid_waste_tpd],
    ["Road Density (km/km²)", plan.input.current.road_density_km_per_km2],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

  // ── Population Projection ────────────────────────────
  const popHeaders = [["Year", "Population", "Growth from Base (%)", "Formula"]];
  const base = plan.input.population_current;
  const popData = [
    [2026, base, "0.00", "Base year"],
    ...plan.projections.map((p) => [
      p.year,
      p.population,
      (((p.population - base) / base) * 100).toFixed(1) + "%",
      `P₀ × (1 + ${plan.input.population_growth_rate}%)^${p.year - 2026}`,
    ]),
  ];
  const wsPopulation = XLSX.utils.aoa_to_sheet([...popHeaders, ...popData]);
  XLSX.utils.book_append_sheet(wb, wsPopulation, "Population");

  // ── Water Planning ───────────────────────────────────
  const waterHeaders = [["Year", "Population", "Demand (MLD)", "Storage (ML)", "Treatment Capacity (MLD)", "LPCD Standard", "Formula"]];
  const waterData = plan.sectors.water.map((w) => [
    w.year, w.population, w.demand_mld, w.storage_ml, w.treatment_capacity_mld, w.lpcd_standard, w.formula,
  ]);
  const wsWater = XLSX.utils.aoa_to_sheet([...waterHeaders, ...waterData]);
  XLSX.utils.book_append_sheet(wb, wsWater, "Water Planning");

  // ── Wastewater ───────────────────────────────────────
  const wwHeaders = [["Year", "Population", "Sewage (MLD)", "STP Capacity (MLD)", "Sewer Network (km)", "Formula"]];
  const wwData = plan.sectors.wastewater.map((w) => [
    w.year, w.population, w.sewage_mld, w.stp_capacity_mld, w.sewer_length_km, w.formula,
  ]);
  const wsWW = XLSX.utils.aoa_to_sheet([...wwHeaders, ...wwData]);
  XLSX.utils.book_append_sheet(wb, wsWW, "Wastewater");

  // ── Solid Waste ──────────────────────────────────────
  const wasteHeaders = [["Year", "Population", "Total (TPD)", "Recycling (TPD)", "Composting (TPD)", "Landfill (TPD)", "Formula"]];
  const wasteData = plan.sectors.waste.map((w) => [
    w.year, w.population, w.generation_tpd, w.recycling_tpd, w.composting_tpd, w.landfill_tpd, w.formula,
  ]);
  const wsWaste = XLSX.utils.aoa_to_sheet([...wasteHeaders, ...wasteData]);
  XLSX.utils.book_append_sheet(wb, wsWaste, "Solid Waste");

  // ── Transport ────────────────────────────────────────
  const transHeaders = [["Year", "Population", "Daily Trips", "PT Trips", "Bus Fleet", "EV Charging Points", "Formula"]];
  const transData = plan.sectors.transport.map((t) => [
    t.year, t.population, t.trips_per_day, t.public_transport_trips, t.bus_fleet, t.ev_charging_points, t.formula,
  ]);
  const wsTransport = XLSX.utils.aoa_to_sheet([...transHeaders, ...transData]);
  XLSX.utils.book_append_sheet(wb, wsTransport, "Transport");

  // ── Road Network ─────────────────────────────────────
  const roadsHeaders = [["Year", "Required Road (km)", "Current Road (km)", "Gap (km)", "Arterial (km)", "Sub-Arterial (km)", "Local (km)", "Formula"]];
  const roadsData = plan.sectors.roads.map((r) => [
    r.year, r.required_road_km, r.current_road_km, r.gap_km, r.arterial_km, r.sub_arterial_km, r.local_km, r.formula,
  ]);
  const wsRoads = XLSX.utils.aoa_to_sheet([...roadsHeaders, ...roadsData]);
  XLSX.utils.book_append_sheet(wb, wsRoads, "Road Network");

  // ── Green Infrastructure ─────────────────────────────
  const greenHeaders = [["Year", "Population", "Required (ha)", "Current (ha)", "Gap (ha)", "New Parks Needed", "Formula"]];
  const greenData = plan.sectors.green.map((g) => [
    g.year, g.population, g.required_green_ha, g.current_green_ha, g.gap_ha, g.num_parks, g.formula,
  ]);
  const wsGreen = XLSX.utils.aoa_to_sheet([...greenHeaders, ...greenData]);
  XLSX.utils.book_append_sheet(wb, wsGreen, "Green Infrastructure");

  // ── Scenarios ────────────────────────────────────────
  const scenarioHeaders = [["Scenario", "Year", "Population", "Water Demand (MLD)", "Sewage (MLD)", "Waste (TPD)", "Bus Fleet"]];
  const scenarioData: unknown[][] = [];
  for (const [key, s] of Object.entries(plan.scenarios) as [string, typeof plan.scenarios.bau][]) {
    for (let i = 0; i < s.sectors.water.length; i++) {
      scenarioData.push([
        s.config.label,
        s.sectors.water[i].year,
        s.sectors.water[i].population,
        s.sectors.water[i].demand_mld,
        s.sectors.wastewater[i].sewage_mld,
        s.sectors.waste[i].generation_tpd,
        s.sectors.transport[i].bus_fleet,
      ]);
    }
  }
  const wsScenarios = XLSX.utils.aoa_to_sheet([...scenarioHeaders, ...scenarioData]);
  XLSX.utils.book_append_sheet(wb, wsScenarios, "Scenarios");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  return buf;
}
