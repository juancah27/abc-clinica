import { getCentrosCosto } from "@/actions/gastos";
import { PageHeader } from "@/components/layout/page-header";
import { GastoForm } from "@/components/forms/gasto-form";

export default async function NuevoGastoPage() {
  const centrosCosto = await getCentrosCosto();
  return (
    <>
      <PageHeader title="Nuevo Gasto General" description="Registrar un nuevo gasto recurrente" />
      <div className="bg-white rounded-xl border shadow-sm p-6 max-w-2xl">
        <GastoForm centrosCosto={centrosCosto} />
      </div>
    </>
  );
}
