import { useSuspenseQuery } from "@tanstack/react-query";
import Navbar from "../Navbar";
import {
  getKecamatanQueryOptions,
  getKelurahanQueryOptions,
  getSPPGByIDQueryOptions,
} from "../../../queryOptions/sppg";
import { Suspense, useState } from "react";
import SekolahTable from "./SekolahTable";
import PosyanduTable from "./PosyanduTable";
import PengirimanTable from "./PengirimanTable";
import DriversTable from "./DriversTable";
import { DialogEditSPPG } from "./Dialog/DialogEditSPPG";
import type { AuthResponse } from "@/types/auth";

interface Props {
  user: AuthResponse;
}

const SPPG = ({ user }: Props) => {
  const [tab, setTab] = useState("sekolah");
  const { data: sppg, refetch: refetchSPPG } = useSuspenseQuery(
    getSPPGByIDQueryOptions(user.user.role.id_in_role),
  );
  const { data: kecamatan } = useSuspenseQuery(getKecamatanQueryOptions());
  const { data: kelurahan } = useSuspenseQuery(
    getKelurahanQueryOptions(sppg.kecamatan_id),
  );
  return (
    <div className="flex">
      <Navbar role_id={3} />
      <div className="flex flex-col gap-3 p-3 w-[85%] bg-red-200">
        <div className="p-2 bg-blue-200">
          <div className="flex justify-between items-center pb-2">
            <b>Informasi SPPG</b>
            <DialogEditSPPG
              data={sppg}
              kecamatan={kecamatan}
              kelurahan={kelurahan}
              onSPPGUpdate={refetchSPPG}
            />
          </div>
          <div className="w-full flex">
            <div className="flex-1 ">
              <div>
                <p>Nama: {sppg.nama}</p>
                <p>Alamat: {sppg.alamat}</p>
                <p>Kepala SPPG: {sppg.kepala_sppg}</p>
                <p>Telepon: {sppg.nomor_telepon}</p>
                <p>Email: {sppg.email}</p>
                <p>
                  Lokasi: {sppg.kelurahan}, {sppg.kecamatan}
                </p>
              </div>
            </div>
            <div className="flex-1">
              <div>
                <p>Kapasitas: {sppg.kapasitas_porsi} porsi</p>
                <p>Status: {sppg.status_aktif ? "Aktif" : "Nonaktif"}</p>
                <p>
                  Koordinat: {sppg.latitude}, {sppg.longitude}
                </p>
                <h2>Media Sosial</h2>
                <ul>
                  {sppg.sosmed_url.map((url) => (
                    <li key={url}>
                      <a href={url} target="_blank" rel="noreferrer">
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full p-2 bg-amber-200">
          <div className="w-full flex justify-around mb-2">
            <div>
              <a
                onClick={() => setTab("sekolah")}
                href="#"
                className={`font-medium text-blue-700 hover:underline ${tab === "sekolah" && "underline"}`}
              >
                Sekolah
              </a>
            </div>
            <div>
              <a
                onClick={() => setTab("posyandu")}
                href="#"
                className={`font-medium text-blue-700 hover:underline ${tab === "posyandu" && "underline"}`}
              >
                Posyandu
              </a>
            </div>
            <div>
              <a
                onClick={() => setTab("drivers")}
                href="#"
                className={`font-medium text-blue-700 hover:underline ${tab === "drivers" && "underline"}`}
              >
                Driver
              </a>
            </div>
            <div>
              <a
                onClick={() => setTab("pengiriman")}
                href="#"
                className={`font-medium text-blue-700 hover:underline ${tab === "pengiriman" && "underline"}`}
              >
                Pengiriman
              </a>
            </div>
          </div>
          <div>
            <Suspense fallback={<div>Loading...</div>}>
              {tab === "sekolah" && (
                <SekolahTable
                  sppg_id={sppg.id}
                  kelurahan={kelurahan}
                  kecamatan={sppg.kecamatan}
                  kecamatan_id={sppg.kecamatan_id}
                  kelurahan_id={sppg.kelurahan_id}
                />
              )}
              {tab === "posyandu" && (
                <PosyanduTable
                  sppg_id={sppg.id}
                  kelurahan={kelurahan}
                  kecamatan={sppg.kecamatan}
                  kecamatan_id={sppg.kecamatan_id}
                  kelurahan_id={sppg.kelurahan_id}
                />
              )}
              {tab === "pengiriman" && <PengirimanTable sppg_id={sppg.id} />}
              {tab === "drivers" && <DriversTable sppg_id={sppg.id} />}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SPPG;
