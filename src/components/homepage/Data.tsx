import { useSuspenseQueries } from '@tanstack/react-query';
import { getSekolahQueryOptions } from '../../queryOptions/sekolah';
import { getPosyanduQueryOptions } from '../../queryOptions/posyandu';
import { getSPPGQueryOptions } from '../../queryOptions/sppg';
import { Link } from '@tanstack/react-router';
import { Users, Utensils, School, Heart } from 'lucide-react';
import KatalogTabs from '@/components/homepage/data/KalatogTabs';
export default function DataPage() {
  const [{ data: sekolah }, { data: posyandu }, { data: sppg }] = useSuspenseQueries({
    queries: [getSekolahQueryOptions(), getPosyanduQueryOptions(), getSPPGQueryOptions()]
  });

  const totalSasaran = sekolah.sekolah.reduce((sum, el) => sum + el.jumlah_siswa, 0);
  const totalBumilBalita = posyandu.posyandu.reduce((sum, el) => sum + el.jumlah_balita + el.jumlah_ibu_hamil, 0);
  return (
    <main className="min-h-screen bg-gray-50 pt-16">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 md:gap-4 px-4 sm:px-6 md:px-8 py-3 md:py-4 bg-white shadow-sm backdrop-blur-md border-b border-gray-100">
        <Link to="/" className="text-gray-400 hover:text-gray-600 transition-colors">
          ←
        </Link>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-blue-600 rounded-lg p-1.5 md:p-2">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <p className="font-bold text-gray-800 text-xs md:text-sm">PORTAL SATU DATA</p>
            <p className="text-gray-400 text-[10px] md:text-xs">SIAP-MBG NEW ERIDU</p>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative bg-[#0f1f3d] px-4 sm:px-6 md:px-8 pt-12 md:pt-16 pb-28 sm:pb-32 md:pb-36">
        {/* Floating card KIRI - disembunyikan di layar kecil biar nggak numpuk sama headline */}
        <div className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 bg-[#1a2f52] rounded-2xl p-5 max-w-[220px]">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-blue-500/20 rounded-lg p-1.5">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase">Akurasi Transparansi</p>
          </div>
          <p className="text-white font-bold text-sm mb-1">REAL-TIME DATA SYNC</p>
          <p className="text-gray-400 text-xs leading-relaxed">METRIK GIZI, SEBARAN SPASIAL, DAN LOGISTIK SEKOLAH TERBARU SECARA INSTAN.</p>
        </div>

        {/* Floating card KANAN - disembunyikan di layar kecil biar nggak numpuk sama headline */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 bg-[#1a2f52] rounded-2xl p-5 max-w-[220px]">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-green-500/20 rounded-lg p-1.5">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <p className="text-green-400 text-xs font-semibold tracking-widest uppercase">Integritas Nasional</p>
          </div>
          <p className="text-white font-bold text-sm mb-1">STANDARDISASI BGN</p>
          <p className="text-gray-400 text-xs leading-relaxed">SISTEM PELAPORAN RESMI YANG TERHUBUNG LANGSUNG DENGAN KEMENTERIAN TERKAIT.</p>
        </div>

        {/* Center content */}
        <div className="flex flex-col items-center text-center gap-4 md:gap-5 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 rounded-full px-3 md:px-4 py-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />
            <p className="text-blue-300 text-[10px] md:text-xs tracking-widest">SINKRONISASI DATA RIIL (REAL-TIME SINK)</p>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">EKSPLORASI DATA TERBUKA</h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-xs md:text-sm tracking-widest leading-relaxed max-w-2xl px-2">
            TEMUKAN, EKSPLORASI, DAN MANFAATKAN DATA STATISTIK SERTA INFORMASI GEOSPASIAL TERKAIT PROGRAM MAKAN BERGIZI GRATIS (MBG) DI WILAYAH KABUPATEN NEW ERIDU SECARA TRANSPARAN DAN AKURAT.
          </p>

          {/* Search bar */}
          <div className="w-full max-w-xl px-2 sm:px-0">
            <input
              type="text"
              placeholder="Cari dataset dapur, nama sekolah, wilayah, atau posyandu..."
              className="w-full bg-[#1a2f52] border border-blue-500/20 rounded-2xl px-4 md:px-6 py-3 md:py-4
                         text-gray-300 placeholder:text-gray-500 text-xs md:text-sm
                         focus:outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* STATS CARD */}
      <section className="relative -mt-14 sm:-mt-16 md:-mt-20 px-4 sm:px-8 md:px-16 lg:px-32 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            {
              icon: <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />,
              iconBg: 'bg-blue-500',
              cardBg: 'bg-blue-200/30 backdrop-blur-md border border-blue-200/40',
              label: 'TOTAL SASARAN',
              value: totalSasaran.toLocaleString('id-ID'),
              sub: 'JIWA TERDAFTAR',
              valueColor: 'text-blue-900'
            },
            {
              icon: <Utensils className="w-5 h-5 md:w-6 md:h-6 text-white" />,
              iconBg: 'bg-orange-500',
              cardBg: 'bg-orange-200/30 backdrop-blur-md border border-orange-200/40',
              label: 'UNIT PRODUKSI',
              value: sppg.metadata.total_records.toString(),
              sub: 'UNIT AKTIF',
              valueColor: 'text-orange-900'
            },
            {
              icon: <School className="w-5 h-5 md:w-6 md:h-6 text-white" />,
              iconBg: 'bg-green-500',
              cardBg: 'bg-green-200/30 backdrop-blur-md border border-green-200/40',
              label: 'SEKOLAH',
              value: sekolah.metadata.total_records.toString(),
              sub: 'TITIK PENERIMA',
              valueColor: 'text-green-900'
            },
            {
              icon: <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />,
              iconBg: 'bg-red-500',
              cardBg: 'bg-red-200/30 backdrop-blur-md border border-red-200/40',
              label: 'POSYANDU (3B)',
              value: totalBumilBalita.toLocaleString('id-ID'),
              sub: 'IBU & BALITA',
              valueColor: 'text-red-900'
            }
          ].map((item, i) => (
            <div
              key={i}
              className={`${item.cardBg} rounded-2xl p-4 md:p-6 shadow-lg flex flex-col gap-2 md:gap-3 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group`}
            >
              <div
                className={`w-9 h-9 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl ${item.iconBg} group-hover:scale-105 group-hover:rotate-12 transition-transform duration-300`}
              >
                {item.icon}
              </div>
              <p className="text-[10px] md:text-xs text-gray-600 tracking-widest">{item.label}</p>
              <p className={`text-xl sm:text-2xl md:text-4xl font-black ${item.valueColor}`}>{item.value}</p>
              <p className="text-[10px] md:text-xs text-gray-600 tracking-widest">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KATALOG SECTION */}
      <KatalogTabs />
    </main>
  );
}
