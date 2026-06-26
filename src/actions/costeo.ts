"use server";

import { revalidatePath } from "next/cache";
import { ejecutarCosteo } from "@/lib/abc/asignar-costos";
import { prisma } from "@/lib/prisma";

export async function calcularCosteo(periodo: string) {
  const resumen = await ejecutarCosteo(periodo);
  revalidatePath("/costeo");
  revalidatePath("/dashboard");
  return resumen;
}

export async function getResultadosCosteo(periodo: string) {
  return prisma.resultadoCosteo.findMany({
    where: { periodo },
    include: { actividad: true },
    orderBy: { costoTotal: "desc" },
  });
}

export async function getPeriodosCosteo() {
  const results = await prisma.resultadoCosteo.findMany({
    select: { periodo: true },
    distinct: ["periodo"],
    orderBy: { periodo: "desc" },
  });
  return results.map((r) => r.periodo);
}

export async function getResumenCosteo(periodo: string) {
  const resultados = await getResultadosCosteo(periodo);
  if (resultados.length === 0) return null;

  const totalCostos = resultados.reduce((s, r) => s + Number(r.costoTotal), 0);
  const totalDirecto = resultados.reduce((s, r) => s + Number(r.costoDirectoPersonal), 0);
  const totalOverhead = resultados.reduce((s, r) => s + Number(r.costoOverhead), 0);
  const totalMateriales = resultados.reduce((s, r) => s + Number(r.costoMateriales), 0);
  const activas = resultados.filter((r) => Number(r.volumen) > 0);
  const costoPromedio = activas.length > 0
    ? activas.reduce((s, r) => s + Number(r.costoUnitario), 0) / activas.length
    : 0;

  return {
    periodo,
    totalCostos: Math.round(totalCostos * 100) / 100,
    totalDirecto: Math.round(totalDirecto * 100) / 100,
    totalOverhead: Math.round(totalOverhead * 100) / 100,
    totalMateriales: Math.round(totalMateriales * 100) / 100,
    costoPromedioUnitario: Math.round(costoPromedio * 10000) / 10000,
    actividades: resultados.length,
    calculadoEn: resultados[0]?.calculadoEn ?? new Date(),
  };
}
