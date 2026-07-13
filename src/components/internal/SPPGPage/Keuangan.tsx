import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import Navbar from '../Navbar';
import { createAlokasiMutationOptions, getAlokasiHarianQueryOptions, getPengeluaranHarianQueryOptions, getSPPGByIDQueryOptions } from '../../../queryOptions/sppg';
import { useState } from 'react';
import type { AuthResponse } from '@/types/auth';
import { HandCoins, ShoppingCart, Wallet, Plus, History, CalendarClock, SquarePen, Save, X, LoaderCircle } from 'lucide-react';
import { WebSocketProvider } from '@/provider/websocket-provider';
import { formatRupiah, formatTanggalIndonesia, getTodaysDate } from '@/lib/utils';
import PengeluaranTable from './PengeluaranTable';
import DialogTambahPengeluaran from './Dialog/DialogTambahPengeluaran';
import { Button } from '@/components/ui/button';
import type { ApiError } from '@/api/client';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { errorToast, successToast } from '@/lib/constants';
import { alokasiSchema } from '@/schema/formValidation';
import type { SortingState } from '@tanstack/react-table';
import { getPedagangLokalQueryOptions } from '@/queryOptions/pedaganglokal';

interface Props {
  user: AuthResponse;
}

const Keuangan = ({ user }: Props) => {
  const { data: sppg } = useSuspenseQuery(getSPPGByIDQueryOptions(user.user.role.id_in_role));

  // 20/06/2026
  const today = getTodaysDate();
  const { data: alokasiHarianData, refetch: refetchAlokasi } = useSuspenseQuery(getAlokasiHarianQueryOptions(sppg.id, today));
  const alokasiHarian = alokasiHarianData ?? {
    jumlah: 0,
    id: 0,
    sppg_id: sppg.id,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    tanggal: `${today}T00:00:00Z`
  };
  const {
    data: pengeluaran,
    isFetching,
    refetch: refetchPengeluaran
  } = useQuery({
    ...getPengeluaranHarianQueryOptions(sppg.id, today),
    enabled: alokasiHarian.id !== 0
  });
  console.log(pengeluaran);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const sort = sorting[0] ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` : '';

  const { data, refetch } = useQuery(
    getPedagangLokalQueryOptions({
      page,
      nama: search,
      sort
    })
  );
  const pedagangLokal = data?.pedagang_lokal;
  const [isInput, setIsInput] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const mutation = useMutation({
    ...createAlokasiMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil mengubah alokasi harian.', {
        style: successToast as React.CSSProperties
      });
      refetchAlokasi();
    },
    onError: (error: ApiError) => {
      toast.error('Gagal mengubah alokasi harian.', {
        style: errorToast as React.CSSProperties
      });
      console.log('ERROR:', error);
    }
  });
  const [alokasiHarianJumlah, setAlokasiHarianJumlah] = useState(alokasiHarian.jumlah);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      tanggal: today,
      jumlah: alokasiHarianJumlah
    };
    const result = alokasiSchema.safeParse(payload);

    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors).flat()[0];

      if (firstError) {
        toast.error(firstError, {
          style: errorToast as React.CSSProperties
        });
      }
      return;
    }
    await mutation.mutateAsync({ sppg_id: sppg.id, input: payload });
    setIsLoading(false);
    setIsInput(false);
  };
  return (
    <WebSocketProvider room_id={`sppg/${String(sppg.id)}`}>
      <div className="flex min-h-screen bg-gray-50">
        <Navbar role_id={3} />

        <div className="ml-[15%] flex-1 p-6 flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-xl font-black text-gray-800">Halaman Keuangan SPPG</h1>
            <p className="text-xs text-gray-400 tracking-widest mt-1">MANAJEMEN DATA SATUAN PELAYANAN PEMENUHAN GIZI</p>
          </div>

          {/* Info Card SPPG */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 rounded-xl p-2">
                  <CalendarClock className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Keuangan Hari Ini, {formatTanggalIndonesia(`${today}T00:00:00Z`)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-0 divide-x divide-gray-100">
              <div className="p-6 flex justify-between">
                {isInput ? (
                  <div className="flex items-start gap-3">
                    <Input
                      placeholder="Masukan nominal alokasi"
                      value={formatRupiah(Number(alokasiHarianJumlah))}
                      onChange={(e) => {
                        const angka = Number(e.target.value.replace(/\D/g, ''));
                        setAlokasiHarianJumlah(Number(angka));
                      }}
                    />
                    <div className="flex gap-2">
                      <Button
                        className="
                        text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                        onClick={handleSubmit}
                        disabled={isLoading}
                      >
                        {isLoading ? <LoaderCircle /> : <Save />}
                      </Button>
                      <Button className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors" variant="destructive" onClick={() => setIsInput(!isInput)}>
                        <X />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <HandCoins className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400 tracking-widest">ALOKASI</p>
                        <p className="text-sm text-gray-700 mt-0.5">{formatRupiah(alokasiHarian.jumlah)}</p>
                      </div>
                    </div>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700
                             text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                      onClick={() => setIsInput(!isInput)}
                    >
                      <SquarePen />
                    </Button>
                  </>
                )}
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <ShoppingCart className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 tracking-widest">TERPAKAI</p>
                    <p className="text-sm text-gray-700 mt-0.5">{pengeluaran ? formatRupiah(pengeluaran.pengeluaran_harian.reduce((acc, obj) => acc + obj.harga_satuan * obj.jumlah, 0)) : 0}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Wallet className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 tracking-widest">SISA</p>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {pengeluaran ? formatRupiah(alokasiHarian.jumlah - pengeluaran.pengeluaran_harian.reduce((acc, obj) => acc + obj.harga_satuan * obj.jumlah, 0)) : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-bold text-gray-800">Pengeluaran</p>
                </div>
              </div>
              <DialogTambahPengeluaran sppg_id={sppg.id} alokasi_harian_id={alokasiHarian.id} onPengeluaranUpdate={refetchPengeluaran} pedagangLokal={pedagangLokal}>
                <button
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                             text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                  disabled={alokasiHarian.id === 0}
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </DialogTambahPengeluaran>
            </div>
            <div className="px-4 pb-4">
              {isFetching && <div className="text-center text-sm py-5 text-muted-foreground">Memuat data...</div>}
              {pengeluaran ? (
                <PengeluaranTable onDelete={() => refetchPengeluaran()} sppg_id={sppg.id} pengeluaran={pengeluaran.pengeluaran_harian} metadata={pengeluaran.metadata} />
              ) : (
                <div className="text-center text-sm py-5 text-muted-foreground">Belum ada data pengeluaran.</div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 rounded-xl p-2">
                  <History className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Riwayat Keuangan</p>
                </div>
              </div>
            </div>

            <div className="grid">
              <small className="text-center">Coming soon</small>
            </div>
          </div>
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default Keuangan;
