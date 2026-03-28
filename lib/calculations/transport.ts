import { TransportResult, PopulationProjection } from "../types";

const TRIPS_PER_CAPITA = 1.8;
const TRIPS_PER_BUS_PER_DAY = 400;
const EV_CHARGING_RATIO = 1.5; // charging points per bus

export function calculateTransport(
  projections: PopulationProjection[],
  publicTransportShare?: number
): TransportResult[] {
  const ptShare = publicTransportShare ?? 0.40;

  return projections.map(({ year, population }) => {
    const trips_per_day = Math.round(population * TRIPS_PER_CAPITA);
    const public_transport_trips = Math.round(trips_per_day * ptShare);
    const bus_fleet = Math.ceil(public_transport_trips / TRIPS_PER_BUS_PER_DAY);
    const ev_charging_points = Math.ceil(bus_fleet * EV_CHARGING_RATIO);
    return {
      year,
      population,
      trips_per_day,
      public_transport_trips,
      bus_fleet,
      ev_charging_points,
      formula: `Trips = Population × 1.8 = ${trips_per_day.toLocaleString()} | Bus Fleet = PT Trips ÷ 400 = ${bus_fleet}`,
    };
  });
}
