import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { useMutation } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, EllipsisVertical, Trash, Send } from 'lucide-react';
import { formatTanggal2Indonesia } from '@/lib/utils';
import { toast } from 'sonner';
import { errorToast, successToast } from '@/lib/constants';
import type { ApiError } from '@/api/client';
import { deletePengeluaranMutationOptions } from '@/queryOptions/sppg';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { FetchSPPGInvitationsResponse, SPPGInvitation } from '@/types/sppg_invitations';

interface Props {
  data: NoInfer<FetchSPPGInvitationsResponse> | undefined;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
}

const InvitationsTable = ({ data, page, setPage }: Props) => {
  const columnHelper = createColumnHelper<SPPGInvitation>();
  const columns = [
    columnHelper.display({
      id: 'no',
      header: 'No',
      cell: (info) => (page - 1) * data!.metadata.page_size + info.row.index + 1,
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.created_at, {
      id: 'created_at',
      header: 'Waktu Dibuat',
      enableSorting: true,
      cell: ({ getValue }) => {
        const createdAt = getValue();

        return formatTanggal2Indonesia(createdAt);
      }
    }),
    columnHelper.accessor('token', {
      header: 'Token',
      enableSorting: false
    }),
    columnHelper.accessor((row) => row.expires_at, {
      id: 'expires_at',
      header: 'Waktu Expired',
      enableSorting: true,
      cell: ({ getValue }) => {
        const expiresAt = getValue();

        return expiresAt.Valid ? formatTanggal2Indonesia(expiresAt.Time) : '-';
      }
    }),
    columnHelper.accessor((row) => row.used_at, {
      id: 'used_at',
      header: 'Waktu Digunakan',
      enableSorting: true,
      cell: ({ getValue }) => {
        const usedAt = getValue();

        return usedAt.Valid ? formatTanggal2Indonesia(usedAt.Time) : '-';
      }
    }),
    columnHelper.accessor('nama_sppg', {
      header: 'Nama SPPG',
      enableSorting: true
    }),
    columnHelper.accessor((row) => row.id, {
      id: 'aksi',
      header: 'Aksi',
      enableSorting: false,
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Send />
              Kirim Ulang
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    })
  ];
  const table = useReactTable({
    data: data!.invitations,
    columns,
    // state: { sorting },
    // onSortingChange: setSorting,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel()
  });
  const mutation = useMutation({
    ...deletePengeluaranMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil menghapus pengeluaran harian.', {
        style: successToast as React.CSSProperties
      });
      // onDelete();
    },
    onError: (error: ApiError) => {
      toast.error('Gagal menghapus pengeluaran harian.', {
        style: errorToast as React.CSSProperties
      });
      console.log('ERROR:', error);
    }
  });
  const handleDelete = async (id: number) => {
    console.log('deleting', id);
    // await mutation.mutateAsync({ sppg_id, id });
  };
  return (
    <div className="flex flex-col gap-4">
      {/* Tabel */}
      <div className="border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="bg-gray-50 border-b border-gray-100">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                    className="px-4 py-3 text-left text-xs text-gray-400 tracking-widest font-semibold cursor-pointer hover:text-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <>
                          {header.column.getIsSorted() === 'asc' && <ArrowUp className="w-3 h-3" />}

                          {header.column.getIsSorted() === 'desc' && <ArrowDown className="w-3 h-3" />}

                          {!header.column.getIsSorted() && <ArrowUpDown className="w-3 h-3 opacity-30" />}
                        </>
                      )}
                    </div>
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
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Halaman {page} dari {data?.metadata.last_page} — <span className="font-bold text-gray-600">TOTAL {data?.metadata.total_records} DATA</span>
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
          {Array.from({ length: data!.metadata.last_page }, (_, i) => i + 1).map((p) => (
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
            onClick={() => setPage((p) => Math.min(data!.metadata.last_page, p + 1))}
            disabled={page === data?.metadata.last_page}
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

export default InvitationsTable;
