import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import type { Pengiriman } from "../../../types/pengiriman";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { formatTanggalIndonesia } from "@/lib/utils";
import DialogAntarPengiriman from "@/components/internal/DriverPage/Dialog/DialogAntarPengiriman";
import type { Metadata } from "@/types/metadata";
import { useWebSocket } from "@/contexts/websocket-context";
import { queryClient } from "@/main";

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
  columnHelper.accessor("tujuan_nama", {
    header: "Tujuan",
    enableSorting: true,
  }),

  columnHelper.accessor("created_at", {
    header: "Waktu Dibuat",
    enableSorting: true,
  }),

  columnHelper.accessor("status", {
    header: "Status",
    enableSorting: true,
    cell: ({ getValue }) => {
      return getValue().toUpperCase();
    },
  }),

  columnHelper.accessor("driver_nama", {
    header: "Driver",
    enableSorting: true,
  }),
];

const PengirimanTableDriver = ({
  pengiriman,
  setPage,
  searchPengiriman,
  sorting,
  setSorting,
  setTanggal,
  setSearchPengiriman,
  refetchAll,
  metadata,
  page,
}: Props) => {
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

  const { connected, lastMessage } = useWebSocket();
  // console.log("connected: ", connected);

  useEffect(() => {
    // console.log("lastMessage: ", lastMessage);
    if (!lastMessage) return;

    if (lastMessage.type === "pengiriman:create") {
      queryClient.invalidateQueries({
        queryKey: ["pengiriman"],
      });
    }
  }, [lastMessage]);

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
              <th>Aksi</th>
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
              <td>
                <DialogAntarPengiriman
                  refetchAll={refetchAll}
                  id={row.original.id}
                  nama={row.original.tujuan_nama}
                >
                  <Button disabled={row.original.status !== "menunggu"}>
                    Ambil
                  </Button>
                </DialogAntarPengiriman>
              </td>
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

export default PengirimanTableDriver;
