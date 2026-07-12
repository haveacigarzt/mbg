import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
interface SekolahItem {
  tingkat: string;
  jumlah_siswa: number;
}

interface PosyanduItem {
  jumlah_balita: number;
  jumlah_ibu_hamil: number;
}

interface Props {
  selected: string;
  sekolah: SekolahItem[];
  posyandu: PosyanduItem[];
}

const chartConfig = { data: { label: 'Data' } };

export default function DonutPenerima({ selected, sekolah, posyandu }: Props) {
  // Hitung data 3B dari posyandu
  const totalBumil = posyandu.reduce((sum, el) => sum + el.jumlah_ibu_hamil, 0);
  const totalBalita = posyandu.reduce((sum, el) => sum + el.jumlah_balita, 0);

  // Hitung data Ps.D — group per tingkat
  const groupByTingkat = sekolah.reduce(
    (acc, el) => {
      acc[el.tingkat] = (acc[el.tingkat] || 0) + el.jumlah_siswa;
      return acc;
    },
    {} as Record<string, number>
  );

  const dataMap: Record<string, { label: string; items: { name: string; value: number; color: string }[] }> = {
    '3B': {
      label: '3B (BUMIL, BUSUI, BALITA)',
      items: [
        { name: 'Ibu Hamil (Bumil)', value: totalBumil, color: '#ec4899' },
        { name: 'Ibu Menyusui (Busui)', value: 0, color: '#a855f7' },
        { name: 'Balita', value: totalBalita, color: '#3b82f6' }
      ]
    },
    'Ps.D': {
      label: 'PESERTA DIDIK (Ps.D)',
      items: Object.entries(groupByTingkat).map(([tingkat, jumlah], i) => ({
        name: tingkat,
        value: jumlah,
        color: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7'][i] ?? '#94a3b8'
      }))
    },
    Guru: {
      label: 'GURU & TENAGA PENDIDIK',
      items: [{ name: 'Data belum tersedia', value: 1, color: '#e5e7eb' }]
    },
    ATS: {
      label: 'ANAK TIDAK SEKOLAH (ATS)',
      items: [{ name: 'Data belum tersedia', value: 1, color: '#e5e7eb' }]
    },
    APS: {
      label: 'ANAK PUTUS SEKOLAH (APS)',
      items: [{ name: 'Data belum tersedia', value: 1, color: '#e5e7eb' }]
    }
  };

  const data = dataMap[selected];
  if (!data) return null;

  const total = data.items.reduce((sum, i) => sum + i.value, 0);
  const isDataTersedia = data.items[0]?.name !== 'Data belum tersedia';

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
      <p className="font-bold text-gray-700 text-sm mb-1">{data.label}</p>
      <p className="text-xs text-gray-400 tracking-widest mb-6">KATEGORI PELAYANAN GIZI ESENSIAL UNTUK 1000 HARI PERTAMA KEHIDUPAN (HPK).</p>

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
