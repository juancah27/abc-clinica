import { getResultadosCosteo, getPeriodosCosteo, getResumenCosteo } from "@/actions/costeo";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPeriodo } from "@/lib/utils";
import { CosteoActions } from "./costeo-actions";

export default async function CosteoPage(props: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  const searchParams = await props.searchParams;
  const periodo = searchParams.periodo || "2026-06";
  const [resultados, periodos, resumen] = await Promise.all([
    getResultadosCosteo(periodo),
    getPeriodosCosteo(),
    getResumenCosteo(periodo),
  ]);

  return (
    <>
      <PageHeader
        title="Costeo ABC"
        description={`Resultados del costeo para ${formatPeriodo(periodo)}`}
      >
        <CosteoActions periodo={periodo} periodos={periodos} hasResultados={resultados.length > 0} />
      </PageHeader>

      {resumen && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <p className="text-xs text-slate-500 mb-1">Costo Total</p>
            <p className="text-xl font-bold">{formatCurrency(resumen.totalCostos)}</p>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <p className="text-xs text-slate-500 mb-1">Costo Directo</p>
            <p className="text-xl font-bold text-emerald-600">{formatCurrency(resumen.totalDirecto)}</p>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <p className="text-xs text-slate-500 mb-1">Overhead</p>
            <p className="text-xl font-bold text-amber-600">{formatCurrency(resumen.totalOverhead)}</p>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <p className="text-xs text-slate-500 mb-1">Materiales</p>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(resumen.totalMateriales)}</p>
          </div>
          <div className="bg-white rounded-xl border shadow-sm p-4">
            <p className="text-xs text-slate-500 mb-1">Costo Prom. Unitario</p>
            <p className="text-xl font-bold">{formatCurrency(resumen.costoPromedioUnitario)}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left py-3 px-4 font-medium text-slate-600">Actividad</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Categoría</th>
              <th className="text-right py-3 px-4 font-medium text-slate-600">Directo</th>
              <th className="text-right py-3 px-4 font-medium text-slate-600">Overhead</th>
              <th className="text-right py-3 px-4 font-medium text-slate-600">Materiales</th>
              <th className="text-right py-3 px-4 font-medium text-slate-600">Total</th>
              <th className="text-right py-3 px-4 font-medium text-slate-600">Unitario</th>
              <th className="text-right py-3 px-4 font-medium text-slate-600">Volumen</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((r) => (
              <tr key={r.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium">{r.actividad.nombre}</td>
                <td className="py-3 px-4">
                  <Badge variant="outline">{r.actividad.categoria}</Badge>
                </td>
                <td className="py-3 px-4 text-right font-mono">{formatCurrency(r.costoDirectoPersonal)}</td>
                <td className="py-3 px-4 text-right font-mono">{formatCurrency(r.costoOverhead)}</td>
                <td className="py-3 px-4 text-right font-mono">{formatCurrency(r.costoMateriales)}</td>
                <td className="py-3 px-4 text-right font-mono font-semibold">{formatCurrency(r.costoTotal)}</td>
                <td className="py-3 px-4 text-right font-mono text-teal-600">{formatCurrency(r.costoUnitario)}</td>
                <td className="py-3 px-4 text-right font-mono">{Number(r.volumen)}</td>
              </tr>
            ))}
            {resultados.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  Sin resultados de costeo para este período. Presione "Calcular" para generar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
