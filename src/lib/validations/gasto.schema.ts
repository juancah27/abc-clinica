import { z } from "zod";

export const gastoSchema = z.object({
  centroCostoId: z.string().min(1, "Centro de costo requerido"),
  tipo: z.enum(["ALQUILER", "DEPRECIACION", "SUMINISTROS", "SERVICIOS", "SEGUROS", "OTRO"]),
  concepto: z.string().min(1, "Concepto requerido"),
  monto: z.number().positive("Monto debe ser positivo"),
  frecuencia: z.enum(["MENSUAL", "TRIMESTRAL", "ANUAL"]),
  fechaInicio: z.string().min(1, "Fecha de inicio requerida"),
});

export const activoSchema = z.object({
  centroCostoId: z.string().min(1, "Centro de costo requerido"),
  nombre: z.string().min(1, "Nombre requerido"),
  valorAdquisicion: z.number().positive("Valor debe ser positivo"),
  valorResidual: z.number().min(0),
  vidaUtilMeses: z.number().int().positive("Vida útil requerida"),
  fechaAdquisicion: z.string().min(1, "Fecha requerida"),
});

export type GastoFormValues = z.output<typeof gastoSchema>;
export type ActivoFormValues = z.output<typeof activoSchema>;
