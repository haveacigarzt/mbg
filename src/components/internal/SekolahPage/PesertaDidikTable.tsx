import { Button } from '@/components/ui/button';
import type { Metadata } from '@/types/metadata';
import type { FetchPesertaDidikResponse, PesertaDidik } from '@/types/sekolah';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type SortingState } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

interface Props {
  pesertaDidik: PesertaDidik[];
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  metadata: Metadata;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<FetchPesertaDidikResponse, Error>>;
}

const columnHelper = createColumnHelper<PesertaDidik>();

const columns = [
  columnHelper.accessor('penduduk.nama', {
    header: 'Nama',
    enableSorting: true
  }),

  columnHelper.accessor('penduduk.jenis_kelamin', {
    header: 'JK',
    enableSorting: true
  }),

  columnHelper.accessor('penduduk.umur', {
    header: 'Umur',
    enableSorting: true
  }),

  columnHelper.accessor('peserta_didik.kelas', {
    header: 'Kelas',
    enableSorting: true
  }),

  columnHelper.accessor('peserta_didik.rombel', {
    header: 'Rombel',
    enableSorting: true
  })
];

const PesertaDidikTable = ({ pesertaDidik, sorting, setSorting, page, metadata, setPage, refetch }: Props) => {
  const table = useReactTable({
    data: pesertaDidik,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel()
  });
  return (
    <div className="p-4">
      {/* Tabel */}
      <div className="rounded-xl border-gray-500 overflow-hidden">
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
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' ↑',
                      desc: ' ↓'
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs text-gray-400 tracking-widest font-semibold">Aksi</th>
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
                <td>
                  <Link to="/sekolah/pesertadidik/$nisn" params={{ nisn: row.original.peserta_didik.nisn }} className="flex gap-2">
                    <Button variant="outline">
                      <ExternalLink />
                      Lihat
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginasi */}
      <div className="flex items-center justify-between mt-5">
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

export default PesertaDidikTable;
