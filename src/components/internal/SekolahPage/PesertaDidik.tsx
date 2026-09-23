import type { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { createPesertaDidikMutationOptions, getPesertaDidikQueryOptions } from '@/queryOptions/sekolah';
import { pendudukSchema, pesertaDidikSchema } from '@/schema/formValidation';
import type { PesertaDidikInput } from '@/types/sekolah';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { errorToast, successToast } from '@/lib/constants';
import { toast } from 'sonner';
import type { AuthResponse } from '@/types/auth';
import Navbar from '../Navbar';
import { HandHeart, Loader2, Plus } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getKecamatanQueryOptions, getKelurahanQueryOptions } from '@/queryOptions/sppg';
import { getPendudukByNIKQueryOptions, getPesertaDidikByNISNQueryOptions } from '@/queryOptions/penduduk';
import PesertaDidikTable from './PesertaDidikTable';
import type { SortingState } from '@tanstack/react-table';

interface Props {
  user: AuthResponse;
}

const PesertaDidik = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PesertaDidikInput>({
    penduduk: {
      nik: '',
      nama: '',
      jenis_kelamin: 'L',
      tanggal_lahir: '',
      kelurahan_id: 0,
      alamat: '',
      no_hp: ''
    },
    peserta_didik: {
      nisn: '',
      kelas: '',
      rombel: ''
    }
  });
  const [hideForm, setHideForm] = useState(false);
  const [pesan, setPesan] = useState('');

  const [selectedNIK, setSelectedNIK] = useState('0');
  const [selectedNISN, setSelectedNISN] = useState('0');

  const [kecamatanID, setKecamatanID] = useState(0);

  const mutation = useMutation({
    ...createPesertaDidikMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil menambahkan peserta didik.', {
        style: successToast as React.CSSProperties
      });
      setHideForm(false);
      setOpen(false);
      resetForm('');
      refetch();
    },
    onError: (error: ApiError) => {
      toast.error(error.data.error.nik || error.data.error.nisn || 'Gagal menambahkan peserta didik.', {
        style: errorToast as React.CSSProperties
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result0 = pendudukSchema.safeParse(form.penduduk);
    if (!result0.success) {
      const firstError = Object.values(result0.error.flatten().fieldErrors).flat()[0];

      if (firstError) {
        toast.error(firstError, {
          style: errorToast as React.CSSProperties
        });
      }
      return;
    }
    const result1 = pesertaDidikSchema.safeParse(form.peserta_didik);
    if (!result1.success) {
      const firstError = Object.values(result1.error.flatten().fieldErrors).flat()[0];

      if (firstError) {
        toast.error(firstError, {
          style: errorToast as React.CSSProperties
        });
      }
      return;
    }
    try {
      await mutation.mutateAsync({ sekolah_id: user.user.role.id_in_role, input: form });
    } catch (error: any) {
      console.log(error.data.error);
    }
  };

  const resetForm = (nik: string) => {
    setKecamatanID(0);
    setForm({
      penduduk: {
        nik: nik,
        nama: '',
        jenis_kelamin: 'L',
        tanggal_lahir: '',
        kelurahan_id: 0,
        alamat: '',
        no_hp: ''
      },
      peserta_didik: {
        nisn: '',
        kelas: '',
        rombel: ''
      }
    });
  };

  const searchNIK = (nik: string) => {
    if (nik.length === 16) {
      setSelectedNIK(nik);
    } else {
      setHideForm(false);
      resetForm(nik);
    }
  };

  const searchNISN = (nisn: string) => {
    if (nisn.length === 10) {
      setSelectedNISN(nisn);
    }
  };

  const [page, setPage] = useState(1);
  const page_size = 10;
  const [sorting, setSorting] = useState<SortingState>([]);
  const sort = sorting[0] ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}` : '';

  const { data, refetch } = useSuspenseQuery(getPesertaDidikQueryOptions(user.user.role.id_in_role, { page, page_size, sort }));
  // console.log(data);
  // const { data: sekolah } = useSuspenseQuery(getSekolahByIDQueryOptions(user.user.role.id_in_role));
  // console.log('sekolah', sekolah);
  const { data: kecamatan } = useSuspenseQuery(getKecamatanQueryOptions());
  const { data: kelurahan } = useSuspenseQuery(getKelurahanQueryOptions(kecamatanID));
  // console.log('kelurahan', kelurahan);

  const { data: penduduk } = useSuspenseQuery(getPendudukByNIKQueryOptions(selectedNIK));

  const { data: peserta_didik } = useSuspenseQuery(getPesertaDidikByNISNQueryOptions(selectedNISN));

  useEffect(() => {
    if (penduduk.penduduk) {
      console.log(penduduk.penduduk);
      if (!penduduk.penduduk.peserta_didik?.status_aktif) {
        setKecamatanID(penduduk.penduduk.penduduk.kecamatan_id);
        setForm({
          ...form,
          penduduk: {
            ...form.penduduk,
            nama: penduduk.penduduk.penduduk.nama,
            jenis_kelamin: penduduk.penduduk.penduduk.jenis_kelamin,
            tanggal_lahir: penduduk.penduduk.penduduk.tanggal_lahir.split('T')[0],
            kelurahan_id: penduduk.penduduk.penduduk.kelurahan_id,
            alamat: penduduk.penduduk.penduduk.alamat,
            no_hp: penduduk.penduduk.penduduk.no_hp
          },
          peserta_didik: {
            nisn: penduduk.penduduk.peserta_didik?.nisn || '',
            kelas: penduduk.penduduk.peserta_didik?.kelas || '',
            rombel: penduduk.penduduk.peserta_didik?.rombel || ''
          }
        });
      } else {
        setHideForm(true);
        const nama = penduduk.penduduk.penduduk.nama;
        const nik = penduduk.penduduk.penduduk.nik;
        const sekolah = penduduk.penduduk.peserta_didik.sekolah_nama;
        setPesan(`${nama} (${nik}) saat ini terdaftar sebagai PESERTA DIDIK penerima manfaat aktif di ${sekolah}`);
        return;
      }
      if (penduduk.penduduk.balita?.status_aktif === false || penduduk.penduduk.bumil?.status_aktif === false || penduduk.penduduk.busui?.status_aktif === false) {
        // console.log(penduduk.penduduk.balita?.status_aktif);
        setKecamatanID(penduduk.penduduk.penduduk.kecamatan_id);
        setForm({
          ...form,
          penduduk: {
            ...form.penduduk,
            nama: penduduk.penduduk.penduduk.nama,
            jenis_kelamin: penduduk.penduduk.penduduk.jenis_kelamin,
            tanggal_lahir: penduduk.penduduk.penduduk.tanggal_lahir.split('T')[0],
            kelurahan_id: penduduk.penduduk.penduduk.kelurahan_id,
            alamat: penduduk.penduduk.penduduk.alamat,
            no_hp: penduduk.penduduk.penduduk.no_hp
          }
        });
      } else {
        setHideForm(true);
        const nama = penduduk.penduduk.penduduk.nama;
        const nik = penduduk.penduduk.penduduk.nik;
        const kategori = penduduk.penduduk.penduduk.kategori;
        const posyandu = penduduk.penduduk.balita?.posyandu_nama || penduduk.penduduk.bumil?.posyandu_nama || penduduk.penduduk.busui?.posyandu_nama;
        setPesan(`${nama} (${nik}) saat ini terdaftar sebagai ${kategori} penerima manfaat aktif di ${posyandu}`);
      }
    } else {
      setHideForm(false);
      setKecamatanID(0);
      setForm({
        ...form,
        penduduk: {
          ...form.penduduk,
          nama: '',
          jenis_kelamin: 'L',
          tanggal_lahir: '',
          kelurahan_id: 0,
          alamat: '',
          no_hp: ''
        },
        peserta_didik: {
          nisn: '',
          kelas: '',
          rombel: ''
        }
      });
    }
  }, [penduduk]);

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
                <p className="font-bold text-gray-800">Peserta Didik</p>
              </div>
            </div>
            <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus />
                  Tambah
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-4xl
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0
            data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95
            data-[state=open]:zoom-in-95
            duration-300
          "
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <DialogHeader className="gap-0">
                    <DialogTitle className="text-lg font-semibold">Tambah data Peserta Didik Baru</DialogTitle>
                    <DialogDescription>Tambah data Peserta Didik (Ps.D) baru di sekolah anda. Klik simpan saat selesai.</DialogDescription>
                  </DialogHeader>
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
                              <Input
                                minLength={16}
                                maxLength={16}
                                required
                                value={form.penduduk.nik}
                                onChange={(e) => {
                                  setForm({
                                    ...form,
                                    penduduk: {
                                      ...form.penduduk,
                                      nik: e.target.value
                                    }
                                  });
                                  searchNIK(e.target.value);
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className={hideForm ? 'hidden' : 'space-y-2'}>
                              <Label>No HP</Label>
                              <Input
                                required
                                minLength={10}
                                maxLength={13}
                                value={form.penduduk.no_hp}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    penduduk: {
                                      ...form.penduduk,
                                      no_hp: e.target.value
                                    }
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className={hideForm ? 'hidden' : 'flex gap-5'}>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Nama</Label>
                              <Input
                                required
                                minLength={3}
                                maxLength={60}
                                value={form.penduduk.nama}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    penduduk: {
                                      ...form.penduduk,
                                      nama: e.target.value
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Jenis Kelamin</Label>
                              <NativeSelect
                                value={form.penduduk.jenis_kelamin}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    penduduk: {
                                      ...form.penduduk,
                                      jenis_kelamin: e.target.value as 'L' | 'P'
                                    }
                                  })
                                }
                              >
                                <NativeSelectOption value="L">Laki-laki</NativeSelectOption>
                                <NativeSelectOption value="P">Perempuan</NativeSelectOption>
                              </NativeSelect>
                            </div>
                            <div className="space-y-2">
                              <Label>Tanggal Lahir</Label>
                              <Input
                                required
                                type="date"
                                value={form.penduduk.tanggal_lahir}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    penduduk: {
                                      ...form.penduduk,
                                      tanggal_lahir: e.target.value
                                    }
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Alamat Domisili</Label>
                              <Textarea
                                required
                                minLength={5}
                                maxLength={150}
                                value={form.penduduk.alamat}
                                rows={4}
                                cols={30}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    penduduk: {
                                      ...form.penduduk,
                                      alamat: e.target.value
                                    }
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="kecamatan">Kecamatan Domisili</Label>
                              <NativeSelect id="kecamatan" onChange={(e) => setKecamatanID(Number(e.target.value))} value={kecamatanID || 0} className="w-full" required>
                                <NativeSelectOption disabled value={0} className="text-center">
                                  --- Pilih Kecamatan ---
                                </NativeSelectOption>
                                {kecamatan.map((el) => (
                                  <NativeSelectOption key={el.id} value={el.id}>
                                    {el.name}
                                  </NativeSelectOption>
                                ))}
                              </NativeSelect>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="kelurahan">Kelurahan Domisili</Label>
                              <NativeSelect
                                required
                                id="kelurahan"
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    penduduk: {
                                      ...form.penduduk,
                                      kelurahan_id: Number(e.target.value)
                                    }
                                  })
                                }
                                value={form.penduduk.kelurahan_id || 0}
                                className="w-full"
                              >
                                <NativeSelectOption disabled value="0" className="text-center">
                                  --- Pilih Kelurahan ---
                                </NativeSelectOption>
                                {kelurahan.map((el) => (
                                  <NativeSelectOption key={el.id} value={el.id}>
                                    {el.name}
                                  </NativeSelectOption>
                                ))}
                              </NativeSelect>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={hideForm ? 'hidden' : 'w-2/9'}>
                        <div className="mb-3">
                          <h2 className="font-semibold text-lg">Data Ps.D</h2>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>NISN</Label>
                            <Input
                              required
                              minLength={10}
                              maxLength={10}
                              value={form.peserta_didik.nisn}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  peserta_didik: {
                                    ...form.peserta_didik,
                                    nisn: e.target.value
                                  }
                                });
                                searchNISN(e.target.value);
                              }}
                            />
                            <span className="text-red-600">{peserta_didik.peserta_didik ? `Ps.D dengan NISN ${peserta_didik.peserta_didik.peserta_didik.nisn} sudah terdaftar` : ''}</span>
                          </div>

                          <div className="space-y-2">
                            <Label>Kelas</Label>
                            <Input
                              required
                              minLength={1}
                              maxLength={5}
                              value={form.peserta_didik.kelas}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  peserta_didik: {
                                    ...form.peserta_didik,
                                    kelas: e.target.value
                                  }
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Rombel</Label>
                            <Input
                              required
                              minLength={1}
                              maxLength={10}
                              value={form.peserta_didik.rombel}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  peserta_didik: {
                                    ...form.peserta_didik,
                                    rombel: e.target.value
                                  }
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className={hideForm ? 'w-2/3' : 'hidden'}>{pesan}</div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                        Batal
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      disabled={mutation.isPending || hideForm || peserta_didik.peserta_didik}
                      className="bg-blue-600 hover:bg-blue-700
                             text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                    >
                      {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Simpan'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <PesertaDidikTable pesertaDidik={data.peserta_didik} setPage={setPage} page={page} sorting={sorting} setSorting={setSorting} metadata={data.metadata} refetch={refetch} />
        </div>
      </div>
    </div>
  );
};

export default PesertaDidik;
