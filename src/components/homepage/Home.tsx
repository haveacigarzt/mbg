import { useSuspenseQueries } from "@tanstack/react-query";
import { getSekolahQueryOptions } from "../../queryOptions/sekolah";
import { getPosyanduQueryOptions } from "../../queryOptions/posyandu";
import { getSPPGQueryOptions } from "../../queryOptions/sppg";
import { Link } from "@tanstack/react-router";

const home = () => {
  const [{ data: sekolah }, { data: posyandu }, { data: sppg }] =
    useSuspenseQueries({
      queries: [
        getSekolahQueryOptions(),
        getPosyanduQueryOptions(),
        getSPPGQueryOptions(),
      ],
    });
  // Untuk liat data
  console.log("Sekolah", sekolah);
  console.log("Posyandu", posyandu);
  console.log("SPPG", sppg);
  return (
    <div className="flex">
      <main className="min-h-screen bg-gray-50 pt-32">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-5 bg-white/70 shadow-sm backdrop-blur-md border-b border-white/20">
          <div>
            <p className="text-blue-600 font-bold text-lg">SIAP-MBG</p>
            <p className="text-gray-500 text-xs">BGN NEW ERIDU</p>
          </div>
          <div className="flex items-center gap-10">
            <a
              href="#stats"
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              STATISTIK
            </a>
            <a
              href="#feature"
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              PROGRAM
            </a>
            <Link
              to="/data"
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              DATA TERBUKA
            </Link>
            <a
              href="#contact"
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              KONTAK
            </a>
            <Link to="/login">
              <button className="border border-blue-600 text-blue-600 text-sm px-5 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                LOGIN OPERATOR
              </button>
            </Link>
          </div>
        </nav>

        {/* QUOTE CARDS */}
        <section className="flex justify-center gap-12 px-16 py-12">
          <div className="bg-white rounded-2xl shadow-sm py-10 px-6 flex gap-4 max-w-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
            <img
              src="https://i.pinimg.com/1200x/78/1d/d3/781dd31d9eb409989ab342650dc72a29.jpg"
              alt="placeholder"
              className="w-20 h-24 object-cover rounded-lg"
            />
            <div>
              <p className="font-bold text-gray-800">JOHN DOE</p>
              <p className="text-blue-500 text-xs mb-2">
                NEW ERIDIAN REPUBLIC PRESIDENT
              </p>
              <p className="text-gray-500 text-sm italic">
                &quot;Makan Bergizi Gratis adalah investasi strategis untuk
                mencetak Generasi Emas Indonesia.&quot;
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm py-10 px-6 flex gap-4 max-w-md transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
            <img
              src="https://i.pinimg.com/736x/52/51/6b/52516b29fe96104dca47c38b4e763267.jpg"
              alt="placeholder"
              className="w-20 h-24 object-cover rounded-lg"
            />
            <div>
              <p className="font-bold text-gray-800">JANE DOE</p>
              <p className="text-green-500 text-xs mb-2">
                NEW ERIDIAN REPUBLIC VICE PRESIDENT
              </p>
              <p className="text-gray-500 text-sm italic">
                &quot;Pemanfaatan teknologi digital menjamin transparansi
                program setiap porsi sampai tepat sasaran.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* HERO SECTION */}
        <section
          id="hero"
          className="flex flex-col items-center text-center px-16 py-8 gap-6"
        >
          <span className="text-xs text-cyan-500 border border-cyan-300 rounded-full px-4 py-1">
            #GENERASIEMASNEWERIDU
          </span>

          <h1 className="text-6xl font-black text-gray-900 leading-tight max-w-2xl">
            MEMBANGUN <span className="text-blue-600 italic">MASA DEPAN</span>{" "}
            MELALUI GIZI SEIMBANG.
          </h1>

          <p className="text-gray-500 max-w-lg">
            Portal resmi transparansi Program Makan Bergizi Gratis (MBG) di
            Kabupaten New Eridu. Memastikan setiap anak mendapatkan nutrisi
            terbaik secara terukur dan digital.
          </p>

          <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all flex items-center gap-2">
            LIHAT DATA REAL-TIME →
          </button>
        </section>

        {/* HERO IMAGE SECTION */}
        <section id="sub-hero" className="px-64 py-8 mt-4">
          <div className="relative overflow-hidden rounded-3xl group cursor-pointer">
            {/* IMAGE dengan zoom effect on hover */}
            <img
              src="https://i.pinimg.com/736x/0b/62/73/0b62737af35565e0e95e787bc2cebedc.jpg"
              alt="Hero"
              className="w-full h-[500px] object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            />

            {/* Overlay gelap tipis */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-700" />

            {/* Floating card STATUS DISTRIBUSI */}
            <div className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-lg px-5 py-4 flex items-center gap-3">
              <div className="bg-green-100 rounded-xl p-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  Status Distribusi
                </p>
                <p className="text-sm font-bold text-gray-800">
                  98.4% Tepat Waktu
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section id="stats" className="py-24 px-16 bg-gray-50">
          {/* Header */}
          <div className="flex flex-col items-center mb-16">
            <p className="text-blue-500 text-xs font-semibold tracking-widest mb-3">
              TRANSPARANSI DATA
            </p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              JANGKAUAN PROGRAM SAAT INI
            </h2>
            <div className="w-16 h-1 bg-blue-600 rounded-full" />
          </div>

          {/* Cards */}
          <div className="flex items-center justify-center gap-6 mb-12">
            {/* Card 1 - Total Sasaran */}
            <div
              className="bg-white rounded-3xl p-10 flex flex-col items-center gap-4 shadow-sm
                    hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="bg-red-100 rounded-2xl p-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <p className="text-4xl font-black text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                16,241
              </p>
              <div className="w-10 h-0.5 bg-blue-300 rounded-full group-hover:w-15 group-hover:h-1 group-hover:bg-shadow-blue-500 transition-all duration-300" />
              <p className="text-xs text-gray-400 tracking-widest uppercase">
                Total Sasaran Jiwa
              </p>
            </div>

            {/* Card 2 - Sekolah */}
            <div
              className="bg-white rounded-3xl p-10 flex flex-col items-center gap-4 shadow-sm
                    hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="bg-blue-100 rounded-2xl p-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                </svg>
              </div>
              <p className="text-4xl font-black text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                98
              </p>
              <div className="w-10 h-0.5 bg-blue-300 rounded-full group-hover:w-15 group-hover:h-1 group-hover:bg-shadow-blue-500 transition-all duration-300" />
              <p className="text-xs text-gray-400 tracking-widest uppercase">
                Sekolah Penerima
              </p>
            </div>

            {/* Card 3 - Unit Produksi */}
            <div
              className="bg-white rounded-3xl p-10 flex flex-col items-center gap-4 shadow-sm
                    hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              <div className="bg-orange-100 rounded-2xl p-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-4xl font-black text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                6
              </p>
              <div className="w-10 h-0.5 bg-blue-300 rounded-full group-hover:w-15 group-hover:h-1 group-hover:bg-shadow-blue-500 transition-all duration-300" />
              <p className="text-xs text-gray-400 tracking-widest uppercase">
                Unit Produksi Aktif
              </p>
            </div>

            {/* Card 4 - Distrik */}
            <div
              className="bg-white rounded-3xl p-10 flex flex-col items-center gap-4 shadow-sm
                    hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="bg-green-100 rounded-2xl p-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="text-4xl font-black text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                7
              </p>
              <div className="w-10 h-0.5 bg-blue-300 rounded-full group-hover:w-15 group-hover:h-1 group-hover:bg-shadow-blue-500 transition-all duration-300" />
              <p className="text-xs text-gray-400 tracking-widest uppercase">
                Distrik Terjangkau
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link to="/data">
              <button
                className="flex items-center gap-2 border border-blue-200 text-blue-500 px-8 py-4 rounded-full
                       hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 text-sm font-semibold"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                LIHAT DATA LENGKAP & ANALISIS
              </button>
            </Link>
          </div>
        </section>

        {/* FEATURE SECTION */}
        <section id="feature" className="px-32 py-24 bg-white">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center gap-20">
              {/* KIRI GAMBAR DAN CARD*/}
              <div className="relative flex-1">
                {/* Gambar */}
                <img
                  src="https://i.pinimg.com/736x/94/23/b6/9423b6240a9c6cb6619d437b18c4cf10.jpg"
                  alt="Dapur Produksi"
                  className="w-[500px] h-[500px] object-cover rounded-3xl border-8 border-gray-200 shadow-xl"
                />

                {/* Floating card */}
                <div className="absolute top-4 right-1 bg-white rounded-2xl shadow-xl p-4 max-w-[200px] border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-blue-100 rounded-lg p-1.5">
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Standar Gizi
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                    MENU DIAWASI AHLI GIZI UNTUK MEMENUHI AKG HARIAN.
                  </p>
                </div>
              </div>
              {/* KANAN */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Label */}
                <p className="text-blue-500 text-xs font-semibold tracking-widest uppercase">
                  Standar Nutrisi
                </p>

                {/* Headline */}
                <h2 className="text-4xl font-black text-gray-900 leading-tight">
                  LEBIH DARI SEKADAR{" "}
                  <span className="text-blue-600 italic">MAKAN GRATIS.</span>
                </h2>

                {/* Deskripsi */}
                <p className="text-gray-500 leading-relaxed">
                  Program SIAP-MBG New Eridu menerapkan standar operasional yang
                  ketat. Mulai dari pemilihan bahan baku lokal hingga proses
                  pengiriman menggunakan sistem monitoring berbasis GPS.
                </p>

                {/* Feature list */}
                <div className="flex flex-col gap-6 mt-2">
                  {/* Item 1 */}
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 rounded-xl p-3 shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm tracking-wide">
                        BAHAN BAKU LOKAL
                      </p>
                      <p className="text-xs text-gray-400 tracking-widest mt-1">
                        MEMPRIORITASKAN HASIL TANI DAN TERNAK MASYARAKAT NEW
                        ERIDU.
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100" />

                  {/* Item 2 */}
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 rounded-xl p-3 shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm tracking-wide">
                        HIGIENITAS TERJAMIN
                      </p>
                      <p className="text-xs text-gray-400 tracking-widest mt-1">
                        DAPUR PRODUKSI BERSTANDAR SANITASI NASIONAL.
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100" />

                  {/* Item 3 */}
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 rounded-xl p-3 shrink-0">
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm tracking-wide">
                        MONITORING DIGITAL
                      </p>
                      <p className="text-xs text-gray-400 tracking-widest mt-1">
                        PELAPORAN REAL-TIME UNTUK TRANSPARANSI PUBLIK.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TAGLINE SECTION */}
        <section id="contact" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-8">
            <div className="bg-blue-500 rounded-4xl py-16 px-8 flex flex-col items-center text-center gap-6">
              <h2 className="text-4xl font-black text-white leading-tight max-w-3xl">
                BERSAMA WUJUDKAN NEW ERIDU SEHAT & CERDAS.
              </h2>
              <p className="text-blue-100 text-xs tracking-widest max-w-lg">
                HUBUNGI KAMI UNTUK INFORMASI LEBIH LANJUT MENGENAI KEMITRAAN
                VENDOR ATAU MASUKAN PROGRAM.
              </p>
              <button className="bg-white text-gray-800 font-bold text-small px-10 py-4 rounded-full hover:bg-blue-300 transition-all duration-300 tracking-widest mt-2">
                HUBUNGI KAMI
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer
          id="footer"
          className="bg-white border-t border-gray-100 py-6 px-32"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 tracking-widest">
              © 2026 BGN NEW ERIDU • SIAP-MBG • POWERED BY
            </p>
            <div className="flex items-center gap-8">
              <a
                href="#"
                className="text-xs text-gray-400 tracking-widest hover:text-blue-500 transition-colors"
              >
                PRIVACY POLICY
              </a>
              <a
                href="#"
                className="text-xs text-gray-400 tracking-widest hover:text-blue-500 transition-colors"
              >
                TERMS OF SERVICE
              </a>
              <a
                href="#"
                className="text-xs text-gray-400 tracking-widest hover:text-blue-500 transition-colors"
              >
                HELP CENTER
              </a>
            </div>
          </div>
        </footer>
        <div className=" bg-red-200">
          Routes khusus user:
          <div className="flex gap-5 mb-2">
            <Link
              to="/dashboard"
              className="font-medium text-blue-700 hover:underline"
            >
              Dashboard
            </Link>
            <Link
              to="/sppg"
              className="font-medium text-blue-700 hover:underline"
            >
              SPPG
            </Link>
          </div>
          Data publik (liat properti/tipe data di folder types)
          <div className="flex">
            <ul>
              <b>Sekolah (Total: {sekolah.metadata.total_records})</b>
              {sekolah.sekolah.map((el) => (
                <li key={el.id}>{el.nama}</li>
              ))}
            </ul>
            <ul>
              <b>Posyandu (Total: {posyandu.metadata.total_records})</b>
              {posyandu.posyandu.map((el) => (
                <li key={el.id}>{el.nama}</li>
              ))}
            </ul>
            <ul>
              <b>SPPG (Total: {sppg.metadata.total_records})</b>
              {sppg.sppg.map((el) => (
                <li key={el.id}>{el.nama}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default home;
