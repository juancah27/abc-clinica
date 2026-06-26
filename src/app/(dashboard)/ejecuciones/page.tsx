import { getActividadesConEjecuciones, getPeriodosDisponibles } from "@/actions/ejecuciones";
import { PageHeader } from "@/components/layout/page-header";
import { EjecucionForm } from "@/components/forms/ejecucion-form";
import { SelectPeriodo } from "./select-periodo";

export default async function EjecucionesPage(props: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  const searchParams = await props.searchParams;
  const periodo = searchParams.periodo || "2026-06";
  const [actividades, periodos] = await Promise.all([
    getActividadesConEjecuciones(periodo),
    getPeriodosDisponibles(),
  ]);

  return (
    <>
      <PageHeader title="Ejecuciones" description="Registro de volumen mensual por actividad">
        <SelectPeriodo periodos={periodos} selected={periodo} />
      </PageHeader>

      <EjecucionForm periodo={periodo} actividades={actividades} />
    </>
  );
}
