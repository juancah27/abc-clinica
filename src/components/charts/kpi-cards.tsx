import {
  Card,
  Text,
  Metric,
  BadgeDelta,
  type DeltaType,
} from "@tremor/react";

interface KpiData {
  title: string;
  metric: string;
  delta?: string;
  deltaType?: DeltaType;
}

export function KpiCards({ data }: { data: KpiData[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((kpi) => (
        <Card key={kpi.title} className="p-5">
          <Text>{kpi.title}</Text>
          <Metric className="mt-1">{kpi.metric}</Metric>
          {kpi.delta && kpi.deltaType && (
            <BadgeDelta deltaType={kpi.deltaType} className="mt-2">
              {kpi.delta}
            </BadgeDelta>
          )}
        </Card>
      ))}
    </div>
  );
}
