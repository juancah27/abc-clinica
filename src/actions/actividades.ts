"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getActividades() {
  return prisma.actividad.findMany({
    where: { activa: true },
    include: {
      _count: { select: { asignaciones: true, inductores: true } },
      resultados: { orderBy: { calculadoEn: "desc" }, take: 1 },
    },
    orderBy: { codigo: "asc" },
  });
}

export async function getActividad(id: string) {
  return prisma.actividad.findUnique({
    where: { id },
    include: {
      asignaciones: {
        include: {
          empleado: { include: { costosHora: { orderBy: { calculadoEn: "desc" }, take: 1 } } },
        },
      },
      inductores: {
        include: { inductor: true, centroCosto: true },
      },
      materiales: true,
      resultados: { orderBy: { calculadoEn: "desc" }, take: 1 },
    },
  });
}

export async function getEmpleadosParaAsignacion() {
  return prisma.empleado.findMany({
    where: { activo: true },
    include: {
      costosHora: { orderBy: { calculadoEn: "desc" }, take: 1 },
    },
    orderBy: { nombreCompleto: "asc" },
  });
}

export async function toggleActividad(id: string) {
  const act = await prisma.actividad.findUnique({ where: { id } });
  if (!act) return;
  await prisma.actividad.update({
    where: { id },
    data: { activa: !act.activa },
  });
  revalidatePath("/actividades");
}

export async function createActividad(formData: FormData) {
  const raw = Object.fromEntries(formData);
  await prisma.actividad.create({
    data: {
      codigo: raw.codigo as string,
      nombre: raw.nombre as string,
      descripcion: (raw.descripcion as string) || null,
      categoria: raw.categoria as any,
      activa: true,
    },
  });
  revalidatePath("/actividades");
}

export async function updateActividad(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData);
  await prisma.actividad.update({
    where: { id },
    data: {
      codigo: raw.codigo as string,
      nombre: raw.nombre as string,
      descripcion: (raw.descripcion as string) || null,
      categoria: raw.categoria as any,
    },
  });
  revalidatePath("/actividades");
}

export async function deleteActividad(id: string) {
  await prisma.actividad.update({
    where: { id },
    data: { activa: false },
  });
  revalidatePath("/actividades");
}
