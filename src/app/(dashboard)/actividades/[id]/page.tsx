import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getActividad } from "@/actions/actividades";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const categoriaLabels: Record<string, string> = {
  CLINICA_DIRECTA: "Clínica Directa",
  CLINICA_APOYO: "Clínica Apoyo",
  OPERATIVA: "Operativa",
  ADMINISTRATIVA: "Administrativa",
};

export default async function ActividadDetallePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const actividad = await getActividad(id);
  if (!actividad) notFound();

  const resultado = actividad.resultados[0];

  return (
    <>
      <PageHeader title={actividad.nombre} description={`${actividad.codigo} · ${categoriaLabels[actividad.categoria]}`}>
        <Link href="/actividades">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Asignaciones de Personal</h2>
            {actividad.asignaciones.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="py-2 pr-4">Empleado</th>
                    <th className="py-2 pr-4">Rol</th>
                    <th className="py-2 pr-4 text-right">Minutos</th>
                    <th className="py-2 pr-4 text-right">Costo/Hora</th>
                    <th className="py-2 text-center">Principal</th>
                  </tr>
                </thead>
                <tbody>
                  {actividad.asignaciones.map((a) => (
                    <tr key={a.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{a.empleado.nombreCompleto}</td>
                      <td className="py-2 pr-4 capitalize text-slate-600">{a.empleado.rol.toLowerCase()}</td>
                      <td className="py-2 pr-4 text-right font-mono">{Number(a.minutosPorEjecucion)}</td>
                      <td className="py-2 pr-4 text-right font-mono">
                        {a.empleado.costosHora[0] ? formatCurrency(a.empleado.costosHora[0].costoHora) : "—"}
                      </td>
                      <td className="py-2 text-center">
                        {a.esPrincipal ? <Badge variant="default">Sí</Badge> : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-slate-400">Sin asignaciones de personal</p>
            )}
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Inductores Vinculados</h2>
            {actividad.inductores.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-slate-500">
                    <th className="py-2 pr-4">Inductor</th>
                    <th className="py-2 pr-4">Tipo</th>
                    <th className="py-2 pr-4">Centro Costo</th>
                    <th className="py-2 text-right">Peso</th>
                  </tr>
                </thead>
                <tbody>
                  {actividad.inductores.map((ind) => (
                    <tr key={ind.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{ind.inductor.nombre}</td>
                      <td className="py-2 pr-4 text-slate-600">{ind.inductor.tipo}</td>
                      <td className="py-2 pr-4 text-slate-600">{ind.centroCosto?.nombre ?? "—"}</td>
                      <td className="py-2 text-right">{Number(ind.pesoAsignacion)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-slate-400">Sin inductores vinculados</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {resultado && (
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Último Costeo</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Costo Directo</dt>
                  <dd className="font-medium">{formatCurrency(resultado.costoDirectoPersonal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Overhead</dt>
                  <dd className="font-medium">{formatCurrency(resultado.costoOverhead)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Materiales</dt>
                  <dd className="font-medium">{formatCurrency(resultado.costoMateriales)}</dd>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <dt>Costo Total</dt>
                  <dd>{formatCurrency(resultado.costoTotal)}</dd>
                </div>
                <div className="flex justify-between text-teal-600 font-medium">
                  <dt>Costo Unitario</dt>
                  <dd>{formatCurrency(resultado.costoUnitario)}</dd>
                </div>
                <div className="flex justify-between text-slate-500">
                  <dt>Volumen</dt>
                  <dd>{Number(resultado.volumen)}</dd>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Materiales</h2>
            {actividad.materiales.length > 0 ? (
              <ul className="text-sm space-y-1">
                {actividad.materiales.map((m) => (
                  <li key={m.id} className="flex justify-between">
                    <span>{m.nombre}</span>
                    <span className="font-mono">{formatCurrency(m.costoUnitario)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">Sin materiales registrados</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
