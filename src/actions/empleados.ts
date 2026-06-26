"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { empleadoSchema } from "@/lib/validations/empleado.schema";
import { calcularCostoHora } from "@/lib/abc/calcular-costo-hora";

export async function getEmpleados() {
  return prisma.empleado.findMany({
    where: { activo: true },
    include: {
      departamento: true,
      compensacion: { include: { beneficios: true } },
      costosHora: { orderBy: { calculadoEn: "desc" }, take: 1 },
    },
    orderBy: { nombreCompleto: "asc" },
  });
}

export async function getEmpleado(id: string) {
  return prisma.empleado.findUnique({
    where: { id },
    include: {
      departamento: true,
      compensacion: { include: { beneficios: true } },
      costosHora: { orderBy: { calculadoEn: "desc" }, take: 1 },
      asignaciones: {
        include: { actividad: true },
      },
    },
  });
}

export async function getDepartamentos() {
  return prisma.departamento.findMany({ orderBy: { nombre: "asc" } });
}

export async function createEmpleado(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = empleadoSchema.parse({
    ...raw,
    activo: raw.activo === "true",
  });

  const empleado = await prisma.empleado.create({
    data: {
      codigo: parsed.codigo,
      nombreCompleto: parsed.nombreCompleto,
      rol: parsed.rol,
      departamentoId: parsed.departamentoId,
      activo: parsed.activo,
      fechaIngreso: new Date(parsed.fechaIngreso),
    },
  });

  revalidatePath("/recursos-humanos");
  return empleado;
}

export async function updateEmpleado(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = empleadoSchema.parse({
    ...raw,
    activo: raw.activo === "true",
  });

  const empleado = await prisma.empleado.update({
    where: { id },
    data: {
      codigo: parsed.codigo,
      nombreCompleto: parsed.nombreCompleto,
      rol: parsed.rol,
      departamentoId: parsed.departamentoId,
      activo: parsed.activo,
      fechaIngreso: new Date(parsed.fechaIngreso),
    },
  });

  revalidatePath("/recursos-humanos");
  return empleado;
}

export async function deleteEmpleado(id: string) {
  await prisma.empleado.update({
    where: { id },
    data: { activo: false },
  });
  revalidatePath("/recursos-humanos");
}

export async function guardarCompensacion(empleadoId: string, formData: FormData) {
  const salarioBase = Number(formData.get("salarioBase"));
  const horasSemanales = Number(formData.get("horasSemanales"));
  const semanasAnuales = Number(formData.get("semanasAnuales")) || 48;
  const porcentajeBeneficios = Number(formData.get("porcentajeBeneficios")) || 15;
  const moneda = (formData.get("moneda") as string) || "USD";
  const vigenteDesde = formData.get("vigenteDesde") as string;

  const beneficiosString = formData.get("beneficios") as string;
  const beneficios = beneficiosString ? JSON.parse(beneficiosString) : [];

  await prisma.estructuraCompensacion.upsert({
    where: { empleadoId },
    update: {
      salarioBase,
      horasSemanales,
      semanasAnuales,
      porcentajeBeneficios,
      moneda,
      vigenteDesde: new Date(vigenteDesde),
      beneficios: {
        deleteMany: {},
        create: beneficios.map((b: { nombre: string; montoAnual: number }) => ({
          nombre: b.nombre,
          montoAnual: b.montoAnual,
        })),
      },
    },
    create: {
      empleadoId,
      salarioBase,
      horasSemanales,
      semanasAnuales,
      porcentajeBeneficios,
      moneda,
      vigenteDesde: new Date(vigenteDesde),
      beneficios: {
        create: beneficios.map((b: { nombre: string; montoAnual: number }) => ({
          nombre: b.nombre,
          montoAnual: b.montoAnual,
        })),
      },
    },
  });

  await calcularCostoHora(empleadoId, "2026-06");
  revalidatePath(`/recursos-humanos/${empleadoId}`);
}
