import Link from "next/link";
import { Plus } from "lucide-react";
import { getEmpleados } from "@/actions/empleados";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default async function RecursosHumanosPage() {
  const empleados = await getEmpleados();

  return (
    <>
      <PageHeader title="Recursos Humanos" description="Gestión de empleados y compensaciones">
        <Link href="/recursos-humanos/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Empleado
          </Button>
        </Link>
      </PageHeader>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left py-3 px-4 font-medium text-slate-600">Código</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Nombre</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Rol</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Departamento</th>
              <th className="text-right py-3 px-4 font-medium text-slate-600">Costo/Hora</th>
              <th className="text-center py-3 px-4 font-medium text-slate-600">Estado</th>
              <th className="text-right py-3 px-4 font-medium text-slate-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp) => (
              <tr key={emp.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="py-3 px-4 font-mono text-xs">{emp.codigo}</td>
                <td className="py-3 px-4 font-medium">
                  <Link href={`/recursos-humanos/${emp.id}`} className="hover:text-teal-600">
                    {emp.nombreCompleto}
                  </Link>
                </td>
                <td className="py-3 px-4 capitalize text-slate-600">{emp.rol.toLowerCase()}</td>
                <td className="py-3 px-4 text-slate-600">{emp.departamento.nombre}</td>
                <td className="py-3 px-4 text-right font-mono">
                  {emp.costosHora[0] ? formatCurrency(emp.costosHora[0].costoHora) : "—"}
                </td>
                <td className="py-3 px-4 text-center">
                  <Badge variant={emp.activo ? "default" : "secondary"}>
                    {emp.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/recursos-humanos/${emp.id}`}
                    className="text-sm text-teal-600 hover:underline"
                  >
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
            {empleados.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No hay empleados registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
