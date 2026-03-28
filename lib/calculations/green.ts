import { GreenResult, PopulationProjection } from "../types";

const WHO_M2_PER_CAPITA = 10.5; // WHO midpoint (9–12 m²)
const AVG_PARK_HA = 5;

export function calculateGreen(
  projections: PopulationProjection[],
  area_km2: number,
  green_space_percent: number
): GreenResult[] {
  const current_green_ha = (area_km2 * 100) * (green_space_percent / 100);

  return projections.map(({ year, population }) => {
    const required_green_m2 = population * WHO_M2_PER_CAPITA;
    const required_green_ha = required_green_m2 / 10_000;
    const gap_ha = Math.max(0, required_green_ha - current_green_ha);
    const num_parks = Math.ceil(gap_ha / AVG_PARK_HA);
    return {
      year,
      population,
      required_green_ha: parseFloat(required_green_ha.toFixed(1)),
      current_green_ha: parseFloat(current_green_ha.toFixed(1)),
      gap_ha: parseFloat(gap_ha.toFixed(1)),
      num_parks,
      formula: `Required = Population × 10.5 m²/capita ÷ 10,000 = ${required_green_ha.toFixed(1)} ha | Gap = ${gap_ha.toFixed(1)} ha`,
    };
  });
}
