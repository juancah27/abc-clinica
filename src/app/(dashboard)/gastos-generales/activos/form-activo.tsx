"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { activoSchema, type ActivoFormValues } from "@/lib/validations/gasto.schema";
import { createActivo } from "@/actions/gastos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface FormActivoProps {
  centrosCosto: { id: string; nombre: string }[];
}

export function FormActivo({ centrosCosto }: FormActivoProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const form = useForm<ActivoFormValues>({
    resolver: zodResolver(activoSchema),
    defaultValues: {
      centroCostoId: "",
      nombre: "",
      valorAdquisicion: 0,
      valorResidual: 0,
      vidaUtilMeses: 60,
      fechaAdquisicion: new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(data: ActivoFormValues) {
    setPending(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      await createActivo(formData);
      toast.success("Activo registrado exitosamente");
      router.refresh();
      form.reset();
    } catch {
      toast.error("Error al registrar activo");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del Activo</Label>
        <Input id="nombre" {...form.register("nombre")} />
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valorAdquisicion">Valor de Adquisición</Label>
          <Input id="valorAdquisicion" type="number" step="0.01" {...form.register("valorAdquisicion")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="valorResidual">Valor Residual</Label>
          <Input id="valorResidual" type="number" step="0.01" {...form.register("valorResidual")} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vidaUtilMeses">Vida Útil (meses)</Label>
          <Input id="vidaUtilMeses" type="number" {...form.register("vidaUtilMeses")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fechaAdquisicion">Fecha de Adquisición</Label>
          <Input id="fechaAdquisicion" type="date" {...form.register("fechaAdquisicion")} />
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Registrar Activo"}
      </Button>
    </form>
  );
}
