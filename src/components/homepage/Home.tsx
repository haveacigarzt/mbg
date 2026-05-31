import { useSuspenseQueries } from "@tanstack/react-query";
import { getSekolahQueryOptions } from "../../queryOptions/sekolah";
import { getPosyanduQueryOptions } from "../../queryOptions/posyandu";
import Navbar from "../Navbar";
import { getSPPGQueryOptions } from "../../queryOptions/sppg";

const home = () => {
  const [{ data: sekolah }, { data: posyandu }, { data: sppg }] =
    useSuspenseQueries({
      queries: [
        getSekolahQueryOptions(),
        getPosyanduQueryOptions(),
        getSPPGQueryOptions(),
      ],
    });
  return (
    <div className="flex">
      <Navbar />
      <div className="flex w-[85%] bg-red-200">
        <ul>
          <b>Sekolah (Total: {sekolah.metadata.total_records})</b>
          {sekolah.sekolah.map((el) => (
            <li>{el.nama}</li>
          ))}
        </ul>
        <ul>
          <b>Posyandu (Total: {posyandu.metadata.total_records})</b>
          {posyandu.posyandu.map((el) => (
            <li>{el.nama}</li>
          ))}
        </ul>
        <ul>
          <b>SPPG (Total: {sppg.metadata.total_records})</b>
          {sppg.sppg.map((el) => (
            <li>{el.nama}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default home;
