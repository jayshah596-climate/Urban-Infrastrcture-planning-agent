import { PlanResult, RecommendationSeverity } from "@/lib/types";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface RecommendationsPanelProps {
  plan: PlanResult;
}

const severityConfig: Record<RecommendationSeverity, { label: string; color: string; icon: string }> = {
  HIGH: { label: "HIGH", color: "danger", icon: "🔴" },
  MEDIUM: { label: "MEDIUM", color: "warning", icon: "🟡" },
  LOW: { label: "LOW", color: "secondary", icon: "🟢" },
};

export function RecommendationsPanel({ plan }: RecommendationsPanelProps) {
  const { recommendations } = plan;

  const grouped = recommendations.reduce(
    (acc, rec) => {
      const sev = rec.severity;
      if (!acc[sev]) acc[sev] = [];
      acc[sev].push(rec);
      return acc;
    },
    {} as Record<RecommendationSeverity, typeof recommendations>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        {(["HIGH", "MEDIUM", "LOW"] as RecommendationSeverity[]).map((sev) => (
          <div
            key={sev}
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
              sev === "HIGH"
                ? "bg-red-50 text-red-700 border border-red-200"
                : sev === "MEDIUM"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {severityConfig[sev].icon} {grouped[sev]?.length ?? 0} {sev}
          </div>
        ))}
      </div>

      {(["HIGH", "MEDIUM", "LOW"] as RecommendationSeverity[]).map((sev) =>
        grouped[sev]?.map((rec, i) => (
          <Card
            key={`${sev}-${i}`}
            className={`border-l-4 ${
              sev === "HIGH"
                ? "border-l-red-500"
                : sev === "MEDIUM"
                ? "border-l-amber-500"
                : "border-l-green-500"
            }`}
          >
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{severityConfig[sev].icon}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{rec.title}</span>
                      <Badge
                        variant={severityConfig[sev].color as "danger" | "warning" | "secondary"}
                        className="text-xs"
                      >
                        {sev}
                      </Badge>
                      <span className="text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5">
                        {rec.sector}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{rec.detail}</p>
              <div className="flex items-start gap-2 bg-muted rounded-md p-3">
                <span className="text-sm font-medium text-foreground min-w-fit">Action:</span>
                <p className="text-sm text-foreground">{rec.action}</p>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
