"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { PlanResult } from "@/lib/types";
import { FileText, FileSpreadsheet, Loader2 } from "lucide-react";

interface ExportButtonsProps {
  plan: PlanResult;
}

export function ExportButtons({ plan }: ExportButtonsProps) {
  const [loadingWord, setLoadingWord] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadFile = async (
    url: string,
    filename: string,
    setLoading: (v: boolean) => void
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      setError("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const citySlug = plan.input.city_name.replace(/\s+/g, "_");

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() =>
            downloadFile(
              "/api/export/word",
              `${citySlug}_Infrastructure_Plan.docx`,
              setLoadingWord
            )
          }
          disabled={loadingWord || loadingExcel}
          variant="default"
          className="flex items-center gap-2"
        >
          {loadingWord ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          Download Word Report (.docx)
        </Button>

        <Button
          onClick={() =>
            downloadFile(
              "/api/export/excel",
              `${citySlug}_Infrastructure_Plan.xlsx`,
              setLoadingExcel
            )
          }
          disabled={loadingWord || loadingExcel}
          variant="outline"
          className="flex items-center gap-2"
        >
          {loadingExcel ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="h-4 w-4" />
          )}
          Download Excel Sheet (.xlsx)
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
