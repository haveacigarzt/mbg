import { useSuspenseQuery } from '@tanstack/react-query';

import Navbar from '../Navbar';
import { ArrowLeft, ClipboardX, HandHeart, PencilIcon } from 'lucide-react';

import { getPesertaDidikByNISNQueryOptions } from '@/queryOptions/penduduk';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

interface Props {
  nisn: string;
}

const DetailPesertaDidik = ({ nisn }: Props) => {
  const { data: peserta_didik } = useSuspenseQuery(getPesertaDidikByNISNQueryOptions(nisn));
  console.log(peserta_didik);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar role_id={6} />

      <div className="ml-[15%] flex-1 p-6 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-black text-gray-800">Halaman Peserta Didik</h1>
          <p className="text-xs text-gray-400 tracking-widest mt-1">MANAJEMEN DATA SEKOLAH PENERIMA MANFAAT</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 rounded-xl p-2">
                <HandHeart className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-bold text-gray-800">Detail Peserta Didik</p>
              </div>
            </div>
            <div className="flex gap-5">
              <Link to="/sekolah/pesertadidik">
                <Button variant="secondary" className="gap-2">
                  <ArrowLeft />
                  Kembali
                </Button>
              </Link>
              <Button className="gap-2">
                <PencilIcon />
                Edit
              </Button>
              <Button variant="destructive" className="gap-2">
                <ClipboardX />
                Nonaktifkan
              </Button>
            </div>
          </div>
          <div>
            <div className="flex justify-around py-5">
              <div>
                <div className="mb-3">
                  <h2 className="font-semibold text-lg">Data Penduduk</h2>
                </div>

                <div className="flex gap-5 space-y-4">
                  <div>
                    <div className="space-y-2">
                      <Label>NIK</Label>
                      <p>{peserta_didik.peserta_didik.penduduk.nik}</p>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-2">
                      <Label>No HP</Label>
                      <p>{peserta_didik.peserta_didik.penduduk.no_hp}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nama</Label>
                      <p>{peserta_didik.peserta_didik.penduduk.nama}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Jenis Kelamin</Label>
                      <p>{peserta_didik.peserta_didik.penduduk.jenis_kelamin}</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal Lahir</Label>
                      <p>{peserta_didik.peserta_didik.penduduk.jenis_kelamin}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Alamat Domisili</Label>
                      <p>{peserta_didik.peserta_didik.penduduk.alamat}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kecamatan">Kecamatan Domisili</Label>
                      <p>Kecamatan</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kelurahan">Kelurahan Domisili</Label>
                      <p>{peserta_didik.peserta_didik.penduduk.kelurahan_nama}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-2/9">
                <div className="mb-3">
                  <h2 className="font-semibold text-lg">Data Ps.D</h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>NISN</Label>
                    <p>{peserta_didik.peserta_didik.peserta_didik.nisn}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Kelas</Label>
                    <p>{peserta_didik.peserta_didik.peserta_didik.kelas}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Rombel</Label>
                    <p>{peserta_didik.peserta_didik.peserta_didik.rombel}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPesertaDidik;
