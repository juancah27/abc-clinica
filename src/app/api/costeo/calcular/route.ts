import { NextRequest, NextResponse } from "next/server";
import { ejecutarCosteo } from "@/lib/abc/asignar-costos";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const periodo = body.periodo || "2026-06";
    const resumen = await ejecutarCosteo(periodo);
    return NextResponse.json(resumen);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
