import { WastewaterResult, PopulationProjection } from "../types";

const SEWAGE_FRACTION = 0.8;
const STP_RESERVE = 1.25;
const SEWER_DENSITY_FACTOR = 3.5; // km of sewer per km²

export function calculateWastewater(
  projections: PopulationProjection[],
  waterDemandMLD: number[],
  area_km2: number
): WastewaterResult[] {
  return projections.map(({ year, population }, i) => {
    const demand_mld = waterDemandMLD[i] ?? (population * 150) / 1_000_000;
    const sewage_mld = demand_mld * SEWAGE_FRACTION;
    const stp_capacity_mld = sewage_mld * STP_RESERVE;
    const sewer_length_km = area_km2 * SEWER_DENSITY_FACTOR;
    return {
      year,
      population,
      sewage_mld: parseFloat(sewage_mld.toFixed(2)),
      stp_capacity_mld: parseFloat(stp_capacity_mld.toFixed(2)),
      sewer_length_km: parseFloat(sewer_length_km.toFixed(1)),
      formula: `Sewage = Water Demand × 80% = ${sewage_mld.toFixed(2)} MLD | STP = ${stp_capacity_mld.toFixed(2)} MLD`,
    };
  });
}
