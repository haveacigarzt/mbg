import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type SortingState } from '@tanstack/react-table';
import type { Pengiriman } from '../../../types/pengiriman';
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { formatTanggalIndonesia } from '@/lib/utils';
import DialogAntarPengiriman from '@/components/internal/DriverPage/Dialog/DialogAntarPengiriman';
import type { Metadata } from '@/types/metadata';
import { useWebSocket } from '@/contexts/websocket-context';
import { queryClient } from '@/main';

interface Props {
  pengiriman: Pengiriman[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  searchPengiriman: string;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  setTanggal: React.Dispatch<React.SetStateAction<string>>;
  setSearchPengiriman: React.Dispatch<React.SetStateAction<string>>;
  refetchAll: () => void;
  metadata: Metadata;
  page: number;
}

const columnHelper = createColumnHelper<Pengiriman>();

const columns = [
  columnHelper.accessor('tujuan_nama', {
    header: 'Tujuan',
    enableSorting: true
  }),

  columnHelper.accessor('created_at', {
    header: 'Waktu Dibuat',
    enableSorting: true
  }),

  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: true,
    cell: ({ getValue }) => {
      return getValue().toUpperCase();
    }
  }),

  columnHelper.accessor('driver_nama', {
    header: 'Driver',
    enableSorting: true
  })
];

const PengirimanTableDriver = ({ pengiriman, setPage, searchPengiriman, sorting, setSorting, setTanggal, setSearchPengiriman, refetchAll, metadata, page }: Props) => {
  useEffect(() => {
    setPage(1);
  }, [searchPengiriman]);
  const table = useReactTable({
    data: pengiriman,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel()
  });
  const [date, setDate] = useState<Date | undefined>(new Date());
  function handleDateChange(selectedDate: Date | undefined) {
    if (!selectedDate) return;

    setDate(selectedDate);

    console.log(selectedDate.toLocaleDateString('sv-SE'));
    setTanggal(selectedDate.toLocaleDateString('sv-SE'));

    // misalnya fetch data
    // refetch();
  }

  const { connected, lastMessage } = useWebSocket();
  // console.log("connected: ", connected);

  useEffect(() => {
    // console.log("lastMessage: ", lastMessage);
    if (!lastMessage) return;

    if (lastMessage.type === 'pengiriman:create') {
      queryClient.invalidateQueries({
        queryKey: ['pengiriman']
      });
    }
  }, [lastMessage]);

  return (
    <div>
      <div className="flex justify-between mb-1">
        <div>
          <input
            className="w-[50%] pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl
                       focus:outline-none focus:border-blue-400 transition-colors"
            value={searchPengiriman}
            onChange={(e) => setSearchPengiriman(e.target.value)}
            placeholder={`Cari pengiriman...`}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" data-empty={!date} className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground">
                {date ? formatTanggalIndonesia(date) : <span>Pick a date</span>}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={handleDateChange} defaultMonth={date} />
            </PopoverContent>
          </Popover>
        </div>
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
                <td>
                  <DialogAntarPengiriman refetchAll={refetchAll} id={row.original.id} nama={row.original.tujuan_nama}>
                    <Button disabled={row.original.status !== 'menunggu'}>Ambil</Button>
                  </DialogAntarPengiriman>
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

export default PengirimanTableDriver;
