import { z } from "zod";

export const beneficioSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, "El nombre es requerido"),
  montoAnual: z.coerce.number().positive("Debe ser un monto positivo"),
});

export const estructuraCompensacionSchema = z.object({
  id: z.string().optional(),
  salarioBase: z.coerce.number().positive("Salario debe ser positivo"),
  moneda: z.string().default("USD"),
  horasSemanales: z.coerce.number().positive("Horas semanales requeridas"),
  semanasAnuales: z.coerce.number().int().positive().default(48),
  porcentajeBeneficios: z.coerce.number().min(0).max(100).default(15),
  vigenteDesde: z.string().min(1, "Fecha de vigencia requerida"),
  vigenteHasta: z.string().optional(),
  beneficios: z.array(beneficioSchema).default([]),
});

export const empleadoSchema = z.object({
  id: z.string().optional(),
  codigo: z.string().min(1, "Código requerido"),
  nombreCompleto: z.string().min(1, "Nombre completo requerido"),
  rol: z.enum(["MEDICO", "ENFERMERA", "ADMINISTRATIVO", "TECNICO", "LIMPIEZA", "OTRO"]),
  departamentoId: z.string().min(1, "Departamento requerido"),
  activo: z.boolean().default(true),
  fechaIngreso: z.string().min(1, "Fecha de ingreso requerida"),
});

export type EmpleadoFormValues = z.infer<typeof empleadoSchema>;
export type CompensacionFormValues = z.infer<typeof estructuraCompensacionSchema>;
export type BeneficioFormValues = z.infer<typeof beneficioSchema>;
