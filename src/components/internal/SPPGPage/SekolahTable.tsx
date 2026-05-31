import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import type { Sekolah } from "../../../types/sekolah";
import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getSekolahQueryOptions } from "../../../queryOptions/sekolah";

interface Props {
  sppg_id: number;
  search: string;
}

const columnHelper = createColumnHelper<Sekolah>();

const columns = [
  columnHelper.accessor("nama", {
    header: "Nama",
    enableSorting: true,
  }),

  columnHelper.accessor("alamat", {
    header: "Alamat",
    enableSorting: true,
  }),

  columnHelper.accessor("jumlah_siswa", {
    header: "Jumlah Siswa",
    enableSorting: true,
  }),

  columnHelper.display({
    id: "aksi",
    header: "Aksi",
    cell: () => (
      <>
        <button className="bg-gray-500 hover:bg-gray-600 text-white py-0.5 px-5 rounded me-1">
          Edit
        </button>

        <button className="bg-red-600 hover:bg-red-700 text-white py-0.5 px-3 rounded">
          Hapus
        </button>
      </>
    ),
  }),
];

const SekolahTable = ({ sppg_id, search }: Props) => {
  const [page, setPage] = useState(1);
  const page_size = 10;
  const [sorting, setSorting] = useState<SortingState>([]);
  const sort = sorting[0]
    ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
    : "";

  const { data } = useSuspenseQuery(
    getSekolahQueryOptions({ sppg_id, page, page_size, nama: search, sort }),
  );
  const sekolah = data.sekolah;
  const metadata = data.metadata;
  useEffect(() => {
    setPage(1);
  }, [search]);
  const table = useReactTable({
    data: sekolah,
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

export default SekolahTable;
