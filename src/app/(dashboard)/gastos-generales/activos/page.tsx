import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { getActivos, getCentrosCosto } from "@/actions/gastos";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { FormActivo } from "./form-activo";

export default async function ActivosPage() {
  const [activos, centrosCosto] = await Promise.all([getActivos(), getCentrosCosto()]);
  return (
    <>
      <PageHeader title="Activos Depreciables" description="Gestión de equipos y su depreciación mensual">
        <Link href="/gastos-generales">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Registrar Nuevo Activo</h2>
          <FormActivo centrosCosto={centrosCosto} />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Activos Registrados</h2>
          {activos.length === 0 ? (
            <p className="text-sm text-slate-400">No hay activos registrados</p>
          ) : (
            activos.map((a) => (
              <div key={a.id} className="bg-white rounded-xl border shadow-sm p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{a.nombre}</h3>
                    <p className="text-sm text-slate-500">{a.centroCosto.nombre}</p>
                  </div>
                  <span className="text-xs text-slate-400">{a.vidaUtilMeses} meses</span>
                </div>
                <div className="mt-2 flex gap-4 text-sm">
                  <span className="text-slate-600">
                    Adq: ${Number(a.valorAdquisicion).toLocaleString()}
                  </span>
                  <span className="text-teal-600 font-medium">
                    Dep. mensual: ${a.depreciaciones[0] ? Number(a.depreciaciones[0].monto).toFixed(2) : "—"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
