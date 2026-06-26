import { getDepartamentos } from "@/actions/empleados";
import { PageHeader } from "@/components/layout/page-header";
import { EmpleadoForm } from "@/components/forms/empleado-form";

export default async function NuevoEmpleadoPage() {
  const departamentos = await getDepartamentos();

  return (
    <>
      <PageHeader title="Nuevo Empleado" description="Registrar un nuevo empleado en el sistema" />
      <div className="bg-white rounded-xl border shadow-sm p-6 max-w-2xl">
        <EmpleadoForm departamentos={departamentos} />
      </div>
    </>
  );
}
