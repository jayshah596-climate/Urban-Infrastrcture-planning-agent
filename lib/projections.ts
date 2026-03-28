import { PopulationProjection } from "./types";

const BASE_YEAR = 2026;
const PROJECTION_YEARS = [2030, 2040, 2050];

export function projectPopulation(
  currentPopulation: number,
  growthRatePercent: number
): PopulationProjection[] {
  const rate = growthRatePercent / 100;
  return PROJECTION_YEARS.map((year) => {
    const years = year - BASE_YEAR;
    const population = Math.round(
      currentPopulation * Math.pow(1 + rate, years)
    );
    return { year, population };
  });
}

export function projectPopulationFull(
  currentPopulation: number,
  growthRatePercent: number
): PopulationProjection[] {
  const rate = growthRatePercent / 100;
  const result: PopulationProjection[] = [
    { year: BASE_YEAR, population: currentPopulation },
  ];
  for (let year = BASE_YEAR + 2; year <= 2050; year += 2) {
    const years = year - BASE_YEAR;
    const population = Math.round(
      currentPopulation * Math.pow(1 + rate, years)
    );
    result.push({ year, population });
  }
  return result;
}
