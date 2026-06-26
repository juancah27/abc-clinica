import { prisma } from "@/lib/prisma";
import { calcularCostoHora } from "./calcular-costo-hora";
import { calcularPoolOverhead, calcularTasaInductor } from "./calcular-overhead";
import type { ResumenCosteo, ResultadoCosto } from "./types";

export async function ejecutarCosteo(periodo: string): Promise<ResumenCosteo> {
  const [year, month] = periodo.split("-").map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const actividades = await prisma.actividad.findMany({
    where: { activa: true },
    include: {
      asignaciones: {
        include: {
          empleado: {
            include: { compensacion: { include: { beneficios: true } } },
          },
        },
      },
      inductores: { include: { inductor: true } },
      materiales: true,
      ejecuciones: { where: { periodo } },
    },
  });

  const pools = await calcularPoolOverhead(periodo);
  const tasasInductores = await calcularTasaInductor(periodo, pools);

  const resultados: ResultadoCosto[] = [];
  let totalDirecto = 0;
  let totalOverhead = 0;
  let totalMateriales = 0;

  for (const act of actividades) {
    const ejecucionAct = act.ejecuciones[0];
    const volumen = ejecucionAct ? Number(ejecucionAct.volumen) : 0;

    let costoDirectoPersonal = 0;

    for (const asig of act.asignaciones) {
      const emp = asig.empleado;
      if (!emp.compensacion) continue;

      const costoHora = await calcularCostoHora(emp.id, periodo);
      const minutos = Number(asig.minutosPorEjecucion);
      costoDirectoPersonal += costoHora.costoHora * (minutos / 60);
    }

    let costoOverhead = 0;
    for (const ia of act.inductores) {
      const tasa = tasasInductores.find((t) => t.inductorId === ia.inductorId);
      if (tasa && volumen > 0) {
        costoOverhead += tasa.tasa * volumen * (Number(ia.pesoAsignacion) / 100);
      }
    }

    let costoMaterialesAct = 0;
    for (const mat of act.materiales) {
      if (volumen > 0) {
        costoMaterialesAct += Number(mat.costoUnitario) * volumen;
      }
    }

    costoDirectoPersonal = Math.round(costoDirectoPersonal * 100) / 100;
    costoOverhead = Math.round(costoOverhead * 100) / 100;
    costoMaterialesAct = Math.round(costoMaterialesAct * 100) / 100;
    const costoTotal = costoDirectoPersonal + costoOverhead + costoMaterialesAct;
    const costoUnitario = volumen > 0 ? costoTotal / volumen : 0;

    const result: ResultadoCosto = {
      actividadId: act.id,
      actividadNombre: act.nombre,
      categoria: act.categoria,
      costoDirectoPersonal,
      costoOverhead,
      costoMateriales: costoMaterialesAct,
      costoTotal,
      costoUnitario: Math.round(costoUnitario * 10000) / 10000,
      volumen,
    };

    resultados.push(result);
    totalDirecto += costoDirectoPersonal;
    totalOverhead += costoOverhead;
    totalMateriales += costoMaterialesAct;

    await prisma.resultadoCosteo.upsert({
      where: {
        actividadId_periodo: { actividadId: act.id, periodo },
      },
      update: {
        costoDirectoPersonal,
        costoOverhead,
        costoMateriales: costoMaterialesAct,
        costoTotal,
        costoUnitario: result.costoUnitario,
        volumen,
        calculadoEn: new Date(),
      },
      create: {
        actividadId: act.id,
        periodo,
        costoDirectoPersonal,
        costoOverhead,
        costoMateriales: costoMaterialesAct,
        costoTotal,
        costoUnitario: result.costoUnitario,
        volumen,
      },
    });
  }

  const totalCostos = totalDirecto + totalOverhead + totalMateriales;
  const totalActividades = resultados.filter((r) => r.volumen > 0).length;
  const costoPromedioUnitario = totalActividades > 0
    ? resultados.reduce((sum, r) => sum + (r.volumen > 0 ? r.costoUnitario : 0), 0) / totalActividades
    : 0;

  return {
    periodo,
    totalCostos: Math.round(totalCostos * 100) / 100,
    totalDirecto: Math.round(totalDirecto * 100) / 100,
    totalOverhead: Math.round(totalOverhead * 100) / 100,
    totalMateriales: Math.round(totalMateriales * 100) / 100,
    costoPromedioUnitario: Math.round(costoPromedioUnitario * 10000) / 10000,
    actividades: resultados,
    calculadoEn: new Date(),
  };
}
