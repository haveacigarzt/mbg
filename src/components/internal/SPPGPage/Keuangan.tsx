import { useSuspenseQuery } from '@tanstack/react-query';
import Navbar from '../Navbar';
import { getKecamatanQueryOptions, getKelurahanQueryOptions, getSPPGByIDQueryOptions } from '../../../queryOptions/sppg';
import { Suspense, useState } from 'react';
import type { AuthResponse } from '@/types/auth';
import { Building2, MapPin, Phone, Mail, Users, ChefHat, CheckCircle, XCircle, ClockCheck, HandCoins, ShoppingCart, Wallet, Plus, History, CalendarClock, SquarePen } from 'lucide-react';
import { WebSocketProvider } from '@/provider/websocket-provider';
import { formatRupiah } from '@/lib/utils';
import PengeluaranTable from './PengeluaranTable';
import DialogTambahPengeluaran from './Dialog/DialogTambahPengeluaran';
import { Button } from '@/components/ui/button';

interface Props {
  user: AuthResponse;
}

const Keuangan = ({ user }: Props) => {
  const [tab, setTab] = useState('sekolah');
  const { data: sppg, refetch: refetchSPPG } = useSuspenseQuery(getSPPGByIDQueryOptions(user.user.role.id_in_role));
  const { data: kecamatan } = useSuspenseQuery(getKecamatanQueryOptions());
  const { data: kelurahan } = useSuspenseQuery(getKelurahanQueryOptions(sppg.kecamatan_id));
  const [tanggal, setTanggal] = useState(new Date().toLocaleDateString('sv-SE'));
  const [date, setDate] = useState<Date | undefined>(new Date());

  const tabs = [
    { id: 'sekolah', label: 'Sekolah' },
    { id: 'posyandu', label: 'Posyandu' },
    { id: 'drivers', label: 'Driver' },
    { id: 'pengiriman', label: 'Pengiriman' }
  ];

  const alokasiHarian = {
    tanggal: '18/06/2026',
    jumlah: 500000
  };

  const pengeluaranHarian = [
    {
      id: 0,
      created_at: '2026-06-18 17:30:45',
      produk: 'Beras',
      jumlah: 10,
      satuan: 'kilo',
      harga_satuan: 20000
    },
    {
      id: 1,
      created_at: '2026-06-18 17:40:45',
      produk: 'Minyak Goreng',
      jumlah: 5,
      satuan: 'liter',
      harga_satuan: 10000
    },
    {
      id: 2,
      created_at: '2026-06-18 17:41:45',
      produk: 'Tepung Terigu',
      jumlah: 7,
      satuan: 'kilo',
      harga_satuan: 8000
    },
    {
      id: 3,
      created_at: '2026-06-18 17:43:45',
      produk: 'Refill Gas 3 Kilo',
      jumlah: 3,
      satuan: 'tabung',
      harga_satuan: 25000
    }
  ];

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
                  <p className="font-bold text-gray-800">Keuangan Hari Ini (Real Time)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-0 divide-x divide-gray-100">
              <div className="p-6 flex justify-between">
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
                >
                  <SquarePen />
                </Button>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <ShoppingCart className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 tracking-widest">TERPAKAI</p>
                    <p className="text-sm text-gray-700 mt-0.5">{formatRupiah(pengeluaranHarian.reduce((acc, obj) => acc + obj.harga_satuan * obj.jumlah, 0))}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Wallet className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 tracking-widest">SISA</p>
                    <p className="text-sm text-gray-700 mt-0.5">{formatRupiah(alokasiHarian.jumlah - pengeluaranHarian.reduce((acc, obj) => acc + obj.harga_satuan * obj.jumlah, 0))}</p>
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
              <DialogTambahPengeluaran onPengeluaranUpdate={() => console.log('refetching pengeluaran...')}>
                <button
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                             text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </DialogTambahPengeluaran>
            </div>
            <div className="px-4 pb-4">
              <Suspense fallback={<div className="flex items-center justify-center py-12 text-gray-300 text-sm">Memuat data...</div>}>
                <PengeluaranTable sppg_id={sppg.id} pengeluaran={pengeluaranHarian} />
              </Suspense>
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
