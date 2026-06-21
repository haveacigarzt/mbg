import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type SortingState } from '@tanstack/react-table';
import type { Sekolah } from '../../../types/sekolah';
import { useEffect, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getSekolahQueryOptions } from '../../../queryOptions/sekolah';
import DialogEditSekolah from './Dialog/DialogEditSekolah';
import type { Distrik } from '@/types/sppg';
import DialogHapusSekolah from './Dialog/DialogHapusSekolah';
import DialogTambahSekolah from './Dialog/DialogTambahSekolah';
import { Search, Plus, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  sppg_id: number;
  kelurahan: Distrik[];
  kecamatan: string;
  kecamatan_id: number;
  kelurahan_id: number;
}

const columnHelper = createColumnHelper<Sekolah>();
const columns = [
  columnHelper.accessor('nama', { header: 'Nama', enableSorting: true }),
  columnHelper.accessor('alamat', { header: 'Alamat', enableSorting: true }),
  columnHelper.accessor('kelurahan', { header: 'Kelurahan', enableSorting: true }),
  columnHelper.accessor('jumlah_siswa', { header: 'Jumlah Siswa', enableSorting: true })
];

const SekolahTable = ({ sppg_id, kelurahan, kecamatan, kecamatan_id, kelurahan_id }: Props) => {
  const [searchSekolah, setSearchSekolah] = useState('');
  const [page, setPage] = useState(1);
  const page_size = 10;
  const [sorting, setSorting] = useState<SortingState>([]);
  const sort = sorting[0] ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` : '';

  const { data, refetch } = useSuspenseQuery(getSekolahQueryOptions({ sppg_id, page, page_size, nama: searchSekolah, sort }));
  const sekolah = data.sekolah;
  const metadata = data.metadata;

  useEffect(() => {
    setPage(1);
  }, [searchSekolah]);

  const table = useReactTable({
    data: sekolah,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Search + Tambah */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchSekolah}
            onChange={(e) => setSearchSekolah(e.target.value)}
            placeholder="Cari sekolah..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl
                       focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
        <DialogTambahSekolah onSekolahUpdate={refetch} kecamatan={kecamatan} kelurahan={kelurahan} kecamatan_id={kecamatan_id} kelurahan_id={kelurahan_id}>
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                             text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </DialogTambahSekolah>
      </div>

      {/* Tabel */}
      <div className="rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="bg-gray-50 border-b border-gray-100">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-3 text-left text-xs text-gray-400 tracking-widest font-semibold cursor-pointer hover:text-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' && <ArrowUp className="w-3 h-3" />}
                      {header.column.getIsSorted() === 'desc' && <ArrowDown className="w-3 h-3" />}
                      {!header.column.getIsSorted() && <ArrowUpDown className="w-3 h-3 opacity-30" />}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs text-gray-400 tracking-widest font-semibold">AKSI</th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors
                  ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <DialogEditSekolah sekolah={row.original} kelurahan={kelurahan} onSekolahUpdate={refetch} kecamatan={kecamatan}>
                      <button
                        className="text-xs font-semibold text-gray-600 bg-gray-100
                                         hover:bg-blue-300 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                    </DialogEditSekolah>
                    <DialogHapusSekolah onSuccess={refetch} id={row.original.id} nama={row.original.nama}>
                      <button
                        className="text-xs font-semibold text-red-500 bg-red-50
                                         hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Hapus
                      </button>
                    </DialogHapusSekolah>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginasi */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Halaman {page} dari {metadata.last_page} — <span className="font-bold text-gray-600">TOTAL {metadata.total_records} DATA</span>
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500
                       hover:border-blue-300 hover:text-blue-500
                       disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: metadata.last_page }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              disabled={p === page}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all
                ${p === page ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-500'}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(metadata.last_page, p + 1))}
            disabled={page === metadata.last_page}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500
                       hover:border-blue-300 hover:text-blue-500
                       disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SekolahTable;
