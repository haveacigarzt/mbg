import type { AuthResponse } from '@/types/auth';
import Navbar from '../Navbar';
import { getDriverCurrentQueryOptions } from '@/queryOptions/drivers';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getPengirimanAktifByDriverIDQueryOptions, getPengirimanQueryOptions } from '@/queryOptions/pengiriman';
import PengirimanTableDriver from '@/components/internal/DriverPage/PengirimanTableDriver';
import TrackingDriver from '@/components/internal/DriverPage/TrackingDriver';
import { useEffect, useState } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { WebSocketProvider } from '@/provider/websocket-provider';
import { queryClient } from '@/main';
import { useWebSocket } from '@/contexts/websocket-context';
import { Truck, ChefHat } from 'lucide-react';

interface Props {
  user: AuthResponse;
}

const Driver = ({ user }: Props) => {
  // console.log(user);
  const { data: driver } = useSuspenseQuery(getDriverCurrentQueryOptions());

  const [searchPengiriman, setSearchPengiriman] = useState('');
  const [page, setPage] = useState(1);
  const page_size = 10;
  const [sorting, setSorting] = useState<SortingState>([]);
  const sort = sorting[0] ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` : '';
  const [tanggal, setTanggal] = useState(new Date().toLocaleDateString('sv-SE'));

  const { data, refetch } = useSuspenseQuery(
    getPengirimanQueryOptions({
      sppg_id: driver.driver.sppg.id,
      page,
      tanggal,
      page_size,
      sort
    })
  );

  const pengiriman = data.pengiriman;
  const metadata = data.metadata;

  const { data: pengirimanAktif, refetch: refetchAktif } = useSuspenseQuery(getPengirimanAktifByDriverIDQueryOptions());

  const refetchAll = () => {
    console.log('refetch all');
    refetch();
    refetchAktif();
  };

  return (
    <WebSocketProvider room_id={`sppg/${String(driver.driver.sppg.id)}`}>
      <div className="flex min-h-screen bg-slate-50">
        <Navbar role_id={4} />

        {/* Wrapper */}
        <div className="ml-[15%] flex-1 p-8 flex flex-col gap-8">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-black text-slate-800">Halaman Driver</h1>
            <p className="text-xs text-slate-500 font-semibold tracking-widest mt-1 uppercase">Manajemen Data Satuan Pelayanan Pemenuhan Gizi</p>
          </div>

          {/* Section 1: SPPG & Tracking Map */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col xl:flex-row gap-8">
            {/* SPPG Info */}
            <div className="xl:w-1/3 flex gap-4 xl:border-r border-slate-100 pr-4">
              <div className="rounded-xl bg-blue-50 p-3 h-fit border border-blue-100">
                <ChefHat className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Data SPPG</span>
                <h2 className="text-lg font-bold text-slate-800">{driver.driver.sppg.nama}</h2>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{driver.driver.sppg.alamat}</p>
              </div>
            </div>

            {/* Tracking Driver Map */}
            <div className="flex-1">
              <TrackingDriver pengiriman={pengirimanAktif} refetchAll={refetchAll} sppg_id={driver.driver.sppg.id} />
            </div>
          </div>

          {/* Section 2: Tabel Pengiriman */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            {/* Card Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
              <div className="rounded-xl bg-blue-50 p-3 border border-blue-100">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Pengiriman Hari Ini</h2>
                <p className="text-sm text-slate-500">Daftar jadwal rute pengiriman</p>
              </div>
            </div>

            {/* Data Table */}
            <div className="mt-2">
              <PengirimanTableDriver
                pengiriman={pengiriman}
                refetchAll={refetchAll}
                setPage={setPage}
                searchPengiriman={searchPengiriman}
                sorting={sorting}
                setSorting={setSorting}
                setTanggal={setTanggal}
                setSearchPengiriman={setSearchPengiriman}
                metadata={metadata}
                page={page}
              />
            </div>
          </div>
        </div>
      </div>
    </WebSocketProvider>
  );
};

export default Driver;
