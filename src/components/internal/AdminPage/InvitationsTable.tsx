import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, EllipsisVertical, Trash, Send } from 'lucide-react';
import { formatTanggal2Indonesia, formatTanggalIndonesia, hasPassed } from '@/lib/utils';
import { toast } from 'sonner';
import { errorToast, successToast } from '@/lib/constants';
import type { ApiError } from '@/api/client';
import { deletePengeluaranMutationOptions } from '@/queryOptions/sppg';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { FetchSPPGInvitationsResponse, SPPGInvitation } from '@/types/sppg_invitations';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { deleteSPPGInvitationQueryOptions } from '@/queryOptions/sppg_invitations';

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
      cell: (info) => {
        const { token, nama_sppg: namaSPPG, expires_at, id } = info.row.original;
        const linkPendaftaran = `https://192.168.1.10:5173/register/${token}`;
        const pesan = `🏢 *UNDANGAN PENGELOLA SPPG - MBG*

        Halo,

        Anda diundang untuk bergabung sebagai *Pengelola ${namaSPPG || '...'}* pada Sistem MBG.

        📝 *Daftar melalui:*
        *${linkPendaftaran}*

        Tautan undangan ini berlaku hingga ${formatTanggalIndonesia(expires_at.Time)}.

        ⏳ Setelah mendaftar, akun Anda akan menunggu persetujuan dari administrator sebelum dapat digunakan.

        Terima kasih.

        *Tim MBG*`;
        const plain = `
  🏢 UNDANGAN PENGELOLA SPPG - MBG

      Halo,

      Anda diundang untuk bergabung sebagai Pengelola SPPG ${namaSPPG || '...'} pada Sistem MBG.

      📝 Daftar melalui:
      ${linkPendaftaran}

      Tautan undangan ini berlaku hingga ${formatTanggalIndonesia(expires_at.Time)}.

      ⏳ Setelah mendaftar, akun Anda akan menunggu persetujuan dari administrator sebelum dapat digunakan.

      Terima kasih.

      Tim MBG  
    `;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!hasPassed(expires_at.Time) && (
                <>
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="ghost">
                        <Send />
                        Kirim Ulang
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-base">Invite User SPPG</DialogTitle>
                        <DialogDescription>Kirim pesan berikut kepada calon pengelola SPPG untuk melakukan pendaftaran.</DialogDescription>
                      </DialogHeader>
                      <div className="rounded-xl border bg-muted/40 p-4 text-sm whitespace-pre-wrap">
                        <div className="space-y-4 text-sm">
                          <h3 className="font-semibold text-base">🏢 UNDANGAN PENGELOLA SPPG - MBG</h3>
                          <p>Halo,</p>
                          <p>
                            Anda diundang untuk bergabung sebagai <strong>Pengelola {namaSPPG || '...'}</strong> pada Sistem MBG.
                          </p>
                          <p className="mb-0">📝 Daftar melalui:</p>
                          <p>
                            <a href={linkPendaftaran} className="font-semibold underline text-blue-600">
                              {linkPendaftaran}
                            </a>
                          </p>
                          <p>Tautan undangan ini berlaku hingga {formatTanggalIndonesia(expires_at.Time)}.</p>
                          <p>⏳ Setelah mendaftar, akun Anda akan menunggu persetujuan dari administrator sebelum dapat digunakan.</p>
                          <p className="font-medium">Tim MBG</p>
                        </div>
                      </div>
                      <DialogFooter className="flex justify-between">
                        <Button
                          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 disabled:bg-blue-50 text-blue-700 disabled:text-blue-300 text-sm font-semibold p-3 rounded-xl transition-colors"
                          onClick={async () => {
                            await copyToClipboard(plain);

                            toast.success('Undangan berhasil disalin');
                          }}
                        >
                          Salin Undangan
                        </Button>
                        <Button
                          onClick={() => {
                            window.open(`https://wa.me?text=${encodeURIComponent(pesan)}`, '_blank');
                          }}
                          className=" bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-xl transition-colors px-3"
                        >
                          Kirim via WhatsApp
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem variant="destructive" onClick={() => handleDelete(token)}>
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
    data: data!.invitations,
    columns,
    // state: { sorting },
    // onSortingChange: setSorting,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel()
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ...deleteSPPGInvitationQueryOptions(),
    onSuccess: () => {
      toast.success('Berhasil menghapus invitasi.', {
        style: successToast as React.CSSProperties
      });
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
    onError: (error: ApiError) => {
      toast.error('Gagal menghapus invitasi.', {
        style: errorToast as React.CSSProperties
      });
      console.log('ERROR:', error);
    }
  });
  const handleDelete = async (token: string) => {
    console.log('deleting', token);
    await mutation.mutateAsync({ token });
  };
  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    document.execCommand('copy');

    document.body.removeChild(textarea);
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
