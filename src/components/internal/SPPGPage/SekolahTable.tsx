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
import DialogEditSekolah from "./DialogEditSekolah";
import type { Distrik } from "@/types/sppg";
import DialogHapusSekolah from "./DialogHapusSekolah";

interface Props {
  sppg_id: number;
  search: string;
  kelurahan: Distrik[];
  kecamatan: string;
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

  columnHelper.accessor("kecamatan", {
    header: "Kecamatan",
    enableSorting: true,
  }),

  columnHelper.accessor("kelurahan", {
    header: "Kelurahan",
    enableSorting: true,
  }),

  columnHelper.accessor("jumlah_siswa", {
    header: "Jumlah Siswa",
    enableSorting: true,
  }),
];

const SekolahTable = ({ sppg_id, search, kelurahan, kecamatan }: Props) => {
  const [page, setPage] = useState(1);
  const page_size = 10;
  const [sorting, setSorting] = useState<SortingState>([]);
  const sort = sorting[0]
    ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
    : "";

  const { data, refetch } = useSuspenseQuery(
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
                <DialogEditSekolah
                  sekolah={row.original}
                  kelurahan={kelurahan}
                  onSekolahUpdate={refetch}
                  kecamatan={kecamatan}
                >
                  <button className="bg-gray-500 hover:bg-gray-600 text-white py-0.5 px-5 rounded me-1">
                    Edit
                  </button>
                </DialogEditSekolah>
                <DialogHapusSekolah
                  onSuccess={refetch}
                  id={row.original.id}
                  nama={row.original.nama}
                >
                  <button className="bg-red-600 hover:bg-red-700 text-white py-0.5 px-3 rounded">
                    Hapus
                  </button>
                </DialogHapusSekolah>
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

export default SekolahTable;
