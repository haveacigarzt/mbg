import type { AuthResponse } from "@/types/auth";
import Navbar from "../Navbar";
import { getDriverCurrentQueryOptions } from "@/queryOptions/drivers";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getPengirimanAktifByDriverIDQueryOptions,
  getPengirimanQueryOptions,
} from "@/queryOptions/pengiriman";
import PengirimanTableDriver from "@/components/internal/DriverPage/PengirimanTableDriver";
import TrackingDriver from "@/components/internal/DriverPage/TrackingDriver";
import { useEffect, useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import { WebSocketProvider } from "@/provider/websocket-provider";
import { queryClient } from "@/main";
import { useWebSocket } from "@/contexts/websocket-context";

interface Props {
  user: AuthResponse;
}

const Driver = ({ user }: Props) => {
  // console.log(user);
  const { data: driver } = useSuspenseQuery(getDriverCurrentQueryOptions());

  const [searchPengiriman, setSearchPengiriman] = useState("");
  const [page, setPage] = useState(1);
  const page_size = 10;
  const [sorting, setSorting] = useState<SortingState>([]);
  const sort = sorting[0]
    ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
    : "";
  const [tanggal, setTanggal] = useState(
    new Date().toLocaleDateString("sv-SE"),
  );

  const { data, refetch } = useSuspenseQuery(
    getPengirimanQueryOptions({
      sppg_id: driver.driver.sppg.id,
      page,
      tanggal,
      page_size,
      sort,
    }),
  );

  const pengiriman = data.pengiriman;
  const metadata = data.metadata;

  const { data: pengirimanAktif, refetch: refetchAktif } = useSuspenseQuery(
    getPengirimanAktifByDriverIDQueryOptions(),
  );

  const refetchAll = () => {
    console.log("refetch all");
    refetch();
    refetchAktif();
  };

  return (
    <WebSocketProvider room_id={`sppg/${String(driver.driver.sppg.id)}`}>
      <div className="flex">
        <Navbar role_id={4} />
        <div className="flex flex-col gap-3 p-3 w-[85%] bg-red-200">
          <div className="flex gap-3">
            <div className="flex-1 bg-blue-200">
              <b>Data SPPG</b>
              <p>{driver.driver.sppg.nama}</p>
              <p>{driver.driver.sppg.alamat}</p>
            </div>
            <div className="flex-1 bg-blue-200">
              <TrackingDriver
                pengiriman={pengirimanAktif}
                refetchAll={refetchAll}
                sppg_id={driver.driver.sppg.id}
              />
            </div>
          </div>
          <div className=" bg-blue-200">
            <b>Pengiriman Hari Ini</b>
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
    </WebSocketProvider>
  );
};

export default Driver;
