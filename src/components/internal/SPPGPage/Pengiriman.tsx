import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';
import Navbar from '../Navbar';
import { Suspense, useState } from 'react';
import PengirimanTable from './PengirimanTable';
import DriversTable from './DriversTable';
import { Truck, CircleUserRound, Group, LoaderCircle, ListChecks, AlertCircleIcon } from 'lucide-react';
import { getPengirimanQueryOptions } from '@/queryOptions/pengiriman';
import type { SortingState } from '@tanstack/react-table';
import { getSekolahQueryOptions } from '@/queryOptions/sekolah';
import { getPosyanduQueryOptions } from '@/queryOptions/posyandu';
import { formatTanggalIndonesia, getTodaysDate } from '@/lib/utils';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { getDriversQueryOptions } from '@/queryOptions/drivers';

interface Props {
  sppg_id: number;
}

const Keuangan = ({ sppg_id }: Props) => {
  const today = getTodaysDate();

  const [tanggal, setTanggal] = useState(new Date().toLocaleDateString('sv-SE'));
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Pengiriman Data
  const [page, setPage] = useState(1);
  const page_size = 10;
  const [sorting, setSorting] = useState<SortingState>([]);
  const sort = sorting[0] ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` : '';
  const { data, refetch } = useSuspenseQuery(getPengirimanQueryOptions({ sppg_id, page, tanggal, page_size, sort }));
  const [{ data: sekolah }, { data: posyandu }] = useSuspenseQueries({
    queries: [getSekolahQueryOptions({ sppg_id }), getPosyanduQueryOptions({ sppg_id })]
  });

  const menunggu = data.pengiriman.filter((el) => el.status === 'menunggu').length;
  const sampai = data.pengiriman.filter((el) => el.status === 'sampai').length;

  // Drivers Data
  const [searchDrivers, setSearchDrivers] = useState('');
  const [pageDriver, setPageDriver] = useState(1);
  const pageSizeDriver = 10;
  const [sortingDriver, setSortingDriver] = useState<SortingState>([]);
  const sortDriver = sortingDriver[0] ? `${sortingDriver[0].desc ? '-' : ''}${sortingDriver[0].id}` : '';

  const { data: dataDriver, refetch: refetchDriver } = useSuspenseQuery(
    getDriversQueryOptions({
      sppg_id,
      page: pageDriver,
      page_size: pageSizeDriver,
      nama: searchDrivers,
      sort: sortDriver
    })
  );

  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12 text-gray-300 text-sm">Memuat data...</div>}>
      <div className="flex min-h-screen bg-gray-50">
        <Navbar role_id={3} />

        <div className="ml-[15%] flex-1 p-6 flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-xl font-black text-gray-800">Halaman Pengiriman SPPG</h1>
            <p className="text-xs text-gray-400 tracking-widest mt-1">MANAJEMEN DATA SATUAN PELAYANAN PEMENUHAN GIZI</p>
          </div>

          {/* Info Card SPPG */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 rounded-xl p-2">
                  <Truck className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Pengiriman Hari Ini, {formatTanggalIndonesia(`${today}T00:00:00Z`)}</p>
                </div>
              </div>
              {data.pengiriman.length === 0 && (
                <Alert variant="warning" className="mt-2 w-fit">
                  <AlertCircleIcon className="w-4 h-4" />
                  <AlertTitle>Harap tambahkan pengiriman hari ini!</AlertTitle>
                </Alert>
              )}
            </div>
            <div className="grid grid-cols-3 gap-0 divide-x divide-gray-100">
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Group className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 tracking-widest">ALOKASI TUJUAN PENGIRIMAN</p>
                    <p className="text-sm text-gray-700 mt-0.5">{sekolah.metadata.total_records + posyandu.metadata.total_records}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <LoaderCircle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 tracking-widest">MENUNGGU</p>
                    <p className="text-sm text-gray-700 mt-0.5">{menunggu}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <ListChecks className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 tracking-widest">TERSALURKAN</p>
                    <p className="text-sm text-gray-700 mt-0.5">{sampai}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5">
              <PengirimanTable
                tanggal={tanggal}
                onTanggalChange={setTanggal}
                sppg_id={sppg_id}
                date={date}
                onDateChange={setDate}
                data={data}
                setPage={setPage}
                sorting={sorting}
                setSorting={setSorting}
                refetch={refetch}
                page={page}
                posyandu={posyandu}
                sekolah={sekolah}
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 rounded-xl p-2">
                  <CircleUserRound className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Akun Driver</p>
                </div>
              </div>
              {dataDriver.drivers.length === 0 && (
                <Alert variant="warning" className="mt-2 w-fit">
                  <AlertCircleIcon className="w-4 h-4" />
                  <AlertTitle>Harap tambahkan akun driver!</AlertTitle>
                </Alert>
              )}
            </div>

            <div className="p-5">
              <DriversTable
                data={dataDriver}
                setPageDriver={setPageDriver}
                searchDrivers={searchDrivers}
                sortingDriver={sortingDriver}
                setSortingDriver={setSortingDriver}
                setSearchDrivers={setSearchDrivers}
                refetchDriver={refetchDriver}
                pageDriver={pageDriver}
              />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Keuangan;
