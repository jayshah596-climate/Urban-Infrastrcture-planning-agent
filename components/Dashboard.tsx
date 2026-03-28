"use client";

import { PlanResult } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { SectorCard } from "./SectorCard";
import { ExportButtons } from "./ExportButtons";
import { ScenarioPanel } from "./ScenarioPanel";
import { RecommendationsPanel } from "./RecommendationsPanel";
import {
  PopulationChart,
  WaterDemandChart,
  WasteChart,
  ScenarioComparisonChart,
  TransportChart,
} from "./Charts";
import { Badge } from "./ui/badge";

interface DashboardProps {
  plan: PlanResult;
  onReset: () => void;
}

export function Dashboard({ plan, onReset }: DashboardProps) {
  const { input, projections, sectors, recommendations } = plan;
  const highCount = recommendations.filter((r) => r.severity === "HIGH").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {input.city_name} Infrastructure Master Plan
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {input.country} · Population: {input.population_current.toLocaleString()} · Area: {input.area_km2} km² · {input.climate_zone}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {highCount > 0 && (
            <Badge variant="danger" className="text-sm px-3 py-1">
              {highCount} Critical Issues
            </Badge>
          )}
          <button
            onClick={onReset}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            ← New Plan
          </button>
        </div>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "2050 Population", value: projections[2].population.toLocaleString(), icon: "👥" },
          { label: "Water Demand 2050", value: `${sectors.water[2].demand_mld.toFixed(1)} MLD`, icon: "💧" },
          { label: "Waste 2050", value: `${sectors.waste[2].generation_tpd.toFixed(0)} TPD`, icon: "♻️" },
          { label: "Road Gap", value: `${sectors.roads[0].gap_km.toFixed(0)} km`, icon: "🛣️" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl mb-1">{kpi.icon}</div>
              <div className="text-xl font-bold">{kpi.value}</div>
              <div className="text-xs text-muted-foreground">{kpi.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1">
          {[
            ["overview", "Overview"],
            ["water", "💧 Water"],
            ["wastewater", "🚿 Wastewater"],
            ["waste", "♻️ Waste"],
            ["transport", "🚌 Transport"],
            ["roads", "🛣️ Roads"],
            ["green", "🌳 Green"],
            ["scenarios", "📊 Scenarios"],
            ["recommendations", "💡 Actions"],
            ["reports", "📄 Reports"],
          ].map(([value, label]) => (
            <TabsTrigger key={value} value={value} className="text-xs sm:text-sm">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Population Growth Projection (2026–2050)</CardTitle>
              <CardDescription>Exponential growth model: P = P₀ × (1 + {input.population_growth_rate}%)ⁿ</CardDescription>
            </CardHeader>
            <CardContent>
              <PopulationChart plan={plan} />
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Water Demand vs Treatment Capacity</CardTitle></CardHeader>
              <CardContent><WaterDemandChart plan={plan} /></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Solid Waste by Disposal Method</CardTitle></CardHeader>
              <CardContent><WasteChart plan={plan} /></CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Water */}
        <TabsContent value="water" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Water Demand Projections</CardTitle>
              <CardDescription>Standard: 150 LPCD | Demand = Population × 150 ÷ 1,000,000</CardDescription>
            </CardHeader>
            <CardContent><WaterDemandChart plan={plan} /></CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sectors.water.map((w) => (
              <SectorCard
                key={w.year}
                title={`Water — ${w.year}`}
                icon="💧"
                metrics={[
                  { label: "Total Demand", value: w.demand_mld, unit: "MLD", formula: w.formula },
                  { label: "Storage Required", value: w.storage_ml, unit: "ML" },
                  { label: "Treatment Capacity", value: w.treatment_capacity_mld, unit: "MLD" },
                  { label: "LPCD Standard", value: w.lpcd_standard, unit: "L/capita/day" },
                ]}
              />
            ))}
          </div>
        </TabsContent>

        {/* Wastewater */}
        <TabsContent value="wastewater" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sectors.wastewater.map((w) => (
              <SectorCard
                key={w.year}
                title={`Wastewater — ${w.year}`}
                icon="🚿"
                metrics={[
                  { label: "Sewage Generation", value: w.sewage_mld, unit: "MLD", formula: w.formula },
                  { label: "STP Capacity Required", value: w.stp_capacity_mld, unit: "MLD" },
                  { label: "Sewer Network", value: w.sewer_length_km, unit: "km" },
                  {
                    label: "Coverage Status",
                    value: `${input.current.wastewater_coverage_percent}%`,
                    status: input.current.wastewater_coverage_percent >= 80 ? "good" : input.current.wastewater_coverage_percent >= 60 ? "warning" : "critical",
                    benchmark: "80%+ target",
                  },
                ]}
              />
            ))}
          </div>
        </TabsContent>

        {/* Waste */}
        <TabsContent value="waste" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Waste Generation & Disposal Breakdown</CardTitle></CardHeader>
            <CardContent><WasteChart plan={plan} /></CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sectors.waste.map((w) => (
              <SectorCard
                key={w.year}
                title={`Solid Waste — ${w.year}`}
                icon="♻️"
                metrics={[
                  { label: "Total Generation", value: w.generation_tpd, unit: "TPD", formula: w.formula },
                  { label: "Recycling (30%)", value: w.recycling_tpd, unit: "TPD", status: "good" },
                  { label: "Composting (20%)", value: w.composting_tpd, unit: "TPD", status: "good" },
                  { label: "Landfill (50%)", value: w.landfill_tpd, unit: "TPD", status: "warning" },
                ]}
              />
            ))}
          </div>
        </TabsContent>

        {/* Transport */}
        <TabsContent value="transport" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Bus Fleet & EV Charging Requirements</CardTitle></CardHeader>
            <CardContent><TransportChart plan={plan} /></CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sectors.transport.map((t) => (
              <SectorCard
                key={t.year}
                title={`Transport — ${t.year}`}
                icon="🚌"
                metrics={[
                  { label: "Daily Trips", value: t.trips_per_day.toLocaleString(), formula: t.formula },
                  { label: "Public Transport Trips", value: t.public_transport_trips.toLocaleString() },
                  { label: "Bus Fleet Required", value: t.bus_fleet, unit: "buses" },
                  { label: "EV Charging Points", value: t.ev_charging_points },
                ]}
              />
            ))}
          </div>
        </TabsContent>

        {/* Roads */}
        <TabsContent value="roads" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sectors.roads.map((r) => (
              <SectorCard
                key={r.year}
                title={`Roads — ${r.year}`}
                icon="🛣️"
                metrics={[
                  { label: "Required Road Network", value: r.required_road_km, unit: "km", formula: r.formula },
                  { label: "Current Road Network", value: r.current_road_km, unit: "km" },
                  {
                    label: "Network Gap",
                    value: r.gap_km,
                    unit: "km",
                    status: r.gap_km === 0 ? "good" : r.gap_km < 200 ? "warning" : "critical",
                  },
                  { label: "  Arterial Roads", value: r.arterial_km, unit: "km" },
                  { label: "  Sub-Arterial", value: r.sub_arterial_km, unit: "km" },
                  { label: "  Local Roads", value: r.local_km, unit: "km" },
                ]}
              />
            ))}
          </div>
        </TabsContent>

        {/* Green */}
        <TabsContent value="green" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sectors.green.map((g) => (
              <SectorCard
                key={g.year}
                title={`Green Infrastructure — ${g.year}`}
                icon="🌳"
                metrics={[
                  { label: "Required Green Area", value: g.required_green_ha, unit: "ha", formula: g.formula },
                  { label: "Current Green Area", value: g.current_green_ha, unit: "ha" },
                  {
                    label: "Green Space Deficit",
                    value: g.gap_ha,
                    unit: "ha",
                    status: g.gap_ha === 0 ? "good" : g.gap_ha < 100 ? "warning" : "critical",
                    benchmark: "WHO: 10.5 m²/capita",
                  },
                  { label: "New Parks Needed", value: g.num_parks, unit: "parks (avg 5ha)" },
                ]}
              />
            ))}
          </div>
        </TabsContent>

        {/* Scenarios */}
        <TabsContent value="scenarios" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Water Demand — Scenario Comparison</CardTitle>
              <CardDescription>Three scenarios modelled to bracket infrastructure demand uncertainty</CardDescription>
            </CardHeader>
            <CardContent><ScenarioComparisonChart plan={plan} /></CardContent>
          </Card>
          <ScenarioPanel plan={plan} />
        </TabsContent>

        {/* Recommendations */}
        <TabsContent value="recommendations" className="mt-4">
          <RecommendationsPanel plan={plan} />
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Infrastructure Plan</CardTitle>
              <CardDescription>
                Download the complete master plan as a formatted Word document or a multi-sheet Excel workbook.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ExportButtons plan={plan} />
              <div className="border-t pt-4 space-y-2">
                <p className="text-sm font-medium">Word Report includes:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Executive Summary</li>
                  <li>City Profile & Land Use</li>
                  <li>Population Forecast</li>
                  <li>Infrastructure Gap Analysis</li>
                  <li>Sector-wise Planning (Water, Wastewater, Waste, Transport, Roads, Green)</li>
                  <li>Scenario Analysis (2050 comparison)</li>
                  <li>Recommendations & Phasing Plan</li>
                </ul>
              </div>
              <div className="border-t pt-4 space-y-2">
                <p className="text-sm font-medium">Excel Workbook includes:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Summary, Population, Water Planning, Wastewater</li>
                  <li>Solid Waste, Transport Model, Road Network</li>
                  <li>Green Infrastructure, Scenarios (all 3)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
