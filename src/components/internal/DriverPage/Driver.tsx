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
      <div className="flex min-h-screen bg-gray-50">
        <Navbar role_id={4} />
        {/* Wrapper */}
        <div className="ml-[15%] flex-1 p-6 flex flex-col gap-6">
          <div>
            <h1 className="text-xl font-black text-gray-800">Halaman Driver</h1>
            <p className="text-xs text-gray-400 tracking-widest mt-1">MANAJEMEN DATA SATUAN PELAYANAN PEMENUHAN GIZI</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
            {/* Header */}
            <div className="flex gap-3">
              <div className="rounded-xl bg-blue-50 p-2 h-[50%]">
                <ChefHat className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <b>Data SPPG</b>
                <p>{driver.driver.sppg.nama}</p>
                <p>{driver.driver.sppg.alamat}</p>
              </div>
              <div className="flex-1">
                <TrackingDriver pengiriman={pengirimanAktif} refetchAll={refetchAll} sppg_id={driver.driver.sppg.id} />
              </div>
            </div>
            <div className="bg-white mt-6">
              <div className="flex gap-3">
                <div className="rounded-xl bg-blue-50 p-2 ">
                  <Truck className="w-5 h-5 text-blue-500"></Truck>
                </div>
                <b className="mt-1">Pengiriman Hari Ini</b>
              </div>
              {/* Tabel */}
              <div className="mt-6">
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
      </div>
    </WebSocketProvider>
  );
};

export default Driver;
