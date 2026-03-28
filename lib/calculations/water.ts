import { WaterResult, PopulationProjection } from "../types";

const LPCD_STANDARD = 150;
const STORAGE_DAYS = 1.5;
const TREATMENT_RESERVE = 1.2;

export function calculateWater(
  projections: PopulationProjection[],
  lpcdOverride?: number
): WaterResult[] {
  const lpcd = lpcdOverride ?? LPCD_STANDARD;
  return projections.map(({ year, population }) => {
    const demand_mld = (population * lpcd) / 1_000_000;
    const storage_ml = demand_mld * STORAGE_DAYS;
    const treatment_capacity_mld = demand_mld * TREATMENT_RESERVE;
    return {
      year,
      population,
      demand_mld: parseFloat(demand_mld.toFixed(2)),
      storage_ml: parseFloat(storage_ml.toFixed(2)),
      treatment_capacity_mld: parseFloat(treatment_capacity_mld.toFixed(2)),
      lpcd_standard: lpcd,
      formula: `Demand = Population × ${lpcd} LPCD ÷ 1,000,000 = ${demand_mld.toFixed(2)} MLD`,
    };
  });
}
