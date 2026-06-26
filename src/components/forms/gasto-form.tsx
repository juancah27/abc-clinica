"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { gastoSchema, type GastoFormValues } from "@/lib/validations/gasto.schema";
import { createGasto } from "@/actions/gastos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const TIPOS_GASTO = [
  { value: "ALQUILER", label: "Alquiler" },
  { value: "DEPRECIACION", label: "Depreciación" },
  { value: "SUMINISTROS", label: "Suministros" },
  { value: "SERVICIOS", label: "Servicios" },
  { value: "SEGUROS", label: "Seguros" },
  { value: "OTRO", label: "Otro" },
];

const FRECUENCIAS = [
  { value: "MENSUAL", label: "Mensual" },
  { value: "TRIMESTRAL", label: "Trimestral" },
  { value: "ANUAL", label: "Anual" },
];

interface GastoFormProps {
  centrosCosto: { id: string; nombre: string }[];
}

export function GastoForm({ centrosCosto }: GastoFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const form = useForm<GastoFormValues>({
    resolver: zodResolver(gastoSchema),
    defaultValues: {
      centroCostoId: "",
      tipo: "SUMINISTROS",
      concepto: "",
      monto: 0,
      frecuencia: "MENSUAL",
      fechaInicio: new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(data: GastoFormValues) {
    setPending(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      await createGasto(formData);
      toast.success("Gasto registrado exitosamente");
      router.push("/gastos-generales");
      router.refresh();
    } catch {
      toast.error("Error al registrar gasto");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="concepto">Concepto</Label>
          <Input id="concepto" {...form.register("concepto")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="centroCostoId">Centro de Costo</Label>
          <Select
            value={form.watch("centroCostoId")}
            onValueChange={(v) => form.setValue("centroCostoId", v as string)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {centrosCosto.map((cc) => (
                <SelectItem key={cc.id} value={cc.id}>{cc.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Gasto</Label>
          <Select
            value={form.watch("tipo")}
            onValueChange={(v) => form.setValue("tipo", v as GastoFormValues["tipo"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_GASTO.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="monto">Monto</Label>
          <Input id="monto" type="number" step="0.01" {...form.register("monto", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="frecuencia">Frecuencia</Label>
          <Select
            value={form.watch("frecuencia")}
            onValueChange={(v) => form.setValue("frecuencia", v as GastoFormValues["frecuencia"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FRECUENCIAS.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
          <Input id="fechaInicio" type="date" {...form.register("fechaInicio")} />
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando..." : "Registrar Gasto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
