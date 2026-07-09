import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useQuery } from '@tanstack/react-query';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type SortingState } from '@tanstack/react-table';
import { getPedagangLokalQueryOptions } from '@/queryOptions/pedaganglokal';
import type { PedagangLokalType } from '@/types/pedaganglokal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  role_id: number;
}

const columnHelper = createColumnHelper<PedagangLokalType>();

const columns = [
  columnHelper.accessor('nama', {
    header: 'Nama',
    enableSorting: true
  }),

  columnHelper.accessor('alamat', {
    header: 'Alamat',
    enableSorting: true
  }),

  columnHelper.accessor('no_hp', {
    header: 'No. HP',
    enableSorting: false
  }),

  columnHelper.accessor('jenis_produk', {
    header: 'Jenis Produk',
    enableSorting: true
  }),

  columnHelper.accessor('sppg_id', {
    header: 'SPPG',
    enableSorting: true
  })
];

const PedagangLokal = ({ role_id }: Props) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const page_size = 10;
  const [sorting, setSorting] = useState<SortingState>([]);
  const sort = sorting[0] ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` : '';

  const { data, refetch } = useQuery(
    getPedagangLokalQueryOptions({
      page,
      page_size,
      nama: search,
      sort
    })
  );
  const pedagangLokal = data?.pedagang_lokal;
  const metadata = data?.metadata;
  useEffect(() => {
    setPage(1);
  }, [search]);
  const table = useReactTable({
    data: pedagangLokal ?? [],
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel()
  });
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar role_id={role_id} />

      <div className="ml-[15%] flex-1 p-6 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-black text-gray-800">Data Pedagang Lokal</h1>
          <p className="text-xs text-gray-400 tracking-widest mt-1">KELOLA DATA PEDAGANG LOKAL SEBAGAI MITRA PENYEDIA PRODUK PROGRAM MBG</p>
        </div>
        {/* Tabel */}
        <div className="overflow-hidden rounded-xl border-gray-500 mt-5">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Paginasi */}
        <div className="flex items-center justify-between mt-5">
          <p className="text-xs text-gray-400">
            Halaman {page} dari {metadata?.last_page} — <span className="font-bold text-gray-600">TOTAL {metadata?.total_records} DATA</span>
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
            {Array.from({ length: metadata?.last_page || 0 }, (_, i) => i + 1).map((p) => (
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
              onClick={() => setPage((p) => Math.min(metadata?.last_page || 0, p + 1))}
              disabled={page === metadata?.last_page}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500
                       hover:border-blue-300 hover:text-blue-500
                       disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedagangLokal;
