import { useQuery, useQueryClient, useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import { getSekolahQueryOptions } from '../../queryOptions/sekolah';
import { getPosyanduQueryOptions } from '../../queryOptions/posyandu';
import { getAllProduksiHarianQueryOptions, getKeuanganHarianQueryOptions, getSPPGQueryOptions } from '../../queryOptions/sppg';
import DashboardMap from './DashboardMap';
import { getPengirimanQueryOptions } from '@/queryOptions/pengiriman';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useWebSocket } from '@/contexts/websocket-context';
import { getTrackingQueryOptions } from '@/queryOptions/tracking';
import Navbar from './Navbar';
import { Truck, Wallet, CheckCircle2, ChefHat, Users, ArrowRight } from 'lucide-react';
import { getTodaysDate } from '@/lib/utils';
import type { FetchSinglePengeluaranHarianResponse, PengeluaranHarianWithCoords } from '@/types/sppg';

interface Props {
  role_id: number;
}

const Dashboard = ({ role_id }: Props) => {
  const [{ data: sekolah }, { data: posyandu }, { data: sppg }] = useSuspenseQueries({
    queries: [getSekolahQueryOptions(), getPosyanduQueryOptions(), getSPPGQueryOptions()]
  });

  const { data: pengiriman } = useSuspenseQuery(getPengirimanQueryOptions({ status: 'berangkat' }));
  const { data: pengirimanSampai } = useSuspenseQuery(getPengirimanQueryOptions({ status: 'sampai', tanggal: getTodaysDate() }));
  const { data: pengirimanTotal } = useSuspenseQuery(getPengirimanQueryOptions({ tanggal: getTodaysDate() }));

  const pengirimanIds = useMemo(() => [...new Set(pengiriman.pengiriman.map((item) => item.id))], [pengiriman.pengiriman]);

  const { data: tracking } = useQuery(getTrackingQueryOptions(pengirimanIds));

  const [pengeluaranBaru, setPengeluaranBaru] = useState<PengeluaranHarianWithCoords | null>(null);

  const { lastMessage } = useWebSocket();
  const queryClient = useQueryClient(); // ← pakai useQueryClient dari repo, bukan import langsung

  function handleWSMessage(message: any, queryClient: any) {
    switch (message.type) {
      case 'pengiriman:updated': {
        queryClient.invalidateQueries({ queryKey: ['pengiriman'] });
        if (message.data.status !== 'berangkat') {
          queryClient.setQueriesData({ queryKey: ['tracking'] }, (old: any) => {
            if (!old?.tracking) return old;
            return { ...old, tracking: old.tracking.filter((e: any) => e.pengiriman_id !== message.data.pengiriman_id) };
          });
        }
        break;
      }
      case 'tracking:created': {
        queryClient.setQueriesData({ queryKey: ['tracking'] }, (old: any) => {
          if (!old?.tracking) return old;
          const exists = old.tracking.some((t: any) => t.pengiriman_id === message.data.pengiriman_id);
          return { ...old, tracking: exists ? old.tracking.map((t: any) => (t.pengiriman_id === message.data.pengiriman_id ? message.data : t)) : [message.data, ...old.tracking] };
        });
        break;
      }
      case 'keuangan:updated': {
        queryClient.setQueriesData({ queryKey: ['keuangan_harian'] }, () => message.data);
        break;
      }
      case 'produksi:updated': {
        queryClient.setQueriesData({ queryKey: ['produksi_harian_all'] }, () => message.data);
        break;
      }
      case 'pengeluaran_lokal:created': {
        const data = message.data as PengeluaranHarianWithCoords;
        // pop up maps
        setPengeluaranBaru(data);
        break;
      }
    }
  }

  const buffer = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (!lastMessage) return;
    const key = `${lastMessage.type}-${lastMessage.data?.id || Math.random()}`;
    buffer.current.set(key, lastMessage);
  }, [lastMessage]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (buffer.current.size === 0) return;
      const batch = Array.from(buffer.current.values());
      buffer.current.clear();
      batch.forEach((msg) => handleWSMessage(msg, queryClient));
    }, 300);
    return () => clearInterval(interval);
  }, [queryClient]);

  // Keuangan dan Produksi
  const today = getTodaysDate();
  const { data: keuanganHarian } = useSuspenseQuery(getKeuanganHarianQueryOptions(today));
  const { data: produksiHarian } = useSuspenseQuery(getAllProduksiHarianQueryOptions(today));

  // Kalkulasi
  const totalBelanja = keuanganHarian.reduce((sum, el) => sum + el.terpakai, 0);
  const totalSasaran = sekolah.sekolah.reduce((sum, el) => sum + el.jumlah_siswa, 0) + posyandu.posyandu.reduce((sum, el) => sum + el.jumlah_balita + el.jumlah_ibu_hamil, 0);
  const totalPengiriman = pengirimanTotal.metadata.total_records;
  const totalSampai = pengirimanSampai.metadata.total_records;
  const persenDistribusi = totalPengiriman > 0 ? Math.round((totalSampai / totalPengiriman) * 100) : 0;
  const persenProduksi = sppg.metadata.total_records > 0 ? Math.round((produksiHarian.length / sppg.metadata.total_records) * 100) : 0;

  const stats = [
    {
      icon: <Wallet className="w-5 h-5 text-blue-500" />,
      iconBg: 'bg-blue-50',
      label: 'Belanja Harian',
      value: `Rp. ${totalBelanja.toLocaleString('id-ID')}`,
      sub: 'Total pengeluaran hari ini',
      border: 'border-blue-100'
    },
    {
      icon: <Users className="w-5 h-5 text-green-500" />,
      iconBg: 'bg-green-50',
      label: 'Penerima Manfaat',
      value: totalSasaran.toLocaleString('id-ID'),
      sub: 'Jiwa terdaftar',
      border: 'border-green-100'
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-orange-500" />,
      iconBg: 'bg-orange-50',
      label: 'Distribusi Selesai',
      value: `${persenDistribusi}%`,
      sub: `dari total ${totalPengiriman} titik`,
      border: 'border-orange-100'
    },
    {
      icon: <ChefHat className="w-5 h-5 text-red-400" />,
      iconBg: 'bg-red-50',
      label: 'Status Produksi',
      value: `${persenProduksi}%`,
      sub: `dari total ${sppg.metadata.total_records} SPPG`,
      border: 'border-red-100'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar role_id={role_id} />

      <div className="ml-[15%] flex-1 p-6 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-black text-gray-800">Dashboard</h1>
          <p className="text-xs text-gray-400 tracking-widest mt-1">RINGKASAN DATA PROGRAM MBG — SANGGAU</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((item, i) => (
            <div key={i} className={`bg-white rounded-2xl p-5 border ${item.border}  shadow-sm`}>
              <div className="flex gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconBg}`}>{item.icon}</div>
                <div>
                  <p className="text-xs text-gray-400 tracking-widest uppercase">{item.label}</p>
                  <p className="text-2xl font-black text-gray-800 mt-1">{item.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map + Pengiriman Aktif */}
        <div className="flex gap-4 flex-1">
          {/* Map */}
          <div className="flex-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-125">
            <DashboardMap tracking={tracking?.tracking} pengeluaranBaru={pengeluaranBaru} />
          </div>

          {/* Pengiriman Aktif */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <div className="bg-blue-50 rounded-lg p-1.5">
                <Truck className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-sm font-bold text-gray-700 tracking-wide">PENGIRIMAN AKTIF</p>
              <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">{pengiriman.pengiriman.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {pengiriman.pengiriman.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-300 text-sm">Tidak ada pengiriman aktif</div>
              ) : (
                pengiriman.pengiriman.map((el) => (
                  <div key={el.id} className="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <p className="text-xs font-bold text-gray-700">{el.sppg_nama}</p>
                    </div>
                    <p className="text-xs text-gray-400 pl-4">Driver: {el.driver_nama}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 pl-4 ">
                      <ArrowRight size={15} />
                      {el.tujuan_nama}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
