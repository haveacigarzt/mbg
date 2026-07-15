import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, type SortingState } from '@tanstack/react-table';
import type { FetchPengirimanResponse, Pengiriman } from '../../../types/pengiriman';
import { useEffect, useState } from 'react';
import { useSuspenseQueries, useSuspenseQuery, type QueryObserverResult, type RefetchOptions } from '@tanstack/react-query';
import { getPengirimanQueryOptions } from '../../../queryOptions/pengiriman';
import DialogTambahPengiriman from './Dialog/DialogTambahPengiriman';
import { getPosyanduQueryOptions } from '@/queryOptions/posyandu';
import { getSekolahQueryOptions } from '@/queryOptions/sekolah';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatTanggalIndonesia } from '@/lib/utils';
import { queryClient } from '@/main';
import { useWebSocket } from '@/contexts/websocket-context';
import type { FetchSekolahResponse } from '@/types/sekolah';
import type { FetchPosyanduResponse } from '@/types/posyandu';

interface Props {
  sppg_id: number;
  tanggal: string;
  onTanggalChange: React.Dispatch<React.SetStateAction<string>>;
  date: Date | undefined;
  onDateChange: React.Dispatch<React.SetStateAction<Date | undefined>>;
  data: FetchPengirimanResponse;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<FetchPengirimanResponse, Error>>;
  page: number;
  sekolah: FetchSekolahResponse;
  posyandu: FetchPosyanduResponse;
}

const columnHelper = createColumnHelper<Pengiriman>();

const columns = [
  columnHelper.accessor('tujuan_nama', {
    header: 'Tujuan',
    enableSorting: true
  }),

  columnHelper.accessor('driver_nama', {
    header: 'Driver',
    enableSorting: true
  }),

  columnHelper.accessor('waktu_berangkat', {
    header: 'Waktu Berangkat',
    enableSorting: true
  }),

  columnHelper.accessor('waktu_selesai', {
    header: 'Waktu Selesai',
    enableSorting: true
  }),

  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: true,
    cell: ({ getValue }) => {
      return getValue().toUpperCase();
    }
  })
];

const PengirimanTable = ({ sppg_id, tanggal, onTanggalChange, date, onDateChange, data, setPage, sorting, setSorting, refetch, page, posyandu, sekolah }: Props) => {
  const [searchPengiriman, setSearchPengiriman] = useState('');

  const pengiriman = data.pengiriman;
  const metadata = data.metadata;
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

  function handleDateChange(selectedDate: Date | undefined) {
    if (!selectedDate) return;

    onDateChange(selectedDate);

    console.log(selectedDate.toLocaleDateString('sv-SE'));
    onTanggalChange(selectedDate.toLocaleDateString('sv-SE'));

    // misalnya fetch data
    // refetch();
  }

  const { connected, lastMessage } = useWebSocket();

  // console.log("connected: ", connected);

  useEffect(() => {
    // console.log("lastMessage: ", lastMessage);
    if (!lastMessage) return;

    if (lastMessage.type === 'pengiriman:update') {
      // queryClient.invalidateQueries({
      //   queryKey: ["pengiriman"],
      // });
      queryClient.setQueriesData(
        {
          queryKey: ['pengiriman']
        },
        (old: any) => {
          if (!old) return old;
          // console.log(lastMessage.data);

          return {
            ...old,
            pengiriman: old.pengiriman.map((el: any) =>
              el.id === lastMessage.data.pengiriman_id
                ? {
                    ...el,
                    status: lastMessage.data.status,
                    driver_nama: lastMessage.data.driver_nama,
                    waktu_berangkat: lastMessage.data.waktu_berangkat,
                    waktu_selesai: lastMessage.data.waktu_selesai
                  }
                : el
            )
          };
        }
      );
    }
  }, [lastMessage]);

  return (
    <div>
      {/* Header Search & Tambah */}
      <div className="flex justify-between mb-1">
        <div>
          <input className="border rounded-sm p-1" value={searchPengiriman} onChange={(e) => setSearchPengiriman(e.target.value)} placeholder={`Cari pengiriman...`} />
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
        <DialogTambahPengiriman onPengirimanUpdate={refetch} sekolah={sekolah.sekolah} posyandu={posyandu.posyandu}>
          <div className="relative inline-block">
            <Button
              className="flex items-center gap-2 
                             text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah
            </Button>
            {pengiriman.length === 0 && <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-500 border-2 border-background" />}
          </div>
        </DialogTambahPengiriman>
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

export default PengirimanTable;
