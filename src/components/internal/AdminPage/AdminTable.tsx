import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, EllipsisVertical, SquarePen, Trash } from 'lucide-react';
import { formatTanggal2Indonesia } from '@/lib/utils';
import { toast } from 'sonner';
import { errorToast, successToast } from '@/lib/constants';
import { ApiError } from '@/api/client';
import type { Akun, FetchAkunResponse } from '@/types/akun';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { deleteUserMutationOptions, updateAktivasiUserMutationOptions } from '@/queryOptions/akun';

interface Props {
  data: NoInfer<FetchAkunResponse> | undefined;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
}

const AdminTable = ({ data, page, setPage }: Props) => {
  const columnHelper = createColumnHelper<Akun>();
  const columns = [
    columnHelper.display({
      id: 'no',
      header: 'No',
      cell: (info) => (page - 1) * data!.metadata.page_size + info.row.index + 1,
      enableSorting: false
    }),
    columnHelper.accessor('email', {
      header: 'Email akun',
      enableSorting: true
    }),
    columnHelper.accessor((row) => row.jenis, {
      id: 'jenis',
      header: 'Jenis',
      enableSorting: true,
      cell: (info) => (info.getValue() === 'sppg' ? 'SPPG' : info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1))
    }),
    columnHelper.accessor('name', {
      header: 'Instansi',
      enableSorting: true
    }),
    columnHelper.accessor((row) => row.activated, {
      id: 'activated',
      header: 'Status',
      enableSorting: true,
      cell: (info) => (info.getValue() ? 'Aktif' : 'Nonaktif')
    }),
    columnHelper.accessor((row) => row.terakhir_aktif, {
      id: 'terakhir_aktif',
      header: 'Terakhir aktif',
      enableSorting: true,
      cell: (info) => (info.getValue() === '' ? 'Belum pernah' : formatTanggal2Indonesia(info.getValue()))
    }),
    columnHelper.accessor((row) => row.activated, {
      id: 'aksi',
      header: 'Aksi',
      enableSorting: false,
      cell: (info) => {
        const activated = info.getValue();
        const { id } = info.row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleUpdateAkativasi(id, !activated)}>
                <SquarePen />
                {activated ? 'Nonaktifkan' : 'Aktifkan'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => handleDelete(id)}>
                <Trash />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    })
  ];
  const table = useReactTable({
    data: data!.akun,
    columns,
    // state: { sorting },
    // onSortingChange: setSorting,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel()
  });
  const mutation = useMutation({
    ...deleteUserMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil menghapus user.', {
        style: successToast as React.CSSProperties
      });
      queryClient.invalidateQueries({ queryKey: ['akun'] });
      queryClient.invalidateQueries({ queryKey: ['users-summary'] });
    },
    onError: (error: ApiError) => {
      toast.error('Gagal menghapus user.', {
        style: errorToast as React.CSSProperties
      });
      console.log('ERROR:', error);
    }
  });
  const handleDelete = async (id: number) => {
    console.log('deleting', id);
    await mutation.mutateAsync({ id });
  };
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const mutationUpdateAktivasi = useMutation({
    ...updateAktivasiUserMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil mengupdate user.', {
        style: successToast as React.CSSProperties
      });
      queryClient.invalidateQueries({ queryKey: ['akun'] });
      queryClient.invalidateQueries({ queryKey: ['users-summary'] });
    }
  });
  const handleUpdateAkativasi = async (id: number, value: boolean) => {
    console.log('updating acivated', id, 'to', value);
    // await mutation.mutateAsync({ sppg_id, id });
    setIsLoading(true);
    try {
      await mutationUpdateAktivasi.mutateAsync({ id, value });
    } catch (err) {
      let message = 'Gagal mengupdate user.';
      if (err instanceof ApiError) {
        const errors = err.data?.error;
        console.log(errors);
      }
      toast.error(message, {
        style: errorToast as React.CSSProperties
      });
    } finally {
      setIsLoading(false);
    }
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

export default AdminTable;
