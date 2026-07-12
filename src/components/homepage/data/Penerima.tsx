'use client';

import { useState } from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { getSekolahQueryOptions } from '../../../queryOptions/sekolah';
import { getPosyanduQueryOptions } from '../../../queryOptions/posyandu';
import { Users } from 'lucide-react';
import GrafikSebaran from './GrafikSebaran';
import SubTab from './SubTab';
import DonutPenerima from './DonutPenerima';
import TabelPenerima from './TabelPenerima';

export default function Penerima() {
  const [selectedKategori, setSelectedKategori] = useState('3B');

  const [{ data: sekolah }, { data: posyandu }] = useSuspenseQueries({
    queries: [getSekolahQueryOptions(), getPosyanduQueryOptions()]
  });

  const totalSasaran = sekolah.sekolah.reduce((sum, el) => sum + el.jumlah_siswa, 0);
  const totalIbuBalita = posyandu.posyandu.reduce((sum, el) => sum + el.jumlah_balita + el.jumlah_ibu_hamil, 0);

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
        <p className="text-sm font-bold text-gray-500 sm:text-right shrink-0">TOTAL: {totalSasaran.toLocaleString('id-ID')} JIWA</p>
      </div>

      {/* Grafik */}
      <GrafikSebaran selected={selectedKategori} onSelect={setSelectedKategori} sekolah={sekolah.sekolah} posyandu={posyandu.posyandu} />

      {/* Sub kategori tabs */}
      <SubTab selected={selectedKategori} onSelect={setSelectedKategori} />
      {/* Pie Chart */}
      <DonutPenerima selected={selectedKategori} sekolah={sekolah.sekolah} posyandu={posyandu.posyandu} />
      {/* Tabel Posyandu */}
      <TabelPenerima key={selectedKategori} selected={selectedKategori} posyandu={posyandu.posyandu} sekolah={sekolah.sekolah} />

      {/* Info kategori terpilih */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <p className="text-sm text-gray-500">
          Kategori dipilih: <span className="font-bold text-blue-600">{selectedKategori}</span>
        </p>
      </div>
    </div>
  );
}
