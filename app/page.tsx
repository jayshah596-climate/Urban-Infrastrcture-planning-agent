"use client";

import { useState } from "react";
import { InputForm } from "@/components/InputForm";
import { Dashboard } from "@/components/Dashboard";
import { VadodaraDashboard } from "@/components/VadodaraDashboard";
import { PlanResult } from "@/lib/types";

type ActiveTab = "custom" | "vadodara";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("custom");
  const [plan, setPlan] = useState<PlanResult | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top tab bar — always visible */}
      <div className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-0">
            {/* Brand */}
            <div className="flex items-center gap-2 py-3 pr-6 border-r border-border mr-2">
              <span className="text-xl">🌍</span>
              <span className="font-bold text-sm text-slate-800 hidden sm:block">
                Urban Infrastructure Planning Agent
              </span>
              <span className="font-bold text-sm text-slate-800 sm:hidden">UIPA</span>
            </div>

            {/* Tabs */}
            <button
              onClick={() => { setActiveTab("custom"); setPlan(null); }}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "custom"
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <span>🏙️</span>
              <span>Custom City Plan</span>
            </button>

            <button
              onClick={() => { setActiveTab("vadodara"); setPlan(null); }}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "vadodara"
                  ? "border-orange-500 text-orange-700"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <span>🏛️</span>
              <span>Vadodara City</span>
              <span className="ml-1 bg-orange-100 text-orange-700 text-xs rounded-full px-2 py-0.5 font-semibold hidden sm:inline">
                Live Data
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "custom" ? (
        !plan ? (
          /* Custom — Landing / Input Page */
          <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            {/* Hero */}
            <div className="text-center mb-10">
              <div className="text-5xl mb-4">🌍</div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Generate a City Infrastructure Master Plan
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Enter your city parameters to produce technical projections to 2050,
                scenario analysis, and downloadable Word & Excel reports — no paid APIs.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {[
                  "💧 Water Supply",
                  "🚿 Wastewater",
                  "♻️ Solid Waste",
                  "🚌 Transport",
                  "🛣️ Roads",
                  "🌳 Green Space",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-blue-100 text-blue-700 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <InputForm onResult={(result) => setPlan(result as PlanResult)} />

            <p className="text-center text-xs text-slate-400 mt-8">
              All calculations use engineering standards (WHO, CPHEEO, URDPFI). No external APIs. Runs on Vercel free tier.
            </p>
          </div>
        ) : (
          /* Custom — Dashboard */
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Dashboard plan={plan} onReset={() => setPlan(null)} />
          </div>
        )
      ) : (
        /* Vadodara tab */
        <div className="max-w-7xl mx-auto px-4 py-6">
          <VadodaraDashboard />
        </div>
      )}
    </div>
  );
}
