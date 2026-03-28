"use client";

import { useState } from "react";
import { InputForm } from "@/components/InputForm";
import { Dashboard } from "@/components/Dashboard";
import { PlanResult } from "@/lib/types";

export default function Home() {
  const [plan, setPlan] = useState<PlanResult | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {!plan ? (
        /* Landing / Input Page */
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🌍</div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Urban Infrastructure Planning Agent
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Generate a comprehensive city-level master plan — covering water, wastewater,
              solid waste, transport, roads, and green infrastructure — with scenario
              projections to 2050 and downloadable Word & Excel reports.
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

          {/* Form */}
          <InputForm onResult={(result) => setPlan(result as PlanResult)} />

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 mt-8">
            All calculations use engineering standards (WHO, CPHEEO). No external APIs.
            Runs on Vercel free tier.
          </p>
        </div>
      ) : (
        /* Dashboard */
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Dashboard plan={plan} onReset={() => setPlan(null)} />
        </div>
      )}
    </div>
  );
}
