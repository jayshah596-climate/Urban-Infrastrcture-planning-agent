import { CityInput, ScenarioConfig, ScenarioResult, SectorResults } from "./types";
import { projectPopulation } from "./projections";
import { calculateWater } from "./calculations/water";
import { calculateWastewater } from "./calculations/wastewater";
import { calculateWaste } from "./calculations/waste";
import { calculateTransport } from "./calculations/transport";
import { calculateRoads } from "./calculations/roads";
import { calculateGreen } from "./calculations/green";

export const SCENARIO_CONFIGS: Record<string, ScenarioConfig> = {
  sustainable: {
    name: "sustainable",
    label: "Sustainable",
    description: "Net Zero aligned — efficient resource use, high public transport, maximum recycling",
    population_multiplier: 0.9,
    water_lpcd: 120,
    waste_kg_per_capita: 0.4,
    public_transport_share: 0.65,
    recycling_share: 0.50,
    composting_share: 0.30,
  },
  bau: {
    name: "bau",
    label: "Business as Usual",
    description: "Baseline scenario — current trends continue",
    population_multiplier: 1.0,
    water_lpcd: 150,
    waste_kg_per_capita: 0.6,
    public_transport_share: 0.40,
    recycling_share: 0.30,
    composting_share: 0.20,
  },
  highGrowth: {
    name: "highGrowth",
    label: "High Growth Stress",
    description: "Rapid urbanisation — maximum resource pressure, infrastructure strain",
    population_multiplier: 1.3,
    water_lpcd: 175,
    waste_kg_per_capita: 0.8,
    public_transport_share: 0.30,
    recycling_share: 0.15,
    composting_share: 0.10,
  },
};

function buildSectors(input: CityInput, config: ScenarioConfig): SectorResults {
  const adjustedGrowthRate =
    input.population_growth_rate * config.population_multiplier;
  const projections = projectPopulation(
    input.population_current,
    adjustedGrowthRate
  );

  const water = calculateWater(projections, config.water_lpcd);
  const waterDemands = water.map((w) => w.demand_mld);
  const wastewater = calculateWastewater(
    projections,
    waterDemands,
    input.area_km2
  );
  const waste = calculateWaste(
    projections,
    config.waste_kg_per_capita,
    config.recycling_share,
    config.composting_share
  );
  const transport = calculateTransport(projections, config.public_transport_share);
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

  return { water, wastewater, waste, transport, roads, green };
}

export function buildScenarios(input: CityInput) {
  return {
    sustainable: {
      config: SCENARIO_CONFIGS.sustainable,
      sectors: buildSectors(input, SCENARIO_CONFIGS.sustainable),
    } as ScenarioResult,
    bau: {
      config: SCENARIO_CONFIGS.bau,
      sectors: buildSectors(input, SCENARIO_CONFIGS.bau),
    } as ScenarioResult,
    highGrowth: {
      config: SCENARIO_CONFIGS.highGrowth,
      sectors: buildSectors(input, SCENARIO_CONFIGS.highGrowth),
    } as ScenarioResult,
  };
}
