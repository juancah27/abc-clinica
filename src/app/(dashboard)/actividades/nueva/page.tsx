import { PageHeader } from "@/components/layout/page-header";
import { ActividadForm } from "@/components/forms/actividad-form";

export default function NuevaActividadPage() {
  return (
    <>
      <PageHeader title="Nueva Actividad" description="Registrar una nueva actividad en el catálogo" />
      <div className="bg-white rounded-xl border shadow-sm p-6 max-w-2xl">
        <ActividadForm />
      </div>
    </>
  );
}
