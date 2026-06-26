import Link from "next/link";
import { Plus } from "lucide-react";
import { getGastos, getCentrosCosto } from "@/actions/gastos";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default async function GastosGeneralesPage() {
  const [gastos, centrosCosto] = await Promise.all([getGastos(), getCentrosCosto()]);

  return (
    <>
      <PageHeader title="Gastos Generales" description="Gestión de gastos recurrentes y activos depreciables">
        <Link href="/gastos-generales/nuevo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Gasto
          </Button>
        </Link>
      </PageHeader>

      <Tabs defaultValue="gastos">
        <TabsList>
          <TabsTrigger value="gastos">Gastos Recurrentes</TabsTrigger>
          <TabsTrigger value="activos">Activos Depreciables</TabsTrigger>
        </TabsList>

        <TabsContent value="gastos" className="mt-6">
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Concepto</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Centro Costo</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Tipo</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">Monto</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-600">Frecuencia</th>
                  <th className="text-center py-3 px-4 font-medium text-slate-600">Estado</th>
                </tr>
              </thead>
              <tbody>
                {gastos.map((g) => (
                  <tr key={g.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium">{g.concepto}</td>
                    <td className="py-3 px-4 text-slate-600">{g.centroCosto.nombre}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{g.tipo}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(g.monto)}</td>
                    <td className="py-3 px-4 text-center capitalize text-slate-600">{g.frecuencia.toLowerCase()}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={g.activo ? "default" : "secondary"}>
                        {g.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {gastos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No hay gastos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="activos" className="mt-6">
          <ActivosSection />
        </TabsContent>
      </Tabs>
    </>
  );
}

async function ActivosSection() {
  const activos = await prismaGetActivos();
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/gastos-generales/activos">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Activo
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left py-3 px-4 font-medium text-slate-600">Nombre</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Centro Costo</th>
              <th className="text-right py-3 px-4 font-medium text-slate-600">Valor Adq.</th>
              <th className="text-center py-3 px-4 font-medium text-slate-600">Vida Útil</th>
              <th className="text-right py-3 px-4 font-medium text-slate-600">Dep. Mensual</th>
            </tr>
          </thead>
          <tbody>
            {activos.map((a) => (
              <tr key={a.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="py-3 px-4 font-medium">{a.nombre}</td>
                <td className="py-3 px-4 text-slate-600">{a.centroCosto.nombre}</td>
                <td className="py-3 px-4 text-right font-mono">{formatCurrency(a.valorAdquisicion)}</td>
                <td className="py-3 px-4 text-center">{a.vidaUtilMeses} meses</td>
                <td className="py-3 px-4 text-right font-mono">
                  {a.depreciaciones[0] ? formatCurrency(a.depreciaciones[0].monto) : "—"}
                </td>
              </tr>
            ))}
            {activos.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  No hay activos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function prismaGetActivos() {
  const { prisma } = await import("@/lib/prisma");
  return prisma.activoDepreciable.findMany({
    include: {
      centroCosto: true,
      depreciaciones: { where: { periodo: "2026-06" } },
    },
    orderBy: { nombre: "asc" },
  });
}
