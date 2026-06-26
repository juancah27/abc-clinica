"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { guardarCompensacion } from "@/actions/empleados";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Prisma } from "@/generated/prisma/client";

type CompensacionWithBeneficios = Prisma.EstructuraCompensacionGetPayload<{
  include: { beneficios: true };
}>;

interface CompensacionFormProps {
  empleadoId: string;
  compensacion: CompensacionWithBeneficios | null;
  departamentos: { id: string; nombre: string }[];
}

export function CompensacionForm({ empleadoId, compensacion }: CompensacionFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      await guardarCompensacion(empleadoId, formData);
      toast.success("Compensación guardada exitosamente");
      router.refresh();
    } catch {
      toast.error("Error al guardar compensación");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salarioBase">Salario Base (mensual)</Label>
          <Input
            id="salarioBase"
            name="salarioBase"
            type="number"
            step="0.01"
            defaultValue={compensacion?.salarioBase ? Number(compensacion.salarioBase) : ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="moneda">Moneda</Label>
          <Input id="moneda" name="moneda" defaultValue={compensacion?.moneda ?? "USD"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="horasSemanales">Horas Semanales</Label>
          <Input
            id="horasSemanales"
            name="horasSemanales"
            type="number"
            step="0.5"
            defaultValue={compensacion?.horasSemanales ? Number(compensacion.horasSemanales) : 40}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="semanasAnuales">Semanas Anuales</Label>
          <Input
            id="semanasAnuales"
            name="semanasAnuales"
            type="number"
            defaultValue={compensacion?.semanasAnuales ?? 48}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="porcentajeBeneficios">% Beneficios</Label>
          <Input
            id="porcentajeBeneficios"
            name="porcentajeBeneficios"
            type="number"
            step="0.1"
            defaultValue={compensacion?.porcentajeBeneficios ? Number(compensacion.porcentajeBeneficios) : 15}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vigenteDesde">Vigente Desde</Label>
          <Input
            id="vigenteDesde"
            name="vigenteDesde"
            type="date"
            defaultValue={
              compensacion?.vigenteDesde
                ? new Date(compensacion.vigenteDesde).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0]
            }
          />
        </div>
      </div>

      <input type="hidden" name="beneficios" value={JSON.stringify(compensacion?.beneficios ?? [])} />

      <Button type="submit" disabled={pending}>
        {pending ? "Guardando..." : "Guardar Compensación"}
      </Button>
    </form>
  );
}
