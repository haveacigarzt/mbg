import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import type { Posyandu } from "../../../types/posyandu";
import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPosyanduQueryOptions } from "../../../queryOptions/posyandu";
import DialogTambahPosyandu from "./Dialog/DialogTambahPosyandu";
import type { Distrik } from "@/types/sppg";
import DialogEditPosyandu from "./Dialog/DialogEditPosyandu";
import DialogHapusPosyandu from "./Dialog/DialogHapusPosyandu";

interface Props {
  sppg_id: number;
  kelurahan: Distrik[];
  kecamatan: string;
  kecamatan_id: number;
  kelurahan_id: number;
}
const columnHelper = createColumnHelper<Posyandu>();
const columns = [
  columnHelper.accessor("nama", {
    header: "Nama",
    enableSorting: true,
  }),

  columnHelper.accessor("alamat", {
    header: "Alamat",
    enableSorting: true,
  }),

  columnHelper.accessor("kelurahan", {
    header: "Kelurahan",
    enableSorting: true,
  }),

  columnHelper.accessor("jumlah_balita", {
    header: "Jumlah Balita",
    enableSorting: true,
  }),

  columnHelper.accessor("jumlah_ibu_hamil", {
    header: "Jumlah Ibu Hamil",
    enableSorting: true,
  }),
];

const PosyanduTable = ({
  sppg_id,
  kelurahan,
  kecamatan,
  kecamatan_id,
  kelurahan_id,
}: Props) => {
  const [searchPosyandu, setSearchPosyandu] = useState("");
  const [page, setPage] = useState(1);
  const page_size = 10;
  const [sorting, setSorting] = useState<SortingState>([]);
  const sort = sorting[0]
    ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
    : "";

  const { data, refetch } = useSuspenseQuery(
    getPosyanduQueryOptions({
      sppg_id,
      page,
      page_size,
      nama: searchPosyandu,
      sort,
    }),
  );
  const posyandu = data.posyandu;
  const metadata = data.metadata;
  useEffect(() => {
    setPage(1);
  }, [searchPosyandu]);
  const table = useReactTable({
    data: posyandu,
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
          value={searchPosyandu}
          onChange={(e) => setSearchPosyandu(e.target.value)}
          placeholder={`Cari posyandu...`}
        />
        <DialogTambahPosyandu
          onPosyanduUpdate={refetch}
          kecamatan={kecamatan}
          kelurahan={kelurahan}
          kecamatan_id={kecamatan_id}
          kelurahan_id={kelurahan_id}
        >
          <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded me-1">
            Tambah
          </button>
        </DialogTambahPosyandu>
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
                <DialogEditPosyandu
                  posyandu={row.original}
                  kelurahan={kelurahan}
                  onPosyanduUpdate={refetch}
                  kecamatan={kecamatan}
                >
                  <button className="bg-gray-500 hover:bg-gray-600 text-white py-0.5 px-5 rounded me-1">
                    Edit
                  </button>
                </DialogEditPosyandu>
                <DialogHapusPosyandu
                  onSuccess={refetch}
                  id={row.original.id}
                  nama={row.original.nama}
                >
                  <button className="bg-red-600 hover:bg-red-700 text-white py-0.5 px-3 rounded">
                    Hapus
                  </button>
                </DialogHapusPosyandu>
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

export default PosyanduTable;
