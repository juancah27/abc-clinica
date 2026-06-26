"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Error en el Dashboard</h2>
      <p className="text-slate-500 mb-6">Ocurrió un error al cargar los indicadores.</p>
      <Button onClick={reset}>Intentar de nuevo</Button>
    </div>
  );
}
