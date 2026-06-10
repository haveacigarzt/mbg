"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface SekolahItem {
  tingkat: string;
  jumlah_siswa: number;
}

interface PosyanduItem {
  jumlah_balita: number;
  jumlah_ibu_hamil: number;
}

interface Props {
  onSelect: (kategori: string) => void;
  selected: string;
  sekolah: SekolahItem[];
  posyandu: PosyanduItem[];
}

const chartConfig = {
  jumlah: {
    label: "Jumlah Jiwa",
    color: "#3b82f6",
  },
};

export default function GrafikSebaran({ onSelect, selected, sekolah, posyandu }: Props) {
  const totalBalita = posyandu.reduce((sum, el) => sum + el.jumlah_balita + el.jumlah_ibu_hamil, 0);
  const totalPesertaDidik = sekolah.reduce((sum, el) => sum + el.jumlah_siswa, 0);

  const data = [
    { kategori: "3B", jumlah: totalBalita },
    { kategori: "Ps.D", jumlah: totalPesertaDidik },
    { kategori: "Guru", jumlah: 0 },
    { kategori: "ATS", jumlah: 0 },
    { kategori: "APS", jumlah: 0 },
  ];

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
