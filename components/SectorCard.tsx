import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface MetricItem {
  label: string;
  value: string | number;
  unit?: string;
  formula?: string;
  benchmark?: string;
  status?: "good" | "warning" | "critical";
}

interface SectorCardProps {
  title: string;
  icon: string;
  metrics: MetricItem[];
  className?: string;
}

export function SectorCard({ title, icon, metrics, className }: SectorCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {metrics.map((m, i) => (
          <div key={i} className="border-b border-border pb-3 last:border-0 last:pb-0">
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm text-muted-foreground">{m.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold tabular-nums">
                  {m.value}
                  {m.unit && <span className="ml-1 text-xs text-muted-foreground font-normal">{m.unit}</span>}
                </span>
                {m.status && (
                  <Badge
                    variant={
                      m.status === "good"
                        ? "success"
                        : m.status === "warning"
                        ? "warning"
                        : "danger"
                    }
                    className="text-xs"
                  >
                    {m.status === "good" ? "✓" : m.status === "warning" ? "!" : "✗"}
                  </Badge>
                )}
              </div>
            </div>
            {m.formula && (
              <p className="mt-1 text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                {m.formula}
              </p>
            )}
            {m.benchmark && (
              <p className="mt-1 text-xs text-muted-foreground">
                Benchmark: {m.benchmark}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
