"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getEjecuciones(periodo: string) {
  return prisma.ejecucionActividad.findMany({
    where: { periodo },
    include: {
      actividad: true,
    },
    orderBy: { actividad: { codigo: "asc" } },
  });
}

export async function getActividadesConEjecuciones(periodo: string) {
  const actividades = await prisma.actividad.findMany({
    where: { activa: true },
    include: {
      ejecuciones: { where: { periodo } },
    },
    orderBy: { codigo: "asc" },
  });

  return actividades.map((a) => ({
    ...a,
    ejecuciones: a.ejecuciones.map((e) => ({
      periodo: e.periodo,
      volumen: Number(e.volumen),
    })),
  }));
}

export async function guardarEjecuciones(periodo: string, formData: FormData) {
  const entries = Array.from(formData.entries());

  for (const [key, value] of entries) {
    if (!key.startsWith("volumen_")) continue;
    const actividadId = key.replace("volumen_", "");
    const volumen = Number(value);
    if (volumen <= 0) continue;

    await prisma.ejecucionActividad.upsert({
      where: {
        actividadId_periodo: { actividadId, periodo },
      },
      update: { volumen, registradoEn: new Date() },
      create: {
        actividadId,
        periodo,
        volumen,
      },
    });
  }

  revalidatePath("/ejecuciones");
}

export async function getPeriodosDisponibles() {
  const results = await prisma.ejecucionActividad.findMany({
    select: { periodo: true },
    distinct: ["periodo"],
    orderBy: { periodo: "desc" },
  });
  const periodos = results.map((r) => r.periodo);
  if (!periodos.includes("2026-06")) periodos.push("2026-06");
  if (!periodos.includes("2026-07")) periodos.push("2026-07");
  return periodos.sort().reverse();
}
