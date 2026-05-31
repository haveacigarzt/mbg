"use client";

import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

const dataMap: Record<string, { label: string; items: { name: string; value: number; color: string }[] }> = {
  "3B": {
    label: "3B (BUMIL, BUSUI, BALITA)",
    items: [
      { name: "Ibu Hamil (Bumil)", value: 504, color: "#ec4899" },
      { name: "Ibu Menyusui (Busui)", value: 592, color: "#a855f7" },
      { name: "Balita", value: 1246, color: "#3b82f6" },
    ],
  },
  "Ps.D": {
    label: "PESERTA DIDIK (Ps.D)",
    items: [
      { name: "SD/MI", value: 8200, color: "#3b82f6" },
      { name: "SMP/MTs", value: 5100, color: "#6366f1" },
    ],
  },
  Guru: {
    label: "GURU & TENAGA PENDIDIK",
    items: [
      { name: "Guru PNS", value: 45, color: "#f97316" },
      { name: "Guru Honorer", value: 44, color: "#fb923c" },
    ],
  },
  ATS: {
    label: "ANAK TIDAK SEKOLAH (ATS)",
    items: [
      { name: "Usia 7-12 Tahun", value: 30, color: "#ef4444" },
      { name: "Usia 13-18 Tahun", value: 37, color: "#f87171" },
    ],
  },
  APS: {
    label: "ANAK PUTUS SEKOLAH (APS)",
    items: [
      { name: "Putus SD", value: 35, color: "#6b7280" },
      { name: "Putus SMP", value: 25, color: "#9ca3af" },
    ],
  },
};

const chartConfig = { data: { label: "Data" } };

export default function DonutPenerima({ selected }: { selected: string }) {
  const data = dataMap[selected];
  if (!data) return null;

  const total = data.items.reduce((sum, i) => sum + i.value, 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <p className="font-bold text-gray-700 text-sm mb-1">{data.label}</p>
      <p className="text-xs text-gray-400 tracking-widest mb-6">KATEGORI PELAYANAN GIZI ESENSIAL UNTUK 1000 HARI PERTAMA KEHIDUPAN (HPK).</p>

      <div className="flex items-center gap-10">
        {/* Donut chart */}
        <div className="relative">
          <ChartContainer config={chartConfig} className="w-48 h-48">
            <PieChart>
              <Pie data={data.items} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                {data.items.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartContainer>

          {/* Total di tengah donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-2xl font-black text-gray-800">{total.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Jiwa</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-4 flex-1">
          <p className="text-xs text-gray-400 tracking-widest font-semibold">RINCIAN SUB-KATEGORI PENERIMA MANFAAT</p>
          {data.items.map((item, i) => {
            const pct = Math.round((item.value / total) * 100);
            return (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <p className="text-xs text-gray-600">{item.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs font-bold text-gray-800">
                    {item.value.toLocaleString()} <span className="text-gray-400 font-normal">jiwa</span>
                  </p>
                  <p className="text-xs text-gray-400">{pct}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
