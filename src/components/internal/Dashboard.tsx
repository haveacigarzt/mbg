import { useSuspenseQueries } from "@tanstack/react-query";
import { getSekolahQueryOptions } from "../../queryOptions/sekolah";
import { getPosyanduQueryOptions } from "../../queryOptions/posyandu";
import Navbar from "./Navbar";
import { getSPPGQueryOptions } from "../../queryOptions/sppg";

const Dashboard = () => {
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
      <div className="flex flex-col gap-3 p-3 w-[85%] bg-red-200">
        <div className="w-full flex gap-3">
          <div className="flex-1 bg-blue-200">
            <b>Data 1</b>
          </div>
          <div className="flex-1 bg-blue-200">
            <b>Data 2</b>
          </div>
          <div className="flex-1 bg-blue-200">
            <b>Data 3</b>
          </div>
        </div>
        <div className="w-full bg-amber-200">
          <b>Map</b>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
