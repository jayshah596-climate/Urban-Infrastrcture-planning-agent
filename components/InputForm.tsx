"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CityInput } from "@/lib/types";
import { Loader2 } from "lucide-react";

const CLIMATE_ZONES = [
  "Tropical Wet",
  "Tropical Dry",
  "Arid Desert",
  "Semi-Arid",
  "Mediterranean",
  "Humid Subtropical",
  "Oceanic",
  "Continental",
  "Subarctic",
  "Polar",
];

interface InputFormProps {
  onResult: (result: unknown) => void;
}

type FormState = {
  city_name: string;
  country: string;
  population_current: string;
  population_growth_rate: string;
  area_km2: string;
  climate_zone: string;
  land_use_residential: string;
  land_use_commercial: string;
  land_use_industrial: string;
  land_use_green: string;
  water_supply_lpcd: string;
  wastewater_coverage: string;
  solid_waste_tpd: string;
  road_density: string;
};

const DEFAULT: FormState = {
  city_name: "Example City",
  country: "India",
  population_current: "500000",
  population_growth_rate: "2.5",
  area_km2: "200",
  climate_zone: "Humid Subtropical",
  land_use_residential: "45",
  land_use_commercial: "20",
  land_use_industrial: "15",
  land_use_green: "10",
  water_supply_lpcd: "120",
  wastewater_coverage: "55",
  solid_waste_tpd: "280",
  road_density: "7.5",
};

export function InputForm({ onResult }: InputFormProps) {
  const [form, setForm] = useState<FormState>(DEFAULT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.city_name.trim()) errs.city_name = "Required";
    if (!form.country.trim()) errs.country = "Required";
    const pop = Number(form.population_current);
    if (isNaN(pop) || pop < 1000) errs.population_current = "Must be ≥ 1,000";
    const area = Number(form.area_km2);
    if (isNaN(area) || area < 1) errs.area_km2 = "Must be ≥ 1";
    if (!form.climate_zone) errs.climate_zone = "Select a climate zone";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError(null);
    try {
      const payload: CityInput = {
        city_name: form.city_name,
        country: form.country,
        population_current: Number(form.population_current),
        population_growth_rate: Number(form.population_growth_rate),
        area_km2: Number(form.area_km2),
        climate_zone: form.climate_zone,
        land_use: {
          residential: Number(form.land_use_residential),
          commercial: Number(form.land_use_commercial),
          industrial: Number(form.land_use_industrial),
          green_space: Number(form.land_use_green),
        },
        current: {
          water_supply_lpcd: Number(form.water_supply_lpcd),
          wastewater_coverage_percent: Number(form.wastewater_coverage),
          solid_waste_tpd: Number(form.solid_waste_tpd),
          road_density_km_per_km2: Number(form.road_density),
        },
      };

      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      const result = await res.json();
      onResult(result);
    } catch {
      setError("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* City Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span>🏙️</span> City Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>City Name *</Label>
            <Input value={form.city_name} onChange={update("city_name")} placeholder="e.g. Mumbai" />
            {fieldErrors.city_name && <p className="text-xs text-red-500">{fieldErrors.city_name}</p>}
          </div>
          <div className="space-y-1">
            <Label>Country *</Label>
            <Input value={form.country} onChange={update("country")} placeholder="e.g. India" />
            {fieldErrors.country && <p className="text-xs text-red-500">{fieldErrors.country}</p>}
          </div>
          <div className="space-y-1">
            <Label>Current Population *</Label>
            <Input value={form.population_current} onChange={update("population_current")} type="number" placeholder="500000" />
            {fieldErrors.population_current && <p className="text-xs text-red-500">{fieldErrors.population_current}</p>}
          </div>
          <div className="space-y-1">
            <Label>Annual Growth Rate (%)</Label>
            <Input value={form.population_growth_rate} onChange={update("population_growth_rate")} type="number" step="0.1" placeholder="2.5" />
          </div>
          <div className="space-y-1">
            <Label>City Area (km²) *</Label>
            <Input value={form.area_km2} onChange={update("area_km2")} type="number" step="0.1" placeholder="200" />
            {fieldErrors.area_km2 && <p className="text-xs text-red-500">{fieldErrors.area_km2}</p>}
          </div>
          <div className="space-y-1">
            <Label>Climate Zone *</Label>
            <Select
              value={form.climate_zone}
              onValueChange={(v) => setForm((f) => ({ ...f, climate_zone: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select zone" />
              </SelectTrigger>
              <SelectContent>
                {CLIMATE_ZONES.map((z) => (
                  <SelectItem key={z} value={z}>{z}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.climate_zone && <p className="text-xs text-red-500">{fieldErrors.climate_zone}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Land Use */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span>🗺️</span> Land Use Distribution (%)
          </CardTitle>
          <CardDescription>Percentages of total city area</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Residential", field: "land_use_residential" as const },
            { label: "Commercial", field: "land_use_commercial" as const },
            { label: "Industrial", field: "land_use_industrial" as const },
            { label: "Green Space", field: "land_use_green" as const },
          ].map(({ label, field }) => (
            <div key={field} className="space-y-1">
              <Label>{label}</Label>
              <Input value={form[field]} onChange={update(field)} type="number" min="0" max="100" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Current Infrastructure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span>🏗️</span> Current Infrastructure
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Water Supply (LPCD)</Label>
            <Input value={form.water_supply_lpcd} onChange={update("water_supply_lpcd")} type="number" placeholder="120" />
            <p className="text-xs text-muted-foreground">Standard: 135–150 LPCD</p>
          </div>
          <div className="space-y-1">
            <Label>Wastewater Coverage (%)</Label>
            <Input value={form.wastewater_coverage} onChange={update("wastewater_coverage")} type="number" placeholder="55" />
            <p className="text-xs text-muted-foreground">Target: 80%+</p>
          </div>
          <div className="space-y-1">
            <Label>Solid Waste Generated (TPD)</Label>
            <Input value={form.solid_waste_tpd} onChange={update("solid_waste_tpd")} type="number" placeholder="280" />
          </div>
          <div className="space-y-1">
            <Label>Road Density (km/km²)</Label>
            <Input value={form.road_density} onChange={update("road_density")} type="number" step="0.1" placeholder="7.5" />
            <p className="text-xs text-muted-foreground">Benchmark: 10–12 km/km²</p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} size="lg" className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Infrastructure Plan...
          </>
        ) : (
          "🚀 Generate Master Plan"
        )}
      </Button>
    </form>
  );
}
