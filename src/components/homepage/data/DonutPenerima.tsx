import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import type { SummaryPenerimaManfaatInner } from '@/types/summary';

interface Props {
  selected: string;
  summaryPenerimaManfaat: SummaryPenerimaManfaatInner;
  chartColors: string[][];
}

const chartConfig = { data: { label: 'Data' } };

export default function DonutPenerima({ selected, summaryPenerimaManfaat, chartColors }: Props) {
  // Hitung data 3B dari posyandu
  const totalBumil = summaryPenerimaManfaat.bumil;
  const totalBalita = summaryPenerimaManfaat.balita;
  const totalBusui = summaryPenerimaManfaat.busui;

  const totalTKPaud = summaryPenerimaManfaat.tk_paud;
  const totalSDMI = summaryPenerimaManfaat.sd_mi;
  const totalSMPMTS = summaryPenerimaManfaat.smp_mts;
  const totalSMASMKMA = summaryPenerimaManfaat.sma_smk_ma;

  const dataMap: Record<string, { label: string; items: { name: string; value: number; color: string }[]; subtitle: string }> = {
    '3B': {
      label: '3B (BUMIL, BUSUI, BALITA)',
      items: [
        { name: 'Ibu Hamil (BUMIL)', value: totalBumil, color: chartColors[0][0] },
        { name: 'Ibu Menyusui (BUSUI)', value: totalBusui, color: chartColors[1][0] },
        { name: 'Bawah Lima Tahun (BALITA)', value: totalBalita, color: chartColors[2][0] }
      ],
      subtitle: 'KATEGORI PELAYANAN GIZI ESENSIAL UNTUK 1000 HARI PERTAMA KEHIDUPAN (HPK).'
    },
    'Ps.D': {
      label: 'PESERTA DIDIK (Ps.D)',
      items: [
        { name: 'TK/PAUD', value: totalTKPaud, color: chartColors[0][0] },
        { name: 'SD/MI', value: totalSDMI, color: chartColors[1][0] },
        { name: 'SMP/MTs', value: totalSMPMTS, color: chartColors[2][0] },
        { name: 'SMA/SMK/MA', value: totalSMASMKMA, color: chartColors[3][0] }
      ],
      subtitle: 'KATEGORI PELAYANAN GIZI ESENSIAL UNTUK MENDUKUNG TUMBUH KEMBANG DAN PRESTASI BELAJAR.'
    },
    Guru: {
      label: 'GURU & TENAGA PENDIDIK',
      items: [{ name: 'Data belum tersedia', value: 1, color: '#e5e7eb' }],
      subtitle: 'KATEGORI PELAYANAN GIZI ESENSIAL UNTUK MENDUKUNG KESEHATAN DAN PRODUKTIVITAS PENDIDIK.'
    },
    ATS: {
      label: 'ANAK TIDAK SEKOLAH (ATS)',
      items: [{ name: 'Data belum tersedia', value: 1, color: '#e5e7eb' }],
      subtitle: 'KATEGORI PELAYANAN GIZI ESENSIAL UNTUK MENDUKUNG TUMBUH KEMBANG ANAK USIA SEKOLAH.'
    },
    APS: {
      label: 'ANAK PUTUS SEKOLAH (APS)',
      items: [{ name: 'Data belum tersedia', value: 1, color: '#e5e7eb' }],
      subtitle: 'KATEGORI PELAYANAN GIZI ESENSIAL UNTUK MENDUKUNG PEMULIHAN DAN TUMBUH KEMBANG ANAK USIA SEKOLAH.'
    }
  };

  const data = dataMap[selected];
  if (!data) return null;

  const total = data.items.reduce((sum, i) => sum + i.value, 0);
  // const isDataTersedia = data.items[0]?.name !== 'Data belum tersedia';

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
      <p className="font-bold text-gray-700 text-sm mb-1">{data.label}</p>
      <p className="text-xs text-gray-400 tracking-widest mb-6">{data.subtitle}</p>

      {/* Stack ke bawah di mobile, sejajar mulai md */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
        {/* Donut chart */}
        <div className="relative shrink-0">
          <ChartContainer config={chartConfig} className="w-40 h-40 sm:w-48 sm:h-48">
            <PieChart>
              <Pie data={data.items} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                {data.items.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartContainer>

          {/* Total di tengah donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-xl sm:text-2xl font-black text-gray-800">{total.toLocaleString('id-ID')}</p>
            <p className="text-xs text-gray-400">Jiwa</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 md:gap-4 flex-1 w-full">
          <p className="text-xs text-gray-400 tracking-widest font-semibold">RINCIAN SUB-KATEGORI PENERIMA MANFAAT</p>
          {data.items.map((item, i) => {
            const pct = Math.round((item.value / total) * 100);
            return (
              <div key={i} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                  <p className="text-xs text-gray-600 truncate">{item.name}</p>
                </div>
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                  <p className="text-xs font-bold text-gray-800 whitespace-nowrap">
                    {item.value.toLocaleString('id-ID')} <span className="text-gray-400 font-normal">jiwa</span>
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
