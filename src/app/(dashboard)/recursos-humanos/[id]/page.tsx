import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getEmpleado, getDepartamentos } from "@/actions/empleados";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPeriodo } from "@/lib/utils";
import { CompensacionForm } from "./compensacion-form";

export default async function EmpleadoDetallePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const empleado = await getEmpleado(id);
  if (!empleado) notFound();

  const departamentos = await getDepartamentos();
  const costoReciente = empleado.costosHora[0];

  return (
    <>
      <PageHeader title={empleado.nombreCompleto} description={empleado.codigo}>
        <Link href="/recursos-humanos">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Información General</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-slate-500">Rol</dt>
                <dd className="font-medium capitalize">{empleado.rol.toLowerCase()}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Departamento</dt>
                <dd className="font-medium">{empleado.departamento.nombre}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Fecha de Ingreso</dt>
                <dd className="font-medium">{empleado.fechaIngreso.toLocaleDateString("es-MX")}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Estado</dt>
                <dd>
                  <Badge variant={empleado.activo ? "default" : "secondary"}>
                    {empleado.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Compensación</h2>
            <CompensacionForm empleadoId={empleado.id} compensacion={empleado.compensacion} departamentos={departamentos} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Costo por Hora</h2>
            {costoReciente ? (
              <div className="space-y-3">
                <div className="text-3xl font-bold text-teal-600">
                  {formatCurrency(costoReciente.costoHora)} <span className="text-sm font-normal text-slate-500">/hora</span>
                </div>
                <dl className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Horas anuales</dt>
                    <dd className="font-medium">{Number(costoReciente.horasAnuales).toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Costo anual total</dt>
                    <dd className="font-medium">{formatCurrency(costoReciente.costoAnualTotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Periodo</dt>
                    <dd className="font-medium">{formatPeriodo(costoReciente.periodo)}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Sin cálculo disponible. Guarde la compensación para generar el costo/hora.</p>
            )}
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Asignaciones</h2>
            {empleado.asignaciones.length > 0 ? (
              <ul className="text-sm space-y-2">
                {empleado.asignaciones.map((a) => (
                  <li key={a.id} className="flex justify-between">
                    <span className="text-slate-600">{a.actividad.nombre}</span>
                    <span className="font-mono">{Number(a.minutosPorEjecucion)} min</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">Sin asignaciones a actividades</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
