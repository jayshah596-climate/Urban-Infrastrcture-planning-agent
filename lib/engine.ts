import { CityInput, PlanResult } from "./types";
import { projectPopulation } from "./projections";
import { calculateWater } from "./calculations/water";
import { calculateWastewater } from "./calculations/wastewater";
import { calculateWaste } from "./calculations/waste";
import { calculateTransport } from "./calculations/transport";
import { calculateRoads } from "./calculations/roads";
import { calculateGreen } from "./calculations/green";
import { buildScenarios } from "./scenarios";
import { generateRecommendations } from "./recommendations";

export function runPlanningEngine(input: CityInput): PlanResult {
  const projections = projectPopulation(
    input.population_current,
    input.population_growth_rate
  );

  const water = calculateWater(projections);
  const waterDemands = water.map((w) => w.demand_mld);
  const wastewater = calculateWastewater(projections, waterDemands, input.area_km2);
  const waste = calculateWaste(projections);
  const transport = calculateTransport(projections);
  const roads = calculateRoads(
    projections,
    input.area_km2,
    input.current.road_density_km_per_km2
  );
  const green = calculateGreen(
    projections,
    input.area_km2,
    input.land_use.green_space
  );

  const sectors = { water, wastewater, waste, transport, roads, green };
  const scenarios = buildScenarios(input);
  const recommendations = generateRecommendations(input, sectors);

  return {
    input,
    projections,
    sectors,
    scenarios,
    recommendations,
    generated_at: new Date().toISOString(),
  };
}
