"use client";

import { useState } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

const daftarPosyandu = [
  { nama: "POSYANDU SUIBIAN TEMPLE", alamat: "JL. WEST PENINSULA, KEL. WEIFEI", penerima: 41 },
  { nama: "POSYANDU HDD", alamat: "JL. NORTH STREET, KEL. SIX STREET", penerima: 87 },
  { nama: "POSYANDU CALIDON", alamat: "JL. BIG DADDY, KEL. OUTER RING", penerima: 118 },
];

const PER_PAGE = 10;

export default function TabelPosyandu() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(daftarPosyandu.length / PER_PAGE);
  const paginated = daftarPosyandu.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header tabel */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className="bg-pink-50 rounded-lg p-2">
          <Heart className="w-4 h-4 text-pink-500" />
        </div>
        <p className="text-sm font-bold text-gray-700 tracking-wide">DAFTAR POSYANDU PENERIMA MANFAAT (3B)</p>
      </div>

      {/* Tabel */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left px-6 py-3 text-xs text-gray-400 tracking-widest font-semibold">NAMA POSYANDU</th>
            <th className="text-left px-6 py-3 text-xs text-gray-400 tracking-widest font-semibold">ALAMAT</th>
            <th className="text-right px-6 py-3 text-xs text-gray-400 tracking-widest font-semibold">PENERIMA (3B)</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((item, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-semibold text-gray-700">{item.nama}</td>
              <td className="px-6 py-4 text-xs text-gray-400">{item.alamat}</td>
              <td className="px-6 py-4 text-right">
                <span className="text-sm font-bold text-pink-500">
                  {item.penerima} <span className="text-gray-400 font-normal text-xs">Jiwa</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginasi */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Halaman {page} dari {totalPages} — <span className="font-bold text-gray-600">TOTAL {daftarPosyandu.length} DATA</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200
                       text-xs text-gray-500 hover:border-blue-300 hover:text-blue-500
                       disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-3 h-3" /> KEMBALI
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200
                       text-xs text-gray-500 hover:border-blue-300 hover:text-blue-500
                       disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            LANJUT <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
