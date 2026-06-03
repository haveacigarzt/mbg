import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import type { Pengiriman } from "../../../types/pengiriman";
import { useEffect, useState } from "react";
import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import { getPengirimanQueryOptions } from "../../../queryOptions/pengiriman";
import DialogTambahPengiriman from "./Dialog/DialogTambahPengiriman";
import { getPosyanduQueryOptions } from "@/queryOptions/posyandu";
import { getSekolahQueryOptions } from "@/queryOptions/sekolah";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { formatTanggalIndonesia } from "@/lib/utils";

interface Props {
  sppg_id: number;
}

const columnHelper = createColumnHelper<Pengiriman>();

const columns = [
  columnHelper.accessor("tujuan_nama", {
    header: "Tujuan",
    enableSorting: true,
  }),

  columnHelper.accessor("driver_nama", {
    header: "Driver",
    enableSorting: true,
  }),

  columnHelper.accessor("waktu_berangkat", {
    header: "Waktu Berangkat",
    enableSorting: true,
  }),

  columnHelper.accessor("waktu_selesai", {
    header: "Waktu Selesai",
    enableSorting: true,
  }),

  columnHelper.accessor("status", {
    header: "Status",
    enableSorting: true,
    cell: ({ getValue }) => {
      return getValue().toUpperCase();
    },
  }),
];

const PengirimanTable = ({ sppg_id }: Props) => {
  const [searchPengiriman, setSearchPengiriman] = useState("");
  const [page, setPage] = useState(1);
  const page_size = 10;
  const [sorting, setSorting] = useState<SortingState>([]);
  const sort = sorting[0]
    ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
    : "";
  const [tanggal, setTanggal] = useState(
    new Date().toLocaleDateString("sv-SE"),
  );
  const { data, refetch } = useSuspenseQuery(
    getPengirimanQueryOptions({ sppg_id, page, tanggal, page_size, sort }),
  );

  const [{ data: sekolah }, { data: posyandu }] = useSuspenseQueries({
    queries: [
      getSekolahQueryOptions({ sppg_id }),
      getPosyanduQueryOptions({ sppg_id }),
    ],
  });

  const pengiriman = data.pengiriman;
  const metadata = data.metadata;
  useEffect(() => {
    setPage(1);
  }, [searchPengiriman]);
  const table = useReactTable({
    data: pengiriman,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });
  const [date, setDate] = useState<Date | undefined>(new Date());
  function handleDateChange(selectedDate: Date | undefined) {
    if (!selectedDate) return;

    setDate(selectedDate);

    console.log(selectedDate.toLocaleDateString("sv-SE"));
    setTanggal(selectedDate.toLocaleDateString("sv-SE"));

    // misalnya fetch data
    // refetch();
  }
  return (
    <div>
      <div className="flex justify-between mb-1">
        <div>
          <input
            className="border rounded-sm p-1"
            value={searchPengiriman}
            onChange={(e) => setSearchPengiriman(e.target.value)}
            placeholder={`Cari pengiriman...`}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!date}
                className="w-53 justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
              >
                {date ? formatTanggalIndonesia(date) : <span>Pick a date</span>}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                defaultMonth={date}
              />
            </PopoverContent>
          </Popover>
        </div>
        <DialogTambahPengiriman
          onPengirimanUpdate={refetch}
          sekolah={sekolah.sekolah}
          posyandu={posyandu.posyandu}
        >
          <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded me-1">
            Tambah
          </button>
        </DialogTambahPengiriman>
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {{
                    asc: " ↑",
                    desc: " ↓",
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
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-3 justify-center py-2">
        {Array.from({ length: metadata.last_page }, (_, i) => i + 1).map(
          (p) => (
            <button
              className={`border px-2 ${p === page ? "opacity-60" : "cursor-pointer"}`}
              key={p}
              onClick={() => setPage(p)}
              disabled={p === page}
            >
              {p}
            </button>
          ),
        )}
      </div>
    </div>
  );
};

export default PengirimanTable;
