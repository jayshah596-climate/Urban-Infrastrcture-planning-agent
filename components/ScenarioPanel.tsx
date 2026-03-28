import { PlanResult } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface ScenarioPanelProps {
  plan: PlanResult;
}

export function ScenarioPanel({ plan }: ScenarioPanelProps) {
  const { sustainable, bau, highGrowth } = plan.scenarios;
  const year2050Index = 2; // index for 2050

  const rows = [
    {
      label: "Population (2050)",
      sus: sustainable.sectors.water[year2050Index]?.population.toLocaleString() ?? "-",
      bau: bau.sectors.water[year2050Index]?.population.toLocaleString() ?? "-",
      hg: highGrowth.sectors.water[year2050Index]?.population.toLocaleString() ?? "-",
      unit: "",
    },
    {
      label: "Water Demand (2050)",
      sus: sustainable.sectors.water[year2050Index]?.demand_mld.toFixed(1) ?? "-",
      bau: bau.sectors.water[year2050Index]?.demand_mld.toFixed(1) ?? "-",
      hg: highGrowth.sectors.water[year2050Index]?.demand_mld.toFixed(1) ?? "-",
      unit: "MLD",
    },
    {
      label: "Sewage Generation (2050)",
      sus: sustainable.sectors.wastewater[year2050Index]?.sewage_mld.toFixed(1) ?? "-",
      bau: bau.sectors.wastewater[year2050Index]?.sewage_mld.toFixed(1) ?? "-",
      hg: highGrowth.sectors.wastewater[year2050Index]?.sewage_mld.toFixed(1) ?? "-",
      unit: "MLD",
    },
    {
      label: "Solid Waste (2050)",
      sus: sustainable.sectors.waste[year2050Index]?.generation_tpd.toFixed(0) ?? "-",
      bau: bau.sectors.waste[year2050Index]?.generation_tpd.toFixed(0) ?? "-",
      hg: highGrowth.sectors.waste[year2050Index]?.generation_tpd.toFixed(0) ?? "-",
      unit: "TPD",
    },
    {
      label: "Landfill Waste (2050)",
      sus: sustainable.sectors.waste[year2050Index]?.landfill_tpd.toFixed(0) ?? "-",
      bau: bau.sectors.waste[year2050Index]?.landfill_tpd.toFixed(0) ?? "-",
      hg: highGrowth.sectors.waste[year2050Index]?.landfill_tpd.toFixed(0) ?? "-",
      unit: "TPD",
    },
    {
      label: "Bus Fleet (2050)",
      sus: sustainable.sectors.transport[year2050Index]?.bus_fleet.toLocaleString() ?? "-",
      bau: bau.sectors.transport[year2050Index]?.bus_fleet.toLocaleString() ?? "-",
      hg: highGrowth.sectors.transport[year2050Index]?.bus_fleet.toLocaleString() ?? "-",
      unit: "buses",
    },
    {
      label: "Green Space Gap (2050)",
      sus: sustainable.sectors.green[year2050Index]?.gap_ha.toFixed(0) ?? "-",
      bau: bau.sectors.green[year2050Index]?.gap_ha.toFixed(0) ?? "-",
      hg: highGrowth.sectors.green[year2050Index]?.gap_ha.toFixed(0) ?? "-",
      unit: "ha",
    },
  ];

  const scenarios = [
    { key: "sus", config: sustainable.config },
    { key: "bau", config: bau.config },
    { key: "hg", config: highGrowth.config },
  ];

  const colColors = {
    sus: "text-green-700 bg-green-50",
    bau: "text-blue-700 bg-blue-50",
    hg: "text-red-700 bg-red-50",
  } as const;

  return (
    <div className="space-y-4">
      {/* Scenario cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map(({ key, config }) => (
          <Card key={key} className={`border-l-4 ${key === "sus" ? "border-l-green-500" : key === "bau" ? "border-l-blue-500" : "border-l-red-500"}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{config.label}</CardTitle>
              <CardDescription className="text-xs">{config.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Water Standard</span><span className="font-medium">{config.water_lpcd} LPCD</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Waste per Capita</span><span className="font-medium">{config.waste_kg_per_capita} kg/day</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Public Transport</span><span className="font-medium">{(config.public_transport_share * 100).toFixed(0)}%</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Recycling Rate</span><span className="font-medium">{(config.recycling_share * 100).toFixed(0)}%</span></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">2050 Scenario Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Metric</th>
                  <th className={`text-right py-2 px-3 font-medium rounded-t ${colColors.sus}`}>Sustainable</th>
                  <th className={`text-right py-2 px-3 font-medium ${colColors.bau}`}>BAU</th>
                  <th className={`text-right py-2 px-3 font-medium rounded-t ${colColors.hg}`}>High Growth</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-2 pr-4 text-muted-foreground">{row.label}</td>
                    <td className="py-2 px-3 text-right font-mono text-green-700">{row.sus} <span className="text-xs text-muted-foreground">{row.unit}</span></td>
                    <td className="py-2 px-3 text-right font-mono text-blue-700">{row.bau} <span className="text-xs text-muted-foreground">{row.unit}</span></td>
                    <td className="py-2 px-3 text-right font-mono text-red-700">{row.hg} <span className="text-xs text-muted-foreground">{row.unit}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
