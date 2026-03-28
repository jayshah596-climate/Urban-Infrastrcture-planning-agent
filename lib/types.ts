export interface LandUseDistribution {
  residential: number;   // percentage
  commercial: number;
  industrial: number;
  green_space: number;
}

export interface CurrentInfrastructure {
  water_supply_lpcd: number;
  wastewater_coverage_percent: number;
  solid_waste_tpd: number;
  road_density_km_per_km2: number;
}

export interface CityInput {
  city_name: string;
  country: string;
  population_current: number;
  population_growth_rate: number;   // percent per year e.g. 2.5
  area_km2: number;
  climate_zone: string;
  land_use: LandUseDistribution;
  current: CurrentInfrastructure;
}

export interface PopulationProjection {
  year: number;
  population: number;
}

export interface WaterResult {
  year: number;
  population: number;
  demand_mld: number;
  storage_ml: number;
  treatment_capacity_mld: number;
  lpcd_standard: number;
  formula: string;
}

export interface WastewaterResult {
  year: number;
  population: number;
  sewage_mld: number;
  stp_capacity_mld: number;
  sewer_length_km: number;
  formula: string;
}

export interface WasteResult {
  year: number;
  population: number;
  generation_tpd: number;
  recycling_tpd: number;
  composting_tpd: number;
  landfill_tpd: number;
  formula: string;
}

export interface TransportResult {
  year: number;
  population: number;
  trips_per_day: number;
  public_transport_trips: number;
  bus_fleet: number;
  ev_charging_points: number;
  formula: string;
}

export interface RoadsResult {
  year: number;
  population: number;
  required_road_km: number;
  current_road_km: number;
  gap_km: number;
  arterial_km: number;
  sub_arterial_km: number;
  local_km: number;
  formula: string;
}

export interface GreenResult {
  year: number;
  population: number;
  required_green_ha: number;
  current_green_ha: number;
  gap_ha: number;
  num_parks: number;
  formula: string;
}

export interface SectorResults {
  water: WaterResult[];
  wastewater: WastewaterResult[];
  waste: WasteResult[];
  transport: TransportResult[];
  roads: RoadsResult[];
  green: GreenResult[];
}

export interface ScenarioConfig {
  name: string;
  label: string;
  description: string;
  population_multiplier: number;
  water_lpcd: number;
  waste_kg_per_capita: number;
  public_transport_share: number;  // fraction 0-1
  recycling_share: number;
  composting_share: number;
}

export interface ScenarioResult {
  config: ScenarioConfig;
  sectors: SectorResults;
}

export type RecommendationSeverity = "HIGH" | "MEDIUM" | "LOW";

export interface Recommendation {
  sector: string;
  severity: RecommendationSeverity;
  title: string;
  detail: string;
  action: string;
}

export interface PlanResult {
  input: CityInput;
  projections: PopulationProjection[];
  sectors: SectorResults;
  scenarios: {
    sustainable: ScenarioResult;
    bau: ScenarioResult;
    highGrowth: ScenarioResult;
  };
  recommendations: Recommendation[];
  generated_at: string;
}
