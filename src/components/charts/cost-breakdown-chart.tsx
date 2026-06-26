"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataItem {
  name: string;
  Directo: number;
  Overhead: number;
  Materiales: number;
}

export function CostBreakdownChart({ data }: { data: DataItem[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        Sin datos disponibles
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Directo" stackId="a" fill="#0d9488" name="Directo" />
        <Bar dataKey="Overhead" stackId="a" fill="#f59e0b" name="Overhead" />
        <Bar dataKey="Materiales" stackId="a" fill="#3b82f6" name="Materiales" />
      </BarChart>
    </ResponsiveContainer>
  );
}
