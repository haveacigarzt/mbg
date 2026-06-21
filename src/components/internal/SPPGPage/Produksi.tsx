import { useSuspenseQuery } from '@tanstack/react-query';
import Navbar from '../Navbar';
import { getKecamatanQueryOptions, getKelurahanQueryOptions, getProduksiHarianQueryOptions, getSPPGByIDQueryOptions } from '../../../queryOptions/sppg';
import { Suspense, useEffect, useState } from 'react';
import SekolahTable from './SekolahTable';
import PosyanduTable from './PosyanduTable';
import { DialogEditSPPG } from './Dialog/DialogEditSPPG';
import type { AuthResponse } from '@/types/auth';
import { Building2, MapPin, Phone, Mail, Users, ChefHat, CheckCircle, XCircle, HandHeart, CookingPot, Clock, ClockCheck, BookmarkCheck, SquarePen } from 'lucide-react';
import { WebSocketProvider } from '@/provider/websocket-provider';
import { calculateProgress, formatTanggalIndonesia, formatTime, getTodaysDate } from '@/lib/utils';
import DialogEditProduksi from './Dialog/DialogEditProduksi';

interface Props {
  user: AuthResponse;
}

const Produksi = ({ user }: Props) => {
  const [tab, setTab] = useState('sekolah');
  const { data: sppg, refetch: refetchSPPG } = useSuspenseQuery(getSPPGByIDQueryOptions(user.user.role.id_in_role));
  const { data: kecamatan } = useSuspenseQuery(getKecamatanQueryOptions());
  const { data: kelurahan } = useSuspenseQuery(getKelurahanQueryOptions(sppg.kecamatan_id));
  const [tanggal, setTanggal] = useState(new Date().toLocaleDateString('sv-SE'));
  const [date, setDate] = useState<Date | undefined>(new Date());

  const tabs = [
    { id: 'sekolah', label: 'Sekolah' },
    { id: 'posyandu', label: 'Posyandu' }
  ];

  // const produksiHariIni = {
  //   id: 0,
  //   sppg_id: 5,
  //   waktu_mulai: '2026-06-19 10:30:45',
  //   estimasi_waktu_selesai: '2026-06-19 17:50:45'
  // };

  // 20/06/2026
  const today = getTodaysDate();
  const { data: produksiHarian, refetch: refetchProduksi } = useSuspenseQuery(getProduksiHarianQueryOptions(sppg.id, today));

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!produksiHarian) return;
    const updateProgress = () => {
      setProgress(calculateProgress(produksiHarian.waktu_mulai, produksiHarian.estimasi_waktu_selesai));
    };

    updateProgress();

    const interval = setInterval(updateProgress, 1000);

    return () => clearInterval(interval);
  }, []);

  function toTimeInput(datetime: string): string {
    return datetime.slice(11, 16);
  }

  return (
    <WebSocketProvider room_id={`sppg/${String(sppg.id)}`}>
      <div className="flex min-h-screen bg-gray-50">
        <Navbar role_id={3} />

        <div className="ml-[15%] flex-1 p-6 flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-xl font-black text-gray-800">Halaman Produksi SPPG</h1>
            <p className="text-xs text-gray-400 tracking-widest mt-1">MANAJEMEN DATA SATUAN PELAYANAN PEMENUHAN GIZI</p>
          </div>

          {/* Info Card SPPG */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 rounded-xl p-2">
                  <CookingPot className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Status Produksi Hari Ini (Real Time)</p>
                </div>
              </div>
              <DialogEditProduksi
                onUpdate={() => refetchProduksi()}
                sppg_id={sppg.id}
                tanggal={tanggal}
                waktu_mulai={produksiHarian ? toTimeInput(produksiHarian.waktu_mulai) : '00:00'}
                estimasi_waktu_selesai={produksiHarian ? toTimeInput(produksiHarian.estimasi_waktu_selesai) : '00:00'}
              >
                <button
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                             text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  <SquarePen className="w-4 h-4" />
                  Edit
                </button>
              </DialogEditProduksi>
            </div>

            <div className="grid grid-cols-3 gap-0 divide-x divide-gray-100">
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 tracking-widest">WAKTU MULAI</p>
                    <p className="text-sm text-gray-700 mt-0.5">{produksiHarian ? formatTime(produksiHarian.waktu_mulai) : 'Belum diatur'}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <ClockCheck className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 tracking-widest">ESTIMASI WAKTU SELESAI</p>
                    <p className="text-sm text-gray-700 mt-0.5">{produksiHarian ? formatTime(produksiHarian.estimasi_waktu_selesai) : 'Belum diatur'}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <BookmarkCheck className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 tracking-widest">PROGRESS</p>
                    <p className="text-sm text-gray-700 mt-0.5">{!produksiHarian ? 0 : progress === 100 ? 100 : progress.toFixed(3)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default Produksi;
