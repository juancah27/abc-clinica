"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getCentrosCosto() {
  return prisma.centroCosto.findMany({ orderBy: { nombre: "asc" } });
}

export async function getGastos() {
  return prisma.gastoGeneral.findMany({
    where: { activo: true },
    include: { centroCosto: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getActivos() {
  return prisma.activoDepreciable.findMany({
    include: {
      centroCosto: true,
      depreciaciones: { where: { periodo: "2026-06" } },
    },
    orderBy: { nombre: "asc" },
  });
}

export async function createGasto(formData: FormData) {
  const raw = Object.fromEntries(formData);
  await prisma.gastoGeneral.create({
    data: {
      centroCostoId: raw.centroCostoId as string,
      tipo: raw.tipo as any,
      concepto: raw.concepto as string,
      monto: Number(raw.monto),
      frecuencia: raw.frecuencia as any,
      fechaInicio: new Date(raw.fechaInicio as string),
      activo: true,
    },
  });
  revalidatePath("/gastos-generales");
}

export async function createActivo(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const activo = await prisma.activoDepreciable.create({
    data: {
      centroCostoId: raw.centroCostoId as string,
      nombre: raw.nombre as string,
      valorAdquisicion: Number(raw.valorAdquisicion),
      valorResidual: Number(raw.valorResidual) || 0,
      vidaUtilMeses: Number(raw.vidaUtilMeses),
      fechaAdquisicion: new Date(raw.fechaAdquisicion as string),
    },
  });

  const depreciacionMensual =
    (Number(raw.valorAdquisicion) - (Number(raw.valorResidual) || 0)) /
    Number(raw.vidaUtilMeses);

  await prisma.depreciacionMensual.create({
    data: {
      activoId: activo.id,
      periodo: "2026-06",
      monto: Math.round(depreciacionMensual * 100) / 100,
    },
  });

  revalidatePath("/gastos-generales");
}

export async function deleteGasto(id: string) {
  await prisma.gastoGeneral.update({
    where: { id },
    data: { activo: false },
  });
  revalidatePath("/gastos-generales");
}

export async function deleteActivo(id: string) {
  await prisma.activoDepreciable.delete({ where: { id } });
  revalidatePath("/gastos-generales");
}
