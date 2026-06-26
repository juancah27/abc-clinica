import { PageHeader } from "@/components/layout/page-header";
import { KpiCards } from "@/components/charts/kpi-cards";
import { CostBreakdownChart } from "@/components/charts/cost-breakdown-chart";
import { ProfitabilityChart } from "@/components/charts/profitability-chart";
import {
  getDashboardKpis,
  getCostBreakdownData,
  getProfitabilityData,
} from "@/lib/dashboard-data";

export default async function DashboardPage(props: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  const searchParams = await props.searchParams;
  const periodo = searchParams.periodo || "2026-06";

  const [kpisData, breakdownData, profitabilityData] = await Promise.all([
    getDashboardKpis(periodo),
    getCostBreakdownData(periodo),
    getProfitabilityData(periodo),
  ]);

  return (
    <>
      <PageHeader title="Dashboard" description="Resumen de indicadores del sistema ABC" />

      <KpiCards data={kpisData.kpis} />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Costo por Actividad (Top 10)</h2>
          <CostBreakdownChart data={breakdownData} />
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Distribución por Categoría</h2>
          <ProfitabilityChart data={profitabilityData} />
        </div>
      </div>
    </>
  );
}
