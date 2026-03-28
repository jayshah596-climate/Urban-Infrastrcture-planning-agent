import { RoadsResult, PopulationProjection } from "../types";

const ROAD_DENSITY_BENCHMARK = 11; // km per km²
const ARTERIAL_SHARE = 0.15;
const SUB_ARTERIAL_SHARE = 0.25;
const LOCAL_SHARE = 0.60;

export function calculateRoads(
  projections: PopulationProjection[],
  area_km2: number,
  current_density_km_per_km2: number
): RoadsResult[] {
  const current_road_km = area_km2 * current_density_km_per_km2;
  const required_road_km = area_km2 * ROAD_DENSITY_BENCHMARK;
  const gap_km = Math.max(0, required_road_km - current_road_km);

  return projections.map(({ year, population }) => {
    return {
      year,
      population,
      required_road_km: parseFloat(required_road_km.toFixed(1)),
      current_road_km: parseFloat(current_road_km.toFixed(1)),
      gap_km: parseFloat(gap_km.toFixed(1)),
      arterial_km: parseFloat((gap_km * ARTERIAL_SHARE).toFixed(1)),
      sub_arterial_km: parseFloat((gap_km * SUB_ARTERIAL_SHARE).toFixed(1)),
      local_km: parseFloat((gap_km * LOCAL_SHARE).toFixed(1)),
      formula: `Required = Area × 11 km/km² = ${required_road_km.toFixed(1)} km | Gap = ${gap_km.toFixed(1)} km`,
    };
  });
}
