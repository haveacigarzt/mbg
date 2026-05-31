"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import GrafikSebaran from "./GrafikSebaran";
import SubTab from "./SubTab";
import DonutPenerima from "./DonutPenerima";
import TabelPosyandu from "./TabelPosyandu";

export default function Penerima() {
  const [selectedKategori, setSelectedKategori] = useState("3B");
  return (
    <div className="flex flex-col gap-6">
      {/* Header statistik */}
      <div className="bg-white rounded-2xl p-6 flex items-center justify-between border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 rounded-xl p-3">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-800 tracking-wide">STATISTIK PENERIMA MANFAAT</p>
              <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full font-semibold">LIVE</span>
            </div>
            <p className="text-xs text-gray-400 tracking-widest mt-1">RINCIAN & SEBARAN TOTAL SASARAN PROGRAM MBG DI KABUPATEN NABIRE.</p>
          </div>
        </div>
        <p className="text-sm font-bold text-gray-500">TOTAL: 16,758 JIWA</p>
      </div>

      {/* Grafik */}
      <GrafikSebaran selected={selectedKategori} onSelect={setSelectedKategori} />

      {/* Sub kategori tabs */}
      <SubTab selected={selectedKategori} onSelect={setSelectedKategori} />
      {/* Pie Chart */}
      {selectedKategori && <DonutPenerima selected={selectedKategori} />}
      {/* Tabel Posyandu */}
      <TabelPosyandu />

      {/* Info kategori terpilih */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <p className="text-sm text-gray-500">
          Kategori dipilih: <span className="font-bold text-blue-600">{selectedKategori}</span>
        </p>
      </div>
    </div>
  );
}
