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

interface Props {
  user: AuthResponse;
}

const Driver = ({ user }: Props) => {
  // console.log(user);
  const { data: driver } = useSuspenseQuery(getDriverCurrentQueryOptions());
  // const { data: pengiriman } = useSuspenseQuery(
  //   getPengirimanQueryOptions({
  //     tanggal: new Date().toLocaleDateString("sv-SE"),
  //   }),
  // );
  // console.log(pengiriman);
  const { data: pengiriman, refetch } = useSuspenseQuery(
    getPengirimanAktifByDriverIDQueryOptions(),
  );
  return (
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
            <TrackingDriver pengiriman={pengiriman} />
          </div>
        </div>
        <div className=" bg-blue-200">
          <b>Pengiriman Hari Ini</b>
          <PengirimanTableDriver
            sppg_id={driver.driver.sppg.id}
            onUpdate={refetch}
          />
        </div>
      </div>
    </div>
  );
};

export default Driver;
