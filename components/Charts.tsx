"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PlanResult } from "@/lib/types";

const COLORS = {
  sustainable: "#22c55e",
  bau: "#3b82f6",
  highGrowth: "#ef4444",
  demand: "#3b82f6",
  capacity: "#10b981",
  recycling: "#22c55e",
  composting: "#f59e0b",
  landfill: "#ef4444",
};

interface ChartsProps {
  plan: PlanResult;
}

export function PopulationChart({ plan }: ChartsProps) {
  const data = [
    { year: "2026", population: plan.input.population_current },
    ...plan.projections.map((p) => ({ year: String(p.year), population: p.population })),
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={(v) => (v / 1000).toFixed(0) + "K"} />
        <Tooltip formatter={(v) => [Number(v).toLocaleString(), "Population"]} />
        <Area
          type="monotone"
          dataKey="population"
          stroke={COLORS.demand}
          fill={COLORS.demand + "33"}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function WaterDemandChart({ plan }: ChartsProps) {
  const data = plan.sectors.water.map((w) => ({
    year: String(w.year),
    demand: w.demand_mld,
    capacity: w.treatment_capacity_mld,
    storage: w.storage_ml,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis unit=" MLD" />
        <Tooltip />
        <Legend />
        <Bar dataKey="demand" name="Demand (MLD)" fill={COLORS.demand} />
        <Bar dataKey="capacity" name="Treatment Capacity (MLD)" fill={COLORS.capacity} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function WasteChart({ plan }: ChartsProps) {
  const data = plan.sectors.waste.map((w) => ({
    year: String(w.year),
    recycling: w.recycling_tpd,
    composting: w.composting_tpd,
    landfill: w.landfill_tpd,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis unit=" TPD" />
        <Tooltip />
        <Legend />
        <Bar dataKey="recycling" name="Recycling" fill={COLORS.recycling} stackId="a" />
        <Bar dataKey="composting" name="Composting" fill={COLORS.composting} stackId="a" />
        <Bar dataKey="landfill" name="Landfill" fill={COLORS.landfill} stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ScenarioComparisonChart({ plan }: ChartsProps) {
  const years = plan.projections.map((p) => p.year);
  const data = years.map((year, i) => ({
    year: String(year),
    sustainable: plan.scenarios.sustainable.sectors.water[i]?.demand_mld ?? 0,
    bau: plan.scenarios.bau.sectors.water[i]?.demand_mld ?? 0,
    highGrowth: plan.scenarios.highGrowth.sectors.water[i]?.demand_mld ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis unit=" MLD" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="sustainable"
          name="Sustainable"
          stroke={COLORS.sustainable}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="bau"
          name="Business as Usual"
          stroke={COLORS.bau}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="highGrowth"
          name="High Growth"
          stroke={COLORS.highGrowth}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TransportChart({ plan }: ChartsProps) {
  const data = plan.sectors.transport.map((t) => ({
    year: String(t.year),
    buses: t.bus_fleet,
    evPoints: t.ev_charging_points,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="buses" name="Bus Fleet" fill={COLORS.demand} />
        <Bar dataKey="evPoints" name="EV Charging Points" fill={COLORS.capacity} />
      </BarChart>
    </ResponsiveContainer>
  );
}
