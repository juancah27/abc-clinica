"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { actividadSchema, type ActividadFormValues } from "@/lib/validations/actividad.schema";
import { createActividad } from "@/actions/actividades";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const CATEGORIAS = [
  { value: "CLINICA_DIRECTA", label: "Clínica Directa" },
  { value: "CLINICA_APOYO", label: "Clínica Apoyo" },
  { value: "OPERATIVA", label: "Operativa" },
  { value: "ADMINISTRATIVA", label: "Administrativa" },
];

export function ActividadForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const form = useForm<ActividadFormValues>({
    resolver: zodResolver(actividadSchema),
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
      categoria: "CLINICA_DIRECTA",
      activa: true,
    },
  });

  async function onSubmit(data: ActividadFormValues) {
    setPending(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value ?? ""));
      });
      await createActividad(formData);
      toast.success("Actividad creada exitosamente");
      router.push("/actividades");
      router.refresh();
    } catch {
      toast.error("Error al crear actividad");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="codigo">Código</Label>
          <Input id="codigo" placeholder="ACT-016" {...form.register("codigo")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" {...form.register("nombre")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría</Label>
          <Select
            value={form.watch("categoria")}
            onValueChange={(v) => form.setValue("categoria", v as ActividadFormValues["categoria"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIAS.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" {...form.register("descripcion")} rows={3} />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando..." : "Crear Actividad"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
