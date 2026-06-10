import { useSuspenseQueries } from "@tanstack/react-query";
import { getSekolahQueryOptions } from "../../queryOptions/sekolah";
import { getPosyanduQueryOptions } from "../../queryOptions/posyandu";
import { getSPPGQueryOptions } from "../../queryOptions/sppg";
import { Users, UtensilsCrossed, School, Heart } from "lucide-react";
import Navbar from "./Navbar";

interface Props {
  role_id: number;
}

const Dashboard = ({ role_id }: Props) => {
  const [{ data: sekolah }, { data: posyandu }, { data: sppg }] = useSuspenseQueries({
    queries: [getSekolahQueryOptions(), getPosyanduQueryOptions(), getSPPGQueryOptions()],
  });

  const totalSasaran = sekolah.sekolah.reduce((sum, el) => sum + el.jumlah_siswa, 0);
  const totalIbuBalita = posyandu.posyandu.reduce((sum, el) => sum + el.jumlah_balita + el.jumlah_ibu_hamil, 0);

  const stats = [
    {
      icon: <Users className="w-5 h-5 text-blue-500" />,
      iconBg: "bg-blue-50",
      label: "Total Sasaran",
      value: totalSasaran.toLocaleString("id-ID"),
      sub: "Jiwa Terdaftar",
      border: "border-blue-100",
    },
    {
      icon: <School className="w-5 h-5 text-green-500" />,
      iconBg: "bg-green-50",
      label: "Sekolah",
      value: sekolah.metadata.total_records.toLocaleString("id-ID"),
      sub: "Titik Penerima",
      border: "border-green-100",
    },
    {
      icon: <UtensilsCrossed className="w-5 h-5 text-orange-500" />,
      iconBg: "bg-orange-50",
      label: "Unit Produksi",
      value: sppg.metadata.total_records.toLocaleString("id-ID"),
      sub: "SPPG Aktif",
      border: "border-orange-100",
    },
    {
      icon: <Heart className="w-5 h-5 text-red-400" />,
      iconBg: "bg-red-50",
      label: "Posyandu (3B)",
      value: totalIbuBalita.toLocaleString("id-ID"),
      sub: "Ibu & Balita",
      border: "border-red-100",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar role_id={role_id} />

      {/* Konten utama — offset navbar */}
      <div className="ml-[15%] flex-1 p-6 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-black text-gray-800">Dashboard</h1>
          <p className="text-xs text-gray-400 tracking-widest mt-1">RINGKASAN DATA PROGRAM MBG — NEW ERIDU</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((item, i) => (
            <div key={i} className={`bg-white rounded-2xl p-5 border ${item.border} flex flex-col gap-3 shadow-sm`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconBg}`}>{item.icon}</div>
              <div>
                <p className="text-xs text-gray-400 tracking-widest uppercase">{item.label}</p>
                <p className="text-3xl font-black text-gray-800 mt-1">{item.value}</p>
                <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Map placeholder */}
        <div className="bg-white rounded-2xl border border-gray-100 flex-1 flex items-center justify-center min-h-64 shadow-sm">
          <p className="text-gray-300 text-sm">Map akan ditampilkan di sini</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
