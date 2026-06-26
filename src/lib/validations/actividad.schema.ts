import { z } from "zod";

export const actividadSchema = z.object({
  codigo: z.string().min(1, "Código requerido"),
  nombre: z.string().min(1, "Nombre requerido"),
  descripcion: z.string().optional(),
  categoria: z.enum(["CLINICA_DIRECTA", "CLINICA_APOYO", "OPERATIVA", "ADMINISTRATIVA"]),
  activa: z.boolean(),
});

export const asignacionSchema = z.object({
  actividadId: z.string(),
  empleadoId: z.string().min(1, "Empleado requerido"),
  minutosPorEjecucion: z.number().positive("Minutos deben ser positivos"),
  esPrincipal: z.boolean().default(false),
});

export type ActividadFormValues = z.output<typeof actividadSchema>;
export type AsignacionFormValues = z.output<typeof asignacionSchema>;
