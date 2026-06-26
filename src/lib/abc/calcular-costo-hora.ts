import { prisma } from "@/lib/prisma";

export interface CostoHoraResult {
  empleadoId: string;
  periodo: string;
  costoHora: number;
  horasAnuales: number;
  costoAnualTotal: number;
}

export async function calcularCostoHora(
  empleadoId: string,
  periodo: string
): Promise<CostoHoraResult> {
  const empleado = await prisma.empleado.findUnique({
    where: { id: empleadoId },
    include: {
      compensacion: {
        include: { beneficios: true },
      },
    },
  });

  if (!empleado || !empleado.compensacion) {
    throw new Error(`Empleado ${empleadoId} no tiene compensación registrada`);
  }

  const c = empleado.compensacion;
  const horasAnuales = Number(c.horasSemanales) * c.semanasAnuales;
  const salarioAnual = Number(c.salarioBase) * 12;
  const totalBeneficios = c.beneficios.reduce(
    (sum, b) => sum + Number(b.montoAnual),
    0
  );
  const beneficioPorcentual = salarioAnual * (Number(c.porcentajeBeneficios) / 100);
  const costoAnualTotal = salarioAnual + totalBeneficios + beneficioPorcentual;
  const costoHora = costoAnualTotal / horasAnuales;

  const result: CostoHoraResult = {
    empleadoId,
    periodo,
    costoHora: Math.round(costoHora * 10000) / 10000,
    horasAnuales: Math.round(horasAnuales * 100) / 100,
    costoAnualTotal: Math.round(costoAnualTotal * 100) / 100,
  };

  await prisma.costoHoraCalculado.upsert({
    where: {
      empleadoId_periodo: { empleadoId, periodo },
    },
    update: {
      costoHora: result.costoHora,
      horasAnuales: result.horasAnuales,
      costoAnualTotal: result.costoAnualTotal,
      calculadoEn: new Date(),
    },
    create: {
      empleadoId,
      periodo,
      costoHora: result.costoHora,
      horasAnuales: result.horasAnuales,
      costoAnualTotal: result.costoAnualTotal,
    },
  });

  return result;
}

export async function recalcularCostosHora(periodo: string): Promise<CostoHoraResult[]> {
  const empleados = await prisma.empleado.findMany({
    where: { activo: true, compensacion: { isNot: null } },
  });

  const results: CostoHoraResult[] = [];
  for (const emp of empleados) {
    const result = await calcularCostoHora(emp.id, periodo);
    results.push(result);
  }
  return results;
}
