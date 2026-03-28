import { WasteResult, PopulationProjection } from "../types";

const DEFAULT_KG_PER_CAPITA = 0.6;
const DEFAULT_RECYCLING_SHARE = 0.30;
const DEFAULT_COMPOSTING_SHARE = 0.20;

export function calculateWaste(
  projections: PopulationProjection[],
  kgPerCapita?: number,
  recyclingShare?: number,
  compostingShare?: number
): WasteResult[] {
  const kg = kgPerCapita ?? DEFAULT_KG_PER_CAPITA;
  const rec = recyclingShare ?? DEFAULT_RECYCLING_SHARE;
  const comp = compostingShare ?? DEFAULT_COMPOSTING_SHARE;
  const landfill = 1 - rec - comp;

  return projections.map(({ year, population }) => {
    const generation_tpd = (population * kg) / 1000;
    const recycling_tpd = generation_tpd * rec;
    const composting_tpd = generation_tpd * comp;
    const landfill_tpd = generation_tpd * landfill;
    return {
      year,
      population,
      generation_tpd: parseFloat(generation_tpd.toFixed(1)),
      recycling_tpd: parseFloat(recycling_tpd.toFixed(1)),
      composting_tpd: parseFloat(composting_tpd.toFixed(1)),
      landfill_tpd: parseFloat(landfill_tpd.toFixed(1)),
      formula: `Generation = Population × ${kg} kg/day ÷ 1000 = ${generation_tpd.toFixed(1)} TPD`,
    };
  });
}
