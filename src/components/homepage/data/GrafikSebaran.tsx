"use client";

import { useState } from "react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { kategori: "3B", jumlah: 2342 },
  { kategori: "Ps.D", jumlah: 14200 },
  { kategori: "Guru", jumlah: 89 },
  { kategori: "ATS", jumlah: 67 },
  { kategori: "APS", jumlah: 60 },
];

const chartConfig = {
  jumlah: {
    label: "Jumlah Jiwa",
    color: "#3b82f6",
  },
};

interface Props {
  onSelect: (kategori: string) => void;
  selected: string;
}

export default function GrafikSebaran({ onSelect, selected }: Props) {
  const [active, setActive] = useState("3B");

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <p className="font-bold text-gray-700 mb-1">GRAFIK SEBARAN KATEGORI PENERIMA</p>
      <p className="text-xs text-gray-400 tracking-widest mb-6">KLIK KATEGORI UNTUK MELIHAT SUB-KATEGORI DI BAWAH INI.</p>

      <ChartContainer config={chartConfig} className="h-52 w-full">
        <BarChart data={data}>
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="kategori" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="jumlah"
            radius={[6, 6, 0, 0]}
            cursor="pointer"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={(d: any) => onSelect(d.kategori)}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.kategori === selected ? "#ec4899" : "#3b82f6"} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
