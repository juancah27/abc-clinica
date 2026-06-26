import Link from "next/link";
import { Plus } from "lucide-react";
import { getActividades } from "@/actions/actividades";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const categoriaColores: Record<string, string> = {
  CLINICA_DIRECTA: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CLINICA_APOYO: "bg-blue-50 text-blue-700 border-blue-200",
  OPERATIVA: "bg-amber-50 text-amber-700 border-amber-200",
  ADMINISTRATIVA: "bg-purple-50 text-purple-700 border-purple-200",
};

const categoriaLabels: Record<string, string> = {
  CLINICA_DIRECTA: "Clínica Directa",
  CLINICA_APOYO: "Clínica Apoyo",
  OPERATIVA: "Operativa",
  ADMINISTRATIVA: "Administrativa",
};

export default async function ActividadesPage() {
  const actividades = await getActividades();

  return (
    <>
      <PageHeader title="Actividades" description="Catálogo de actividades clínicas y operativas">
        <Link href="/actividades/nueva">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Actividad
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actividades.map((act) => (
          <Link
            key={act.id}
            href={`/actividades/${act.id}`}
            className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-mono text-slate-400">{act.codigo}</span>
              <Badge variant="outline" className={categoriaColores[act.categoria]}>
                {categoriaLabels[act.categoria]}
              </Badge>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{act.nombre}</h3>
            {act.descripcion && (
              <p className="text-sm text-slate-500 line-clamp-2 mb-3">{act.descripcion}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-3 border-t">
              <span>{act._count.asignaciones} asignaciones</span>
              <span>{act._count.inductores} inductores</span>
              {act.resultados[0] && (
                <span className="text-teal-600 font-medium ml-auto">
                  {formatCurrency(act.resultados[0].costoUnitario)}/und
                </span>
              )}
            </div>
          </Link>
        ))}
        {actividades.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            No hay actividades registradas
          </div>
        )}
      </div>
    </>
  );
}
