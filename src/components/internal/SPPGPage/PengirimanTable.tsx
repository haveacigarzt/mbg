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
import { ChevronDownIcon, Plus } from 'lucide-react';
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
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                             text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </DialogTambahPengiriman>
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()} className="cursor-pointer">
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-3 justify-center py-2">
        {Array.from({ length: metadata.last_page }, (_, i) => i + 1).map((p) => (
          <button className={`border px-2 ${p === page ? 'opacity-60' : 'cursor-pointer'}`} key={p} onClick={() => setPage(p)} disabled={p === page}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PengirimanTable;
