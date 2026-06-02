import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import type { Drivers } from "../../../types/drivers";
import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getDriversQueryOptions } from "../../../queryOptions/drivers";
import DialogTambahDriver from "./Dialog/DialogTambahDriver";
import DialogEditDriver from "./Dialog/DialogEditDriver";

interface Props {
  sppg_id: number;
}
const columnHelper = createColumnHelper<Drivers>();

const columns = [
  columnHelper.accessor("nama", {
    header: "Nama",
    enableSorting: true,
  }),

  columnHelper.accessor("nomor_telepon", {
    header: "No. Telepon",
    enableSorting: true,
  }),

  columnHelper.accessor("status_aktif", {
    header: "Status",
    enableSorting: true,
    cell: ({ getValue }) => {
      return getValue() ? "Aktif" : "Nonaktif";
    },
  }),
];
const DriversTable = ({ sppg_id }: Props) => {
  const [searchDrivers, setSearchDrivers] = useState("");
  const [page, setPage] = useState(1);
  const page_size = 10;
  const [sorting, setSorting] = useState<SortingState>([]);
  const sort = sorting[0]
    ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
    : "";

  const { data, refetch } = useSuspenseQuery(
    getDriversQueryOptions({
      sppg_id,
      page,
      page_size,
      nama: searchDrivers,
      sort,
    }),
  );
  const drivers = data.drivers;
  const metadata = data.metadata;
  useEffect(() => {
    setPage(1);
  }, [searchDrivers]);
  const table = useReactTable({
    data: drivers,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div>
      <div className="flex justify-between mb-1">
        <input
          className="border rounded-sm p-1"
          value={searchDrivers}
          onChange={(e) => setSearchDrivers(e.target.value)}
          placeholder={`Cari driver...`}
        />
        <DialogTambahDriver onDriverUpdate={refetch}>
          <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded me-1">
            Tambah
          </button>
        </DialogTambahDriver>
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
              <td className="flex gap-2">
                <DialogEditDriver
                  onDriverUpdate={refetch}
                  driver={row.original}
                >
                  <button className="bg-gray-500 hover:bg-gray-600 text-white py-0.5 px-5 rounded me-1">
                    Edit
                  </button>
                </DialogEditDriver>
                {/* <DialogHapusDriver
                  onSuccess={refetch}
                  id={row.original.id}
                  nama={row.original.nama}
                >
                  <button className="bg-red-600 hover:bg-red-700 text-white py-0.5 px-3 rounded">
                    Hapus
                  </button>
                </DialogHapusDriver> */}
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

export default DriversTable;
