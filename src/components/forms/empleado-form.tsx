"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { empleadoSchema, type EmpleadoFormValues } from "@/lib/validations/empleado.schema";
import { createEmpleado } from "@/actions/empleados";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const ROLES = [
  { value: "MEDICO", label: "Médico" },
  { value: "ENFERMERA", label: "Enfermera" },
  { value: "ADMINISTRATIVO", label: "Administrativo" },
  { value: "TECNICO", label: "Técnico" },
  { value: "LIMPIEZA", label: "Limpieza" },
  { value: "OTRO", label: "Otro" },
];

interface EmpleadoFormProps {
  departamentos: { id: string; nombre: string }[];
}

export function EmpleadoForm({ departamentos }: EmpleadoFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const form = useForm<EmpleadoFormValues>({
    resolver: zodResolver(empleadoSchema),
    defaultValues: {
      codigo: "",
      nombreCompleto: "",
      rol: "MEDICO",
      departamentoId: "",
      activo: true,
      fechaIngreso: new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(data: EmpleadoFormValues) {
    setPending(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      await createEmpleado(formData);
      toast.success("Empleado creado exitosamente");
      router.push("/recursos-humanos");
      router.refresh();
    } catch {
      toast.error("Error al crear empleado");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="codigo">Código</Label>
          <Input id="codigo" {...form.register("codigo")} />
          {form.formState.errors.codigo && (
            <p className="text-sm text-red-500">{form.formState.errors.codigo.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="nombreCompleto">Nombre Completo</Label>
          <Input id="nombreCompleto" {...form.register("nombreCompleto")} />
          {form.formState.errors.nombreCompleto && (
            <p className="text-sm text-red-500">{form.formState.errors.nombreCompleto.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="rol">Rol</Label>
          <Select
            value={form.watch("rol")}
            onValueChange={(v) => form.setValue("rol", v as EmpleadoFormValues["rol"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="departamentoId">Departamento</Label>
          <Select
            value={form.watch("departamentoId")}
            onValueChange={(v) => form.setValue("departamentoId", v as string)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {departamentos.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.departamentoId && (
            <p className="text-sm text-red-500">{form.formState.errors.departamentoId.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
          <Input id="fechaIngreso" type="date" {...form.register("fechaIngreso")} />
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando..." : "Guardar Empleado"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
