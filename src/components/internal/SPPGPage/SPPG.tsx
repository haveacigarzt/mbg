import { useSuspenseQuery } from "@tanstack/react-query";
import Navbar from "../Navbar";
import { getKecamatanQueryOptions, getKelurahanQueryOptions, getSPPGByIDQueryOptions } from "../../../queryOptions/sppg";
import { Suspense, useState } from "react";
import SekolahTable from "./SekolahTable";
import PosyanduTable from "./PosyanduTable";
import PengirimanTable from "./PengirimanTable";
import DriversTable from "./DriversTable";
import { DialogEditSPPG } from "./Dialog/DialogEditSPPG";
import type { AuthResponse } from "@/types/auth";
import { Building2, MapPin, Phone, Mail, Users, ChefHat, CheckCircle, XCircle } from "lucide-react";

interface Props {
  user: AuthResponse;
}

const SPPG = ({ user }: Props) => {
  const [tab, setTab] = useState("sekolah");
  const { data: sppg, refetch: refetchSPPG } = useSuspenseQuery(getSPPGByIDQueryOptions(user.user.role.id_in_role));
  const { data: kecamatan } = useSuspenseQuery(getKecamatanQueryOptions());
  const { data: kelurahan } = useSuspenseQuery(getKelurahanQueryOptions(sppg.kecamatan_id));

  const tabs = [
    { id: "sekolah", label: "Sekolah" },
    { id: "posyandu", label: "Posyandu" },
    { id: "drivers", label: "Driver" },
    { id: "pengiriman", label: "Pengiriman" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar role_id={3} />

      <div className="ml-[15%] flex-1 p-6 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-black text-gray-800">Halaman SPPG</h1>
          <p className="text-xs text-gray-400 tracking-widest mt-1">MANAJEMEN DATA SATUAN PELAYANAN PEMENUHAN GIZI</p>
        </div>

        {/* Info Card SPPG */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header card */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 rounded-xl p-2">
                <Building2 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-bold text-gray-800">{sppg.nama}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {sppg.status_aktif ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Aktif
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                      <XCircle className="w-3 h-3" /> Nonaktif
                    </span>
                  )}
                </div>
              </div>
            </div>
            <DialogEditSPPG data={sppg} kecamatan={kecamatan} kelurahan={kelurahan} onSPPGUpdate={refetchSPPG} />
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-0 divide-x divide-gray-100">
            {/* Kiri */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 tracking-widest">ALAMAT</p>
                  <p className="text-sm text-gray-700 mt-0.5">{sppg.alamat}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {sppg.kelurahan}, {sppg.kecamatan}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 tracking-widest">KEPALA SPPG</p>
                  <p className="text-sm text-gray-700 mt-0.5">{sppg.kepala_sppg}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 tracking-widest">TELEPON</p>
                  <p className="text-sm text-gray-700 mt-0.5">{sppg.nomor_telepon}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 tracking-widest">EMAIL</p>
                  <p className="text-sm text-gray-700 mt-0.5">{sppg.email}</p>
                </div>
              </div>
            </div>

            {/* Kanan */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <ChefHat className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 tracking-widest">KAPASITAS PRODUKSI</p>
                  <p className="text-sm text-gray-700 mt-0.5">{sppg.kapasitas_porsi.toLocaleString("id-ID")} porsi/hari</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 tracking-widest">KOORDINAT</p>
                  <p className="text-sm text-gray-700 mt-0.5 font-mono">
                    {sppg.latitude}, {sppg.longitude}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 tracking-widest mb-2">MEDIA SOSIAL</p>
                <div className="flex flex-col gap-1">
                  {sppg.sosmed_url.map((url) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate">
                      {url}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tab buttons */}
          <div className="flex border-b border-gray-100">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-3 text-sm font-semibold tracking-wide transition-all
                  ${tab === t.id ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4">
            <Suspense fallback={<div className="flex items-center justify-center py-12 text-gray-300 text-sm">Memuat data...</div>}>
              {tab === "sekolah" && <SekolahTable sppg_id={sppg.id} kelurahan={kelurahan} kecamatan={sppg.kecamatan} kecamatan_id={sppg.kecamatan_id} kelurahan_id={sppg.kelurahan_id} />}
              {tab === "posyandu" && <PosyanduTable sppg_id={sppg.id} kelurahan={kelurahan} kecamatan={sppg.kecamatan} kecamatan_id={sppg.kecamatan_id} kelurahan_id={sppg.kelurahan_id} />}
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
