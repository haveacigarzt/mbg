import {
  useQuery,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { getSekolahQueryOptions } from "../../queryOptions/sekolah";
import { getPosyanduQueryOptions } from "../../queryOptions/posyandu";
import Navbar from "./Navbar";
import { getSPPGQueryOptions } from "../../queryOptions/sppg";
import DashboardMap from "./DashboardMap";
import { getPengirimanQueryOptions } from "@/queryOptions/pengiriman";
import { useEffect, useMemo } from "react";
import { useWebSocket } from "@/contexts/websocket-context";
import { queryClient } from "@/main";
import { getTrackingQueryOptions } from "@/queryOptions/tracking";

interface Props {
  role_id: number;
}

const Dashboard = ({ role_id }: Props) => {
  const [{ data: sekolah }, { data: posyandu }, { data: sppg }] =
    useSuspenseQueries({
      queries: [
        getSekolahQueryOptions(),
        getPosyanduQueryOptions(),
        getSPPGQueryOptions(),
      ],
    });
  const { data: pengiriman, refetch } = useSuspenseQuery(
    getPengirimanQueryOptions({
      status: "berangkat",
    }),
  );

  const pengirimanIds = useMemo(
    () => [...new Set(pengiriman.pengiriman.map((item) => item.id))],
    [pengiriman.pengiriman],
  );

  const { data: tracking } = useQuery(getTrackingQueryOptions(pengirimanIds));

  const { connected, lastMessage } = useWebSocket();

  // console.log("connected: ", connected);

  useEffect(() => {
    // console.log("lastMessage: ", lastMessage);
    if (!lastMessage) return;

    if (lastMessage.type === "pengiriman:update") {
      console.log("pengiriman update: ", lastMessage.data);
      queryClient.invalidateQueries({
        queryKey: ["pengiriman"],
      });
      if (lastMessage.status !== "berangkat") {
        console.log("invalidating tracking");
        queryClient.setQueriesData({ queryKey: ["tracking"] }, (old: any) => {
          if (!old?.tracking) return old;

          const exists = old.tracking.some(
            (t: any) => t.pengiriman_id === lastMessage.data.pengiriman_id,
          );

          if (exists) {
            return {
              ...old,
              tracking: old.tracking.filter(
                (e: any) => e.pengiriman_id !== lastMessage.data.pengiriman_id,
              ),
            };
          }

          return {
            ...old,
          };
        });
      }
    }
    if (lastMessage.type === "tracking:created") {
      queryClient.setQueriesData({ queryKey: ["tracking"] }, (old: any) => {
        if (!old?.tracking) return old;

        const exists = old.tracking.some(
          (t: any) => t.pengiriman_id === lastMessage.data.pengiriman_id,
        );

        if (exists) {
          return {
            ...old,
            tracking: old.tracking.map((t: any) =>
              t.pengiriman_id === lastMessage.data.pengiriman_id
                ? lastMessage.data
                : t,
            ),
          };
        }

        return {
          ...old,
          tracking: [lastMessage.data, ...old.tracking],
        };
      });
    }
  }, [lastMessage]);
  return (
    <div className="flex">
      <Navbar role_id={role_id} />
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
        <div className="flex w-full h-150 bg-amber-200">
          <div className="flex-3">
            <DashboardMap tracking={tracking?.tracking} />
          </div>
          <div className="flex-1">
            Pengiriman Aktif:
            <ul>
              {pengiriman.pengiriman.map((el) => (
                <li className="mb-2" key={el.id}>
                  {el.sppg_nama} (Driver: {el.driver_nama}) menuju ke{" "}
                  {el.tujuan_nama}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
