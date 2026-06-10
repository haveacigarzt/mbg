"use client";

import { useState } from "react";
import { Heart, School, ChevronLeft, ChevronRight, Ban } from "lucide-react";

interface PosyanduItem {
  nama: string;
  alamat: string;
  jumlah_balita: number;
  jumlah_ibu_hamil: number;
}

interface SekolahItem {
  nama: string;
  alamat: string;
  tingkat: string;
  jumlah_siswa: number;
  kecamatan: string;
}

interface Props {
  selected: string;
  posyandu: PosyanduItem[];
  sekolah: SekolahItem[];
}

const PER_PAGE = 10;

export default function TabelPenerima({ selected, posyandu, sekolah }: Props) {
  const [page, setPage] = useState(1);
  const handlePageReset = () => setPage(1);
  // Config per kategori
  const config: Record<
    string,
    {
      icon: React.ReactNode;
      iconBg: string;
      title: string;
      columns: string[];
      rows: React.ReactNode[][];
      total: number;
    }
  > = {
    "3B": {
      icon: <Heart className="w-4 h-4 text-pink-500" />,
      iconBg: "bg-pink-50",
      title: "DAFTAR POSYANDU PENERIMA MANFAAT (3B)",
      columns: ["NAMA POSYANDU", "ALAMAT", "BALITA", "IBU HAMIL"],
      rows: posyandu.map((el) => [
        <span className="text-sm font-semibold text-gray-700">{el.nama}</span>,
        <span className="text-xs text-gray-400">{el.alamat}</span>,
        <span className="text-sm font-bold text-blue-500">
          {el.jumlah_balita} <span className="text-gray-400 font-normal text-xs">jiwa</span>
        </span>,
        <span className="text-sm font-bold text-pink-500">
          {el.jumlah_ibu_hamil} <span className="text-gray-400 font-normal text-xs">jiwa</span>
        </span>,
      ]),
      total: posyandu.length,
    },
    "Ps.D": {
      icon: <School className="w-4 h-4 text-blue-500" />,
      iconBg: "bg-blue-50",
      title: "DAFTAR SEKOLAH PENERIMA MANFAAT",
      columns: ["NAMA SEKOLAH", "ALAMAT", "TINGKAT", "JUMLAH SISWA"],
      rows: sekolah.map((el) => [
        <span className="text-sm font-semibold text-gray-700">{el.nama}</span>,
        <span className="text-xs text-gray-400">{el.alamat}</span>,
        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">{el.tingkat}</span>,
        <span className="text-sm font-bold text-blue-500">
          {el.jumlah_siswa.toLocaleString("id-ID")} <span className="text-gray-400 font-normal text-xs">siswa</span>
        </span>,
      ]),
      total: sekolah.length,
    },
  };

  const current = config[selected];

  // Kalau kategori belum ada datanya
  if (!current) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-300">
          <Ban className="w-8 h-8" />
          <p className="text-sm">Data untuk kategori ini belum tersedia.</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(current.rows.length / PER_PAGE);
  const paginated = current.rows.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className={`${current.iconBg} rounded-lg p-2`}>{current.icon}</div>
        <p className="text-sm font-bold text-gray-700 tracking-wide">{current.title}</p>
      </div>

      {/* Tabel */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {current.columns.map((col, i) => (
              <th key={i} className={`px-6 py-3 text-xs text-gray-400 tracking-widest font-semibold ${i === current.columns.length - 1 ? "text-right" : "text-left"}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className={`px-6 py-4 ${j === row.length - 1 ? "text-right" : "text-left"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginasi */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Halaman {page} dari {totalPages || 1} — <span className="font-bold text-gray-600">TOTAL {current.total} DATA</span>
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
            disabled={page === totalPages || totalPages === 0}
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
