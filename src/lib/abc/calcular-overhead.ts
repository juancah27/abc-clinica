import { prisma } from "@/lib/prisma";
import type { PoolOverhead, TasaInductor } from "./types";

export async function calcularPoolOverhead(periodo: string): Promise<PoolOverhead[]> {
  const [year, month] = periodo.split("-").map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const centrosCosto = await prisma.centroCosto.findMany({
    include: {
      gastos: {
        where: { activo: true, fechaInicio: { lte: endDate } },
      },
      activos: {
        include: {
          depreciaciones: { where: { periodo } },
        },
      },
    },
  });

  return centrosCosto.map((cc) => {
    let totalGastos = 0;
    for (const g of cc.gastos) {
      const monto = Number(g.monto);
      switch (g.frecuencia) {
        case "MENSUAL":
          totalGastos += monto;
          break;
        case "TRIMESTRAL":
          totalGastos += monto / 3;
          break;
        case "ANUAL":
          totalGastos += monto / 12;
          break;
      }
    }

    let totalDepreciacion = 0;
    for (const a of cc.activos) {
      const dep = a.depreciaciones[0];
      if (dep) totalDepreciacion += Number(dep.monto);
    }

    return {
      centroCostoId: cc.id,
      centroCostoNombre: cc.nombre,
      totalGastos: Math.round(totalGastos * 100) / 100,
      totalDepreciacion: Math.round(totalDepreciacion * 100) / 100,
      totalPool: Math.round((totalGastos + totalDepreciacion) * 100) / 100,
    };
  });
}

export async function calcularTasaInductor(
  periodo: string,
  pools: PoolOverhead[]
): Promise<TasaInductor[]> {
  const inductorActividades = await prisma.inductorActividad.findMany({
    where: { centroCostoId: { not: null } },
    include: { inductor: true },
  });

  const tasas: TasaInductor[] = [];

  for (const ia of inductorActividades) {
    if (!ia.centroCostoId) continue;
    const pool = pools.find((p) => p.centroCostoId === ia.centroCostoId);
    if (!pool || pool.totalPool === 0) continue;

    const ejecuciones = await prisma.ejecucionActividad.findMany({
      where: {
        actividadId: ia.actividadId,
        periodo,
      },
    });

    const volumenTotal = ejecuciones.reduce((sum, e) => sum + Number(e.volumen), 0);
    if (volumenTotal === 0) continue;

    const poolPonderado = pool.totalPool * (Number(ia.pesoAsignacion) / 100);
    const tasa = poolPonderado / volumenTotal;

    tasas.push({
      inductorId: ia.inductorId,
      inductorNombre: ia.inductor.nombre,
      totalPool: poolPonderado,
      volumenTotal,
      tasa: Math.round(tasa * 10000) / 10000,
    });
  }

  return tasas;
}
