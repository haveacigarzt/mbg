'use client';

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

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
    label: 'Jumlah Jiwa',
    color: '#3b82f6'
  }
};

export default function GrafikSebaran({ onSelect, selected, sekolah, posyandu }: Props) {
  const totalBalita = posyandu.reduce((sum, el) => sum + el.jumlah_balita + el.jumlah_ibu_hamil, 0);
  const totalPesertaDidik = sekolah.reduce((sum, el) => sum + el.jumlah_siswa, 0);

  const data = [
    { kategori: '3B', jumlah: totalBalita },
    { kategori: 'Ps.D', jumlah: totalPesertaDidik },
    { kategori: 'Guru', jumlah: 0 },
    { kategori: 'ATS', jumlah: 0 },
    { kategori: 'APS', jumlah: 0 }
  ];

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
      <p className="font-bold text-gray-700 mb-1 text-sm md:text-base">GRAFIK SEBARAN KATEGORI PENERIMA</p>
      <p className="text-xs text-gray-400 tracking-widest mb-4 md:mb-6">KLIK KATEGORI UNTUK MELIHAT SUB-KATEGORI DI BAWAH INI.</p>

      {/* Dibungkus scroll horizontal biar 5 bar tetap kebaca di layar sempit, bukan keremas */}
      <div className="overflow-x-auto -mx-1 px-1">
        <ChartContainer config={chartConfig} className="h-44 sm:h-52 w-full min-w-[380px] sm:min-w-0">
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="kategori" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="jumlah"
              radius={[6, 6, 0, 0]}
              cursor="pointer"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={(d: any) => onSelect(d.kategori)}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.kategori === selected ? '#ec4899' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
