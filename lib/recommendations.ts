import { CityInput, SectorResults, Recommendation } from "./types";

export function generateRecommendations(
  input: CityInput,
  sectors: SectorResults
): Recommendation[] {
  const recs: Recommendation[] = [];
  const wwYear = sectors.wastewater[0];
  const wasteYear = sectors.waste[0];
  const roadsYear = sectors.roads[0];
  const greenYear = sectors.green[0];

  // Water
  if (input.current.water_supply_lpcd < 100) {
    recs.push({
      sector: "Water Supply",
      severity: "HIGH",
      title: "Critical Water Supply Deficit",
      detail: `Current supply is ${input.current.water_supply_lpcd} LPCD against the 150 LPCD standard.`,
      action:
        "Immediate investment in new water treatment capacity and distribution network expansion is required.",
    });
  } else if (input.current.water_supply_lpcd < 135) {
    recs.push({
      sector: "Water Supply",
      severity: "MEDIUM",
      title: "Water Supply Below Standard",
      detail: `Current supply is ${input.current.water_supply_lpcd} LPCD; target is 135–150 LPCD.`,
      action:
        "Plan phased augmentation of water treatment plant capacity by 2030.",
    });
  }

  // Wastewater
  if (input.current.wastewater_coverage_percent < 60) {
    recs.push({
      sector: "Wastewater",
      severity: "HIGH",
      title: "Decentralised STP Recommended",
      detail: `Wastewater coverage is only ${input.current.wastewater_coverage_percent}%, far below the 80% minimum target.`,
      action:
        "Deploy decentralised Sewage Treatment Plants (STPs) in underserved areas. Target 80% coverage by 2030.",
    });
  } else if (input.current.wastewater_coverage_percent < 80) {
    recs.push({
      sector: "Wastewater",
      severity: "MEDIUM",
      title: "Wastewater Coverage Expansion Needed",
      detail: `Coverage at ${input.current.wastewater_coverage_percent}%; target is 80%+.`,
      action:
        `Extend sewer network by an estimated ${wwYear.sewer_length_km} km to close coverage gap by 2035.`,
    });
  }

  // Solid Waste
  const recyclingShare =
    wasteYear.generation_tpd > 0
      ? wasteYear.recycling_tpd / wasteYear.generation_tpd
      : 0;
  if (recyclingShare < 0.2) {
    recs.push({
      sector: "Solid Waste",
      severity: "HIGH",
      title: "Waste Segregation Programme Required",
      detail: `Recycling rate is below 20%. Landfill pressure will reach ${wasteYear.landfill_tpd.toFixed(0)} TPD by 2030.`,
      action:
        "Introduce mandatory source segregation, establish Material Recovery Facilities (MRFs), and target 30% recycling by 2028.",
    });
  }

  // Roads
  if (input.current.road_density_km_per_km2 < 8) {
    recs.push({
      sector: "Road Infrastructure",
      severity: "HIGH",
      title: "Major Road Network Expansion Required",
      detail: `Current density is ${input.current.road_density_km_per_km2} km/km² against the 10–12 km/km² benchmark.`,
      action: `Construct approximately ${roadsYear.gap_km.toFixed(0)} km of new roads: ${roadsYear.arterial_km.toFixed(0)} km arterial, ${roadsYear.sub_arterial_km.toFixed(0)} km sub-arterial, ${roadsYear.local_km.toFixed(0)} km local.`,
    });
  } else if (input.current.road_density_km_per_km2 < 10) {
    recs.push({
      sector: "Road Infrastructure",
      severity: "MEDIUM",
      title: "Road Density Below Target",
      detail: `Current density is ${input.current.road_density_km_per_km2} km/km²; target is 11 km/km².`,
      action: `Plan ${roadsYear.gap_km.toFixed(0)} km of additional road network over the next decade.`,
    });
  }

  // Green Infrastructure
  if (greenYear.gap_ha > 0) {
    const severity: Recommendation["severity"] =
      greenYear.gap_ha > 200 ? "HIGH" : "MEDIUM";
    recs.push({
      sector: "Green Infrastructure",
      severity,
      title: "Urban Greening Strategy Required",
      detail: `Green space deficit of ${greenYear.gap_ha.toFixed(0)} ha against WHO standard of 10.5 m²/capita.`,
      action: `Develop ${greenYear.num_parks} new parks (avg 5 ha each) and implement urban forestry and rooftop greening programmes.`,
    });
  }

  // Climate zone-based
  const climate = input.climate_zone.toLowerCase();
  if (climate.includes("arid") || climate.includes("semi-arid") || climate.includes("dry")) {
    recs.push({
      sector: "Water Supply",
      severity: "MEDIUM",
      title: "Arid Climate — Water Conservation Priority",
      detail: "City is in an arid/semi-arid climate zone with high evaporation risk.",
      action:
        "Implement rainwater harvesting, greywater recycling, and leak detection to reduce per-capita consumption below 135 LPCD.",
    });
  }

  // Future capacity warning
  const water2050 = sectors.water[sectors.water.length - 1];
  if (water2050) {
    recs.push({
      sector: "Water Supply",
      severity: "LOW",
      title: "Long-Term Treatment Capacity Planning",
      detail: `By 2050, treatment capacity requirement will reach ${water2050.treatment_capacity_mld.toFixed(1)} MLD.`,
      action:
        "Reserve land for future water treatment plant expansion in master planning documents now.",
    });
  }

  // Sort by severity
  const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  return recs.sort((a, b) => order[a.severity] - order[b.severity]);
}
