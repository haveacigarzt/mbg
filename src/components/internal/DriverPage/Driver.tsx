import type { AuthResponse } from "@/types/auth";
import Navbar from "../Navbar";
import { getDriverCurrentQueryOptions } from "@/queryOptions/drivers";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPengirimanQueryOptions } from "@/queryOptions/pengiriman";
import PengirimanTableDriver from "../SPPGPage/PengirimanTableDriver";

interface Props {
  user: AuthResponse;
}

const Driver = ({ user }: Props) => {
  console.log(user);
  const { data: driver } = useSuspenseQuery(getDriverCurrentQueryOptions());
  // const { data: pengiriman } = useSuspenseQuery(
  //   getPengirimanQueryOptions({
  //     tanggal: new Date().toLocaleDateString("sv-SE"),
  //   }),
  // );
  // console.log(pengiriman);
  console.log(driver);
  return (
    <div className="flex">
      <Navbar role_id={4} />
      <div className="flex flex-col gap-3 p-3 w-[85%] bg-red-200">
        <div className=" bg-blue-200">
          <b>Data SPPG</b>
        </div>
        <div className=" bg-blue-200">
          <b>Pengiriman Hari Ini</b>
          <PengirimanTableDriver sppg_id={driver.driver.sppg.id} />
        </div>
      </div>
    </div>
  );
};

export default Driver;
