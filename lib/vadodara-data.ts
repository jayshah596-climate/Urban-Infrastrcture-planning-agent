/**
 * Vadodara (Baroda) City — Pre-seeded infrastructure data
 *
 * Sources:
 *  - Vadodara Municipal Corporation (VMC) Annual Reports 2022–24
 *  - Census of India 2011 (extrapolated to 2024 at 2.1% CAGR)
 *  - Vadodara Smart City Mission — City Infrastructure Plan
 *  - AMRUT 2.0 Scheme — VMC Water & Sewerage Project Reports
 *  - Swachh Survekshan 2023 — VMC Solid Waste Data
 *  - BRTS / VMC Transport Survey 2022
 *  - Gujarat RERA / Development Plan 2031 land-use zoning
 *  - CPCB Environmental Data for Vishwamitri River Basin
 */

import { CityInput } from "./types";

export const VADODARA_INPUT: CityInput = {
  city_name: "Vadodara",
  country: "India",

  /**
   * Population: ~2.17 million for Vadodara UA (2024 estimate).
   * Census 2011 UA population = 1,817,191.
   * CAGR ~2.1% applied for 13 years → ~2,330,000.
   * Using conservative VMC-jurisdiction estimate of 2,170,000.
   */
  population_current: 2170000,

  /**
   * Annual growth rate: 2.1% (based on 2001–2011 Census inter-censal
   * growth of ~2.3%; adjusted downward for recent slowdown per
   * Smart City Mission baseline study 2019).
   */
  population_growth_rate: 2.1,

  /**
   * City Area: 414 km² (Vadodara Municipal Corporation jurisdiction
   * as notified under Gujarat Municipalities Act; includes urban core
   * and peri-urban extension areas added in 2008 reorganisation).
   */
  area_km2: 414,

  /**
   * Climate: BSh — Hot Semi-Arid (Köppen classification).
   * Mean annual rainfall: 890 mm (mostly Jun–Sep monsoon).
   * Mean max temp: 42°C (May); Mean min: 12°C (Jan).
   * Floods: Vishwamitri River bisects the city; major flood events
   * in 2005, 2019, 2023. Climate risk: HIGH.
   */
  climate_zone: "Semi-Arid",

  /**
   * Land use (VMC Development Plan 2031 zoning + satellite analysis):
   *  - Residential: 42%  (dense old city core + new townships)
   *  - Commercial: 16%   (Sayajigunj, RC Dutt Rd, Alkapuri)
   *  - Industrial: 23%   (GIDC Makarpura, GIDC Waghodia Rd,
   *                       petrochemical & engineering clusters)
   *  - Green Space:  7%  (Sayaji Baug + riverside parks;
   *                       well below WHO 10.5 m²/capita target)
   * Note: remaining 12% = roads, water bodies, utilities, vacant
   */
  land_use: {
    residential: 42,
    commercial: 16,
    industrial: 23,
    green_space: 7,
  },

  /**
   * Current Infrastructure (VMC / AMRUT 2.0 baseline 2023):
   *
   * Water Supply: 135 LPCD average (design target).
   *   Actual distribution in old city: ~115–125 LPCD (leakage ~28%).
   *   Sources: Ajwa Reservoir (primary), Pratapnagar WTP (230 MLD),
   *   Nimeta WTP (130 MLD). Total treatment capacity: ~380 MLD.
   *   NRW (Non-Revenue Water): ~28% — improvement needed.
   *
   * Wastewater Coverage: 68%.
   *   3 active STPs: Vadsar (80 MLD), Harni (50 MLD), Gotri (60 MLD)
   *   = 190 MLD total. Estimated sewage generation ~300 MLD.
   *   Gap of ~110 MLD untreated — discharges to Vishwamitri River.
   *   AMRUT 2.0 target: 100% coverage by 2026.
   *
   * Solid Waste: ~950 TPD (Swachh Survekshan 2023).
   *   Door-to-door collection coverage: 94%.
   *   Processing: ~600 TPD (2 MRFs + composting at Vadsar).
   *   Landfill at Padra: legacy open dump; new SLF under construction.
   *   Recycling rate: ~22%; composting ~18%; landfill ~60%.
   *
   * Road Density: 9.2 km/km² (VMC Roads Department survey 2022).
   *   Arterial: ~420 km; Sub-arterial: ~710 km; Local: ~2,390 km.
   *   Total: ~3,520 km. Target per DP-2031: 12 km/km².
   *   BRTS corridor: 100 km operational.
   */
  current: {
    water_supply_lpcd: 135,
    wastewater_coverage_percent: 68,
    solid_waste_tpd: 950,
    road_density_km_per_km2: 9.2,
  },
};

/** Key city facts shown in the context panel */
export const VADODARA_FACTS = [
  {
    icon: "🏛️",
    label: "Also Known As",
    value: "Baroda — Cultural Capital of Gujarat",
  },
  {
    icon: "👥",
    label: "Population (2024 est.)",
    value: "~2.17 Million (UA: ~2.33 M)",
  },
  {
    icon: "🏭",
    label: "Economic Base",
    value: "Petrochemicals, Engineering, Pharma, IT",
  },
  {
    icon: "🌊",
    label: "Key Climate Risk",
    value: "Flash floods — Vishwamitri River (2005, 2019, 2023 events)",
  },
  {
    icon: "🚌",
    label: "Public Transport",
    value: "BRTS: 100 km network | City Bus: ~400 buses",
  },
  {
    icon: "💧",
    label: "Water Sources",
    value: "Ajwa Reservoir + Pratapnagar WTP (230 MLD) + Nimeta WTP (130 MLD)",
  },
  {
    icon: "🏗️",
    label: "Active Scheme",
    value: "Smart City Mission (2016–) | AMRUT 2.0 | PM Awas Yojana",
  },
  {
    icon: "♻️",
    label: "Solid Waste",
    value: "~950 TPD | 94% door-to-door collection | Padra SLF (legacy dump)",
  },
  {
    icon: "📏",
    label: "Road Network",
    value: "~3,520 km total | BRTS 100 km | NH-64, NH-48 passes through",
  },
  {
    icon: "🌳",
    label: "Green Space",
    value: "Sayaji Baug (113 ac) | Kamati Baug | Riverside greens — deficit vs WHO",
  },
];

/** Infrastructure challenges specific to Vadodara */
export const VADODARA_CHALLENGES = [
  "Vishwamitri River flood risk affects 40% of city area — requires integrated SuDS approach",
  "Non-Revenue Water at ~28% — smart metering and distribution network rehabilitation needed",
  "Industrial effluent from GIDC Makarpura impacting groundwater quality",
  "Legacy open dump at Padra must transition to engineered Sanitary Landfill by 2026",
  "Heritage zone (Old City / Mandvi) — infrastructure upgrades constrained by conservation norms",
  "North-East peri-urban fringe growing rapidly without matching water/sewer extension",
];
