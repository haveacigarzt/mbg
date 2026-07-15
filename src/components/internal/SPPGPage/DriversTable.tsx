import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type SortingState } from '@tanstack/react-table';
import type { Drivers, FetchDriversResponse } from '../../../types/drivers';
import { useEffect } from 'react';
import { type QueryObserverResult, type RefetchOptions } from '@tanstack/react-query';
import DialogTambahDriver from './Dialog/DialogTambahDriver';
import DialogEditDriver from './Dialog/DialogEditDriver';
import DialogHapusDriver from './Dialog/DialogHapusDriver';
import { Plus, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  data: FetchDriversResponse;
  setPageDriver: React.Dispatch<React.SetStateAction<number>>;
  searchDrivers: string;
  sortingDriver: SortingState;
  setSortingDriver: React.Dispatch<React.SetStateAction<SortingState>>;
  setSearchDrivers: React.Dispatch<React.SetStateAction<string>>;
  refetchDriver: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<FetchDriversResponse, Error>>;
  pageDriver: number;
}
const columnHelper = createColumnHelper<Drivers>();

const columns = [
  columnHelper.accessor('nama', {
    header: 'Nama',
    enableSorting: true
  }),

  columnHelper.accessor('nomor_telepon', {
    header: 'No. Telepon',
    enableSorting: true
  }),

  columnHelper.accessor('status_aktif', {
    header: 'Status',
    enableSorting: true,
    cell: ({ getValue }) => {
      return getValue() ? 'Aktif' : 'Nonaktif';
    }
  })
];

const DriversTable = ({ data, setPageDriver, searchDrivers, sortingDriver, setSortingDriver, setSearchDrivers, refetchDriver, pageDriver }: Props) => {
  const drivers = data.drivers;
  const metadata = data.metadata;
  useEffect(() => {
    setPageDriver(1);
  }, [searchDrivers]);
  const table = useReactTable({
    data: drivers,
    columns,
    state: {
      sorting: sortingDriver
    },
    onSortingChange: setSortingDriver,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel()
  });
  return (
    <div>
      {/* Header search add */}
      <div className="flex justify-between mb-5">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl
                       focus:outline-none focus:border-blue-400 transition-colors"
            value={searchDrivers}
            onChange={(e) => setSearchDrivers(e.target.value)}
            placeholder={`Cari driver...`}
          />
        </div>
        <DialogTambahDriver onDriverUpdate={refetchDriver}>
          <div className="relative inline-block">
            <Button
              className="flex items-center gap-2 
                             text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah
            </Button>
            {drivers.length === 0 && <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-500 border-2 border-background" />}
          </div>
        </DialogTambahDriver>
      </div>

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
                <td className="flex gap-2">
                  <DialogEditDriver onDriverUpdate={refetchDriver} driver={row.original}>
                    <button
                      className="text-xs font-semibold text-gray-600 bg-gray-100
                                         hover:bg-blue-300 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                  </DialogEditDriver>
                  <DialogHapusDriver onSuccess={refetchDriver} id={row.original.id} nama={row.original.nama}>
                    <button
                      className="text-xs font-semibold text-red-500 bg-red-50
                                         hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                  </DialogHapusDriver>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Paginasi */}
      <div className="flex items-center justify-between mt-5">
        <p className="text-xs text-gray-400">
          Halaman {pageDriver} dari {metadata.last_page} — <span className="font-bold text-gray-600">TOTAL {metadata.total_records} DATA</span>
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPageDriver((p) => Math.max(1, p - 1))}
            disabled={pageDriver === 1}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-500
                       hover:border-blue-300 hover:text-blue-500
                       disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: metadata.last_page }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPageDriver(p)}
              disabled={p === pageDriver}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all
                ${p === pageDriver ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-500'}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPageDriver((p) => Math.min(metadata.last_page, p + 1))}
            disabled={pageDriver === metadata.last_page}
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

export default DriversTable;
