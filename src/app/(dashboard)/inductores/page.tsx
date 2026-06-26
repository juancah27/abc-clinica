import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";

export default async function InductoresPage() {
  const inductores = await prisma.inductor.findMany({
    include: {
      actividades: {
        include: {
          actividad: true,
          centroCosto: true,
        },
      },
    },
    orderBy: { codigo: "asc" },
  });

  return (
    <>
      <PageHeader title="Inductores" description="Matriz de inductores vinculados a actividades" />

      {inductores.length === 0 ? (
        <p className="text-slate-400">No hay inductores registrados</p>
      ) : (
        <div className="space-y-6">
          {inductores.map((ind) => (
            <div key={ind.id} className="bg-white rounded-xl border shadow-sm">
              <div className="p-5 border-b bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">{ind.codigo}</span>
                  <h2 className="font-semibold">{ind.nombre}</h2>
                  <Badge variant="outline">{ind.tipo}</Badge>
                  <span className="text-sm text-slate-400">{ind.unidad}</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-slate-500">
                      <th className="py-3 px-4 font-medium">Actividad</th>
                      <th className="py-3 px-4 font-medium">Categoría</th>
                      <th className="py-3 px-4 font-medium">Centro Costo</th>
                      <th className="py-3 px-4 font-medium text-right">Peso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ind.actividades.map((ia) => (
                      <tr key={ia.id} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium">{ia.actividad.nombre}</td>
                        <td className="py-3 px-4 text-slate-600 capitalize">{ia.actividad.categoria.toLowerCase().replace(/_/g, " ")}</td>
                        <td className="py-3 px-4 text-slate-600">{ia.centroCosto?.nombre ?? "—"}</td>
                        <td className="py-3 px-4 text-right">{Number(ia.pesoAsignacion)}%</td>
                      </tr>
                    ))}
                    {ind.actividades.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          Sin actividades vinculadas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
