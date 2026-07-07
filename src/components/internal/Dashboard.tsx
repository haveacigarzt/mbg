import { useQuery, useQueryClient, useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import { getSekolahQueryOptions } from '../../queryOptions/sekolah';
import { getPosyanduQueryOptions } from '../../queryOptions/posyandu';
import { getAllProduksiHarianQueryOptions, getKeuanganHarianQueryOptions, getSPPGQueryOptions } from '../../queryOptions/sppg';
import DashboardMap from './DashboardMap';
import { getPengirimanQueryOptions } from '@/queryOptions/pengiriman';
import { useEffect, useMemo, useRef } from 'react';
import { useWebSocket } from '@/contexts/websocket-context';
import { getTrackingQueryOptions } from '@/queryOptions/tracking';
import Navbar from './Navbar';
import { Users, UtensilsCrossed, School, Heart, Truck } from 'lucide-react';
import { getTodaysDate } from '@/lib/utils';

interface Props {
  role_id: number;
}

const Dashboard = ({ role_id }: Props) => {
  const [{ data: sekolah }, { data: posyandu }, { data: sppg }] = useSuspenseQueries({
    queries: [getSekolahQueryOptions(), getPosyanduQueryOptions(), getSPPGQueryOptions()]
  });

  const { data: pengiriman } = useSuspenseQuery(getPengirimanQueryOptions({ status: 'berangkat' }));

  const pengirimanIds = useMemo(() => [...new Set(pengiriman.pengiriman.map((item) => item.id))], [pengiriman.pengiriman]);

  const { data: tracking } = useQuery(getTrackingQueryOptions(pengirimanIds));

  const { lastMessage } = useWebSocket();
  const queryClient = useQueryClient();

  function handleWSMessage(message: any, queryClient: any) {
    switch (message.type) {
      case 'pengiriman:updated': {
        queryClient.invalidateQueries({ queryKey: ['pengiriman'] });

        if (message.data.status !== 'berangkat') {
          queryClient.setQueriesData({ queryKey: ['tracking'] }, (old: any) => {
            if (!old?.tracking) return old;

            return {
              ...old,
              tracking: old.tracking.filter((e: any) => e.pengiriman_id !== message.data.pengiriman_id)
            };
          });
        }

        break;
      }

      case 'tracking:created': {
        queryClient.setQueriesData({ queryKey: ['tracking'] }, (old: any) => {
          if (!old?.tracking) return old;

          const exists = old.tracking.some((t: any) => t.pengiriman_id === message.data.pengiriman_id);

          return {
            ...old,
            tracking: exists ? old.tracking.map((t: any) => (t.pengiriman_id === message.data.pengiriman_id ? message.data : t)) : [message.data, ...old.tracking]
          };
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

      batch.forEach((msg) => {
        handleWSMessage(msg, queryClient);
      });
    }, 300);

    return () => clearInterval(interval);
  }, [queryClient]);

  const totalSasaran = sekolah.sekolah.reduce((sum, el) => sum + el.jumlah_siswa, 0);
  const totalIbuBalita = posyandu.posyandu.reduce((sum, el) => sum + el.jumlah_balita + el.jumlah_ibu_hamil, 0);

  const stats = [
    { icon: <Users className="w-5 h-5 text-blue-500" />, iconBg: 'bg-blue-50', label: 'Total Sasaran', value: totalSasaran.toLocaleString('id-ID'), sub: 'Jiwa Terdaftar', border: 'border-blue-100' },
    {
      icon: <School className="w-5 h-5 text-green-500" />,
      iconBg: 'bg-green-50',
      label: 'Sekolah',
      value: sekolah.metadata.total_records.toLocaleString('id-ID'),
      sub: 'Titik Penerima',
      border: 'border-green-100'
    },
    {
      icon: <UtensilsCrossed className="w-5 h-5 text-orange-500" />,
      iconBg: 'bg-orange-50',
      label: 'Unit Produksi',
      value: sppg.metadata.total_records.toLocaleString('id-ID'),
      sub: 'SPPG Aktif',
      border: 'border-orange-100'
    },
    { icon: <Heart className="w-5 h-5 text-red-400" />, iconBg: 'bg-red-50', label: 'Posyandu (3B)', value: totalIbuBalita.toLocaleString('id-ID'), sub: 'Ibu & Balita', border: 'border-red-100' }
  ];

  // Keuangan dan Produksi Realtime
  const today = getTodaysDate();
  const { data: keuanganHarian } = useSuspenseQuery(getKeuanganHarianQueryOptions(today));
  const { data: produksiHarian } = useSuspenseQuery(getAllProduksiHarianQueryOptions(today));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar role_id={role_id} />

      <div className="ml-[15%] flex-1 p-6 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-black text-gray-800">Dashboard</h1>
          <p className="text-xs text-gray-400 tracking-widest mt-1">RINGKASAN DATA PROGRAM MBG — SANGGAU</p>
        </div>
        <div className="flex flex-wrap gap-5">
          {keuanganHarian.map((el) => (
            <ul>
              <li>row_id: {el.row_id}</li>
              <li>sppg_id: {el.sppg_id}</li>
              <li>sppg_nama: {el.sppg_nama}</li>
              <li>tanggal: {el.tanggal}</li>
              <li>alokasi: {el.alokasi}</li>
              <li>terpakai: {el.terpakai}</li>
              <li>sisa: {el.sisa}</li>
            </ul>
          ))}
        </div>
        <div className="flex flex-wrap gap-5">
          {produksiHarian.map((el) => (
            <ul>
              <li>row_id: {el.row_id}</li>
              <li>sppg_id: {el.sppg_id}</li>
              <li>tanggal: {el.tanggal}</li>
              <li>waktu_mulai: {el.waktu_mulai}</li>
              <li>estimasi_waktu_selesai: {el.estimasi_waktu_selesai}</li>
            </ul>
          ))}
        </div>
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((item, i) => (
            <div key={i} className={`bg-white rounded-2xl p-5 border ${item.border} flex flex-col gap-3 shadow-sm`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconBg}`}>{item.icon}</div>
              <div>
                <p className="text-xs text-gray-400 tracking-widest uppercase">{item.label}</p>
                <p className="text-3xl font-black text-gray-800 mt-1">{item.value}</p>
                <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Map + Pengiriman Aktif */}
        <div className="flex gap-4">
          {/* Map */}
          <div className="flex-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <DashboardMap tracking={tracking?.tracking} />
          </div>

          {/* Pengiriman Aktif */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <div className="bg-blue-50 rounded-lg p-1.5">
                <Truck className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-sm font-bold text-gray-700 tracking-wide">PENGIRIMAN AKTIF</p>
              <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">{pengiriman.pengiriman.length}</span>
            </div>

            {/* List */}
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
                    <p className="text-xs text-gray-400 pl-4">→ {el.tujuan_nama}</p>
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
