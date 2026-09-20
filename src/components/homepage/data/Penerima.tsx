'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import GrafikSebaran from './GrafikSebaran';
import SubTab from './SubTab';
import DonutPenerima from './DonutPenerima';
import TabelPenerima from './TabelPenerima';
import type { SummaryPenerimaManfaatInner } from '@/types/summary';
import type { FetchSekolahResponse } from '@/types/sekolah';
import type { FetchPosyanduResponse } from '@/types/posyandu';

interface Props {
  summaryPenerimaManfaat: SummaryPenerimaManfaatInner;
  sekolah: FetchSekolahResponse;
  posyandu: FetchPosyanduResponse;
}

const Penerima = ({ summaryPenerimaManfaat, sekolah, posyandu }: Props) => {
  const [selectedKategori, setSelectedKategori] = useState('3B');

  const chartColors = [
    ['#3B82F6', '#3B82F620'], // Biru
    ['#10B981', '#10B98120'], // Hijau
    ['#F59E0B', '#F59E0B30'], // Amber — sedikit lebih terlihat
    ['#EF4444', '#EF444420'] // Merah
  ];
  // console.log(sekolah);
  // console.log(posyandu);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header statistik */}
      <div className="bg-white rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border border-gray-100">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-blue-50 rounded-xl p-2.5 md:p-3 shrink-0">
            <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold text-gray-800 tracking-wide text-sm md:text-base">STATISTIK PENERIMA MANFAAT</p>
              <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-semibold">LIVE</span>
            </div>
            <p className="text-xs text-gray-400 tracking-widest mt-1">RINCIAN & SEBARAN TOTAL SASARAN PROGRAM MBG DI KABUPATEN NEW ERIDU.</p>
          </div>
        </div>
        <p className="text-sm font-bold text-gray-500 sm:text-right shrink-0">TOTAL: {summaryPenerimaManfaat.total_penerima_manfaat.toLocaleString('id-ID')} JIWA</p>
      </div>

      {/* Grafik */}
      <GrafikSebaran selected={selectedKategori} onSelect={setSelectedKategori} summaryPenerimaManfaat={summaryPenerimaManfaat} />

      {/* Sub kategori tabs */}
      <SubTab selected={selectedKategori} onSelect={setSelectedKategori} />
      {/* Pie Chart */}
      <DonutPenerima selected={selectedKategori} summaryPenerimaManfaat={summaryPenerimaManfaat} chartColors={chartColors} />
      {/* Tabel Posyandu */}
      <TabelPenerima key={selectedKategori} selected={selectedKategori} posyandu={posyandu.posyandu} sekolah={sekolah.sekolah} chartColors={chartColors} />

      {/* Info kategori terpilih */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <p className="text-sm text-gray-500">
          Kategori dipilih: <span className="font-bold text-blue-600">{selectedKategori}</span>
        </p>
      </div>
    </div>
  );
};

export default Penerima;
