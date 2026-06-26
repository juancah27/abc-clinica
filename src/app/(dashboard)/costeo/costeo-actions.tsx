"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { calcularCosteo } from "@/actions/costeo";
import { formatPeriodo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calculator, RefreshCw } from "lucide-react";

interface CosteoActionsProps {
  periodo: string;
  periodos: string[];
  hasResultados: boolean;
}

export function CosteoActions({ periodo, periodos, hasResultados }: CosteoActionsProps) {
  const router = useRouter();
  const [calculando, setCalculando] = useState(false);

  async function handleCalcular() {
    setCalculando(true);
    try {
      const resumen = await calcularCosteo(periodo);
      toast.success(`Costeo calculado: ${resumen.actividades.length} actividades procesadas`);
      router.refresh();
    } catch {
      toast.error("Error al calcular costeo");
    } finally {
      setCalculando(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Select
        value={periodo}
        onValueChange={(v) => { if (v) router.push(`/costeo?periodo=${v}`); }}
      >
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {periodos.map((p) => (
            <SelectItem key={p} value={p}>{formatPeriodo(p)}</SelectItem>
          ))}
          <SelectItem value="2026-06">Junio 2026</SelectItem>
          <SelectItem value="2026-07">Julio 2026</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleCalcular} disabled={calculando}>
        {calculando ? (
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Calculator className="h-4 w-4 mr-2" />
        )}
        {calculando ? "Calculando..." : "Calcular Período"}
      </Button>
    </div>
  );
}
