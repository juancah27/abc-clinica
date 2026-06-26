import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export async function getDashboardKpis(periodo: string) {
  const resultados = await prisma.resultadoCosteo.findMany({
    where: { periodo },
    include: { actividad: true },
  });

  if (resultados.length === 0) {
    return {
      kpis: [
        { title: "Costo Total", metric: "$0" },
        { title: "Costo/Paciente Prom.", metric: "$0" },
        { title: "Actividad más costosa", metric: "—" },
        { title: "Overhead %", metric: "0%" },
      ],
      totalCostos: 0,
    };
  }

  const totalCostos = resultados.reduce((s, r) => s + Number(r.costoTotal), 0);
  const totalOverhead = resultados.reduce((s, r) => s + Number(r.costoOverhead), 0);
  const overheadPct = totalCostos > 0 ? (totalOverhead / totalCostos) * 100 : 0;

  const sorted = [...resultados].sort((a, b) => Number(b.costoTotal) - Number(a.costoTotal));
  const masCostosa = sorted[0];

  const activasConVolumen = resultados.filter((r) => Number(r.volumen) > 0);
  const costoPromedioPaciente = activasConVolumen.length > 0
    ? activasConVolumen.reduce((s, r) => s + Number(r.costoTotal), 0) / activasConVolumen.reduce((s, r) => s + Number(r.volumen), 0)
    : 0;

  return {
    kpis: [
      {
        title: "Costo Total",
        metric: formatCurrency(totalCostos),
        delta: `${resultados.length} actividades`,
        deltaType: "moderateIncrease" as const,
      },
      {
        title: "Costo/Paciente Prom.",
        metric: formatCurrency(costoPromedioPaciente),
        deltaType: "moderateIncrease" as const,
      },
      {
        title: "Actividad más costosa",
        metric: masCostosa?.actividad.nombre ?? "—",
        delta: formatCurrency(masCostosa?.costoTotal ?? 0),
        deltaType: "moderateIncrease" as const,
      },
      {
        title: "Overhead %",
        metric: `${overheadPct.toFixed(1)}%`,
        delta: formatCurrency(totalOverhead),
        deltaType: "moderateIncrease" as const,
      },
    ],
    totalCostos,
  };
}

export async function getCostBreakdownData(periodo: string) {
  const resultados = await prisma.resultadoCosteo.findMany({
    where: { periodo },
    include: { actividad: true },
    orderBy: { costoTotal: "desc" },
    take: 10,
  });

  return resultados.map((r) => ({
    name: r.actividad.nombre.length > 18
      ? r.actividad.nombre.substring(0, 16) + "…"
      : r.actividad.nombre,
    Directo: Number(r.costoDirectoPersonal),
    Overhead: Number(r.costoOverhead),
    Materiales: Number(r.costoMateriales),
  }));
}

export async function getProfitabilityData(periodo: string) {
  const resultados = await prisma.resultadoCosteo.findMany({
    where: { periodo },
    include: { actividad: true },
  });

  const byCategoria: Record<string, number> = {};
  for (const r of resultados) {
    const cat = r.actividad.categoria;
    byCategoria[cat] = (byCategoria[cat] || 0) + Number(r.costoTotal);
  }

  const labels: Record<string, string> = {
    CLINICA_DIRECTA: "Clínica Directa",
    CLINICA_APOYO: "Clínica Apoyo",
    OPERATIVA: "Operativa",
    ADMINISTRATIVA: "Administrativa",
  };

  return Object.entries(byCategoria).map(([key, value]) => ({
    name: labels[key] || key,
    value: Math.round(value * 100) / 100,
  }));
}
