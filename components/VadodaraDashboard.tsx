"use client";

import { useEffect, useState } from "react";
import { PlanResult } from "@/lib/types";
import { VADODARA_INPUT, VADODARA_FACTS, VADODARA_CHALLENGES } from "@/lib/vadodara-data";
import { runPlanningEngine } from "@/lib/engine";
import { Dashboard } from "./Dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

type ViewState = "city-profile" | "dashboard";

export function VadodaraDashboard() {
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [view, setView] = useState<ViewState>("city-profile");

  // Run the planning engine client-side on first render (pure JS — instant)
  useEffect(() => {
    const result = runPlanningEngine(VADODARA_INPUT);
    setPlan(result);
  }, []);

  if (!plan) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground text-sm animate-pulse">
          Computing Vadodara infrastructure plan...
        </div>
      </div>
    );
  }

  if (view === "dashboard") {
    return (
      <Dashboard
        plan={plan}
        onReset={() => setView("city-profile")}
      />
    );
  }

  // City Profile view — shown first so users see the real data context
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-xl bg-gradient-to-r from-orange-600 to-orange-400 p-6 text-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl">🏙️</span>
              <h1 className="text-3xl font-bold">Vadodara (Baroda)</h1>
            </div>
            <p className="text-orange-100 text-sm">Gujarat, India · Vadodara Municipal Corporation</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Smart City Mission", "AMRUT 2.0", "Semi-Arid Climate", "Major Industrial Hub"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-white/20 rounded-full px-3 py-0.5 text-white border border-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setView("dashboard")}
            className="bg-white text-orange-600 hover:bg-orange-50 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            View Full Master Plan →
          </button>
        </div>
      </div>

      {/* Key metrics strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: "👥", label: "Population (2024)", value: "~2.17 M", sub: "UA: ~2.33 M" },
          { icon: "📐", label: "City Area", value: "414 km²", sub: "VMC jurisdiction" },
          { icon: "📈", label: "Growth Rate", value: "2.1% p.a.", sub: "Est. Census trend" },
          { icon: "🏭", label: "Economy", value: "Petrochem / Engg", sub: "GIDC Makarpura hub" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-4 pb-4">
              <div className="text-2xl mb-1">{kpi.icon}</div>
              <div className="text-lg font-bold leading-tight">{kpi.value}</div>
              <div className="text-xs text-muted-foreground font-medium">{kpi.label}</div>
              <div className="text-xs text-muted-foreground">{kpi.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* City facts + infrastructure status side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* City Facts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span>📋</span> City Profile — Key Facts
            </CardTitle>
            <CardDescription>
              Based on VMC Annual Reports, Census 2011 extrapolation & Smart City baseline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {VADODARA_FACTS.map((fact, i) => (
              <div key={i} className="flex items-start gap-3 py-1.5 border-b border-border last:border-0">
                <span className="text-lg mt-0.5 shrink-0">{fact.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{fact.label}</div>
                  <div className="text-sm font-medium">{fact.value}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Current Infrastructure Gaps */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span>🏗️</span> Current Infrastructure Status
              </CardTitle>
              <CardDescription>VMC baseline 2023 — used as inputs for the planning model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  icon: "💧",
                  label: "Water Supply",
                  value: "135 LPCD",
                  target: "150 LPCD standard",
                  status: "warning" as const,
                  note: "NRW ~28% | Pratapnagar + Nimeta WTPs: 360 MLD total",
                },
                {
                  icon: "🚿",
                  label: "Wastewater Coverage",
                  value: "68%",
                  target: "80% target",
                  status: "warning" as const,
                  note: "3 STPs: 190 MLD capacity | ~110 MLD gap → Vishwamitri River",
                },
                {
                  icon: "♻️",
                  label: "Solid Waste",
                  value: "~950 TPD",
                  target: "Recycling: 22%",
                  status: "critical" as const,
                  note: "Legacy Padra dump — new SLF under construction",
                },
                {
                  icon: "🛣️",
                  label: "Road Density",
                  value: "9.2 km/km²",
                  target: "11 km/km² benchmark",
                  status: "warning" as const,
                  note: "BRTS 100 km | Total network ~3,520 km | DP-2031 target: 12 km/km²",
                },
                {
                  icon: "🌳",
                  label: "Green Space",
                  value: "7% of area",
                  target: "WHO: 10.5 m²/capita",
                  status: "critical" as const,
                  note: "Sayaji Baug 113 ac + Kamati Baug — below WHO minimum",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-lg shrink-0 mt-0.5">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-sm font-medium">{item.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold tabular-nums">{item.value}</span>
                        <Badge
                          variant={item.status === "critical" ? "danger" : "warning"}
                          className="text-xs"
                        >
                          {item.status === "critical" ? "Below Standard" : "Needs Improvement"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.note}</div>
                    <div className="text-xs text-blue-600 mt-0.5">Target: {item.target}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Planning Horizon KPIs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span>📊</span> 2050 Planning Horizon (BAU)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Population 2050",
                  value: plan.projections[2].population.toLocaleString(),
                  icon: "👥",
                },
                {
                  label: "Water Demand 2050",
                  value: `${plan.sectors.water[2].demand_mld.toFixed(0)} MLD`,
                  icon: "💧",
                },
                {
                  label: "Waste Generated 2050",
                  value: `${plan.sectors.waste[2].generation_tpd.toFixed(0)} TPD`,
                  icon: "♻️",
                },
                {
                  label: "Green Space Gap 2050",
                  value: `${plan.sectors.green[2].gap_ha.toFixed(0)} ha`,
                  icon: "🌳",
                },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="bg-muted rounded-lg p-3 text-center"
                >
                  <div className="text-xl mb-1">{kpi.icon}</div>
                  <div className="text-base font-bold">{kpi.value}</div>
                  <div className="text-xs text-muted-foreground">{kpi.label}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* City-specific challenges */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-orange-800">
            <span>⚠️</span> Vadodara-Specific Infrastructure Challenges
          </CardTitle>
          <CardDescription className="text-orange-700">
            Unique issues beyond standard benchmarks — require city-specific planning responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {VADODARA_CHALLENGES.map((challenge, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-orange-900">
                <span className="mt-0.5 shrink-0 text-orange-500">→</span>
                {challenge}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Recommendations preview */}
      {plan.recommendations.filter((r) => r.severity === "HIGH").length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span>🔴</span> Critical Actions Identified
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {plan.recommendations
              .filter((r) => r.severity === "HIGH")
              .map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <span className="text-sm font-semibold text-red-700 min-w-fit">[{rec.sector}]</span>
                  <div>
                    <p className="text-sm font-medium text-red-800">{rec.title}</p>
                    <p className="text-xs text-red-600 mt-0.5">{rec.action}</p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Data disclaimer */}
      <div className="text-xs text-muted-foreground bg-muted rounded-lg px-4 py-3">
        <strong>Data Sources:</strong> Vadodara Municipal Corporation Annual Reports 2022–24 ·
        Census of India 2011 (extrapolated) · VMC Smart City Mission Baseline ·
        AMRUT 2.0 Project Reports · Swachh Survekshan 2023 · Gujarat Development Plan 2031 ·
        BRTS Vadodara Survey 2022 · CPCB Vishwamitri River Basin Data.
        Population figures are estimates; infrastructure data reflects 2022–23 baseline.
      </div>

      {/* CTA */}
      <div className="flex justify-center pb-4">
        <button
          onClick={() => setView("dashboard")}
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-sm text-sm"
        >
          🚀 Open Full Vadodara Infrastructure Dashboard →
        </button>
      </div>
    </div>
  );
}
