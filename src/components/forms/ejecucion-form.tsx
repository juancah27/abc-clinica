"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { guardarEjecuciones } from "@/actions/ejecuciones";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ActividadConEjecucion {
  id: string;
  codigo: string;
  nombre: string;
  ejecuciones: { periodo: string; volumen: number }[];
}

interface EjecucionFormProps {
  periodo: string;
  actividades: ActividadConEjecucion[];
}

export function EjecucionForm({ periodo, actividades }: EjecucionFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      await guardarEjecuciones(periodo, formData);
      toast.success("Volúmenes guardados exitosamente");
      router.refresh();
    } catch {
      toast.error("Error al guardar volúmenes");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="text-left py-3 px-4 font-medium text-slate-600">Código</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Actividad</th>
              <th className="text-right py-3 px-4 font-medium text-slate-600">Volumen</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((act) => {
              const ejecucion = act.ejecuciones[0];
              return (
                <tr key={act.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">{act.codigo}</td>
                  <td className="py-3 px-4">{act.nombre}</td>
                  <td className="py-3 px-4 text-right w-48">
                    <Input
                      name={`volumen_${act.id}`}
                      type="number"
                      step="0.01"
                      defaultValue={ejecucion ? Number(ejecucion.volumen) : ""}
                      placeholder="0"
                      className="w-32 text-right ml-auto"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando..." : `Guardar Volúmenes (${periodo})`}
        </Button>
      </div>
    </form>
  );
}
