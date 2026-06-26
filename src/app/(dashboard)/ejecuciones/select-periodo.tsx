"use client";

import { useRouter } from "next/navigation";
import { formatPeriodo } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SelectPeriodoProps {
  periodos: string[];
  selected: string;
}

export function SelectPeriodo({ periodos, selected }: SelectPeriodoProps) {
  const router = useRouter();

  function handleChange(value: string | null) {
    if (value) router.push(`/ejecuciones?periodo=${value}`);
  }

  return (
    <Select value={selected} onValueChange={handleChange}>
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {periodos.map((p) => (
          <SelectItem key={p} value={p}>{formatPeriodo(p)}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
