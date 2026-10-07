import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

import Navbar from '../Navbar';
import { ArrowLeft, ClipboardX, HandHeart, Loader2, PencilIcon } from 'lucide-react';

import { getPendudukByNIKQueryOptions, getPesertaDidikByNISNQueryOptions, getPesertaDidikByPIDQueryOptions } from '@/queryOptions/penduduk';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from '@tanstack/react-router';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import type { PesertaDidikInput, PesertaDidikPatch } from '@/types/sekolah';
import { pendudukPatchSchema, pesertaDidikPatchSchema } from '@/schema/formValidation';
import { toast } from 'sonner';
import { errorToast, successToast } from '@/lib/constants';
import { updatePesertaDidikMutationOptions } from '@/queryOptions/sekolah';
import type { ApiError } from '@/api/client';
import type { AuthResponse } from '@/types/auth';
import { getKecamatanQueryOptions, getKelurahanQueryOptions } from '@/queryOptions/sppg';
import { formatTanggalIndonesia, getChangedFields } from '@/lib/utils';
import { ZodError } from 'zod';
import DialogNonaktifkanPD from './Dialog/DialogNonaktifkanPD';
interface Props {
  pid: string;
  user: AuthResponse;
}

const DetailPesertaDidik = ({ pid, user }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedNIK, setSelectedNIK] = useState('0');
  const [selectedNISN, setSelectedNISN] = useState('0');

  const { data: peserta_didik } = useSuspenseQuery(getPesertaDidikByPIDQueryOptions(pid));

  const { data: selected_peserta_didik } = useSuspenseQuery(getPesertaDidikByNISNQueryOptions(selectedNISN));
  const { data: selected_penduduk } = useSuspenseQuery(getPendudukByNIKQueryOptions(selectedNIK));

  // console.log(peserta_didik);
  const [kecamatanID, setKecamatanID] = useState(peserta_didik.peserta_didik.penduduk.kecamatan_id);

  const { data: kecamatan } = useSuspenseQuery(getKecamatanQueryOptions());
  const { data: kelurahan } = useSuspenseQuery(getKelurahanQueryOptions(kecamatanID));

  const initialForm = {
    penduduk: {
      nik: peserta_didik.peserta_didik.penduduk.nik,
      nama: peserta_didik.peserta_didik.penduduk.nama,
      jenis_kelamin: peserta_didik.peserta_didik.penduduk.jenis_kelamin,
      tanggal_lahir: peserta_didik.peserta_didik.penduduk.tanggal_lahir.split('T')[0],
      kelurahan_id: peserta_didik.peserta_didik.penduduk.kelurahan_id,
      alamat: peserta_didik.peserta_didik.penduduk.alamat,
      no_hp: peserta_didik.peserta_didik.penduduk.no_hp
    },
    peserta_didik: {
      nisn: peserta_didik.peserta_didik.peserta_didik.nisn,
      kelas: peserta_didik.peserta_didik.peserta_didik.kelas,
      rombel: peserta_didik.peserta_didik.peserta_didik.rombel
    }
  };

  const [form, setForm] = useState<PesertaDidikInput>({
    penduduk: {
      nik: peserta_didik.peserta_didik.penduduk.nik,
      nama: peserta_didik.peserta_didik.penduduk.nama,
      jenis_kelamin: peserta_didik.peserta_didik.penduduk.jenis_kelamin,
      tanggal_lahir: peserta_didik.peserta_didik.penduduk.tanggal_lahir.split('T')[0],
      kelurahan_id: peserta_didik.peserta_didik.penduduk.kelurahan_id,
      alamat: peserta_didik.peserta_didik.penduduk.alamat,
      no_hp: peserta_didik.peserta_didik.penduduk.no_hp
    },
    peserta_didik: {
      nisn: peserta_didik.peserta_didik.peserta_didik.nisn,
      kelas: peserta_didik.peserta_didik.peserta_didik.kelas,
      rombel: peserta_didik.peserta_didik.peserta_didik.rombel
    }
  });

  const isDirty = getChangedFields(initialForm, form) as PesertaDidikPatch;

  const resetForm = () => {
    setForm({ ...initialForm });
  };
  const mutation = useMutation({
    ...updatePesertaDidikMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil update peserta didik', {
        style: successToast as React.CSSProperties
      });
      setOpen(false);
    },
    onError: (error: ApiError) => {
      toast.error(error.data.error.nik || error.data.error.nisn || 'Gagal update peserta didik', {
        style: errorToast as React.CSSProperties
      });
    }
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isDirty.penduduk) {
        pendudukPatchSchema.parse(isDirty.penduduk);
      }

      if (isDirty.peserta_didik) {
        pesertaDidikPatchSchema.parse(isDirty.peserta_didik);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        console.log('isDirty: ', isDirty);
        console.log(error);
        const firstError = Object.values(error.flatten().fieldErrors)
          .flat()
          .find((message): message is string => typeof message === 'string');
        if (firstError) {
          toast.error(firstError, {
            style: errorToast as React.CSSProperties
          });
        }
      }

      return;
    }
    try {
      console.log('Patching with: ', isDirty);
      await mutation.mutateAsync({ id: pid, input: isDirty });
    } catch (error: any) {
      console.log(error.data.error);
    }
  };
  const searchNIK = (nik: string) => {
    if (nik.length === 16 && nik != peserta_didik.peserta_didik.penduduk.nik) {
      // console.log(nik, peserta_didik.peserta_didik.penduduk.nik);
      setSelectedNIK(nik);
    } else {
      setSelectedNIK('0');
    }
  };
  const searchNISN = (nisn: string) => {
    if (nisn.length === 10 && nisn != peserta_didik.peserta_didik.peserta_didik.nisn) {
      setSelectedNISN(nisn);
    } else {
      setSelectedNISN('0');
    }
  };

  const navigate = useNavigate();

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

              <Dialog
                open={open}
                onOpenChange={(val) => {
                  setOpen(val);
                  resetForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <PencilIcon />
                    Edit
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
                      <DialogTitle className="text-lg font-semibold">Edit data Peserta Didik</DialogTitle>
                      <DialogDescription>Edit data Peserta Didik (Ps.D) di sekolah anda. Klik simpan saat selesai.</DialogDescription>
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
                                <span className="text-red-600">{selected_penduduk.penduduk ? `NIK ${selected_penduduk.penduduk.penduduk.nik} sudah terdaftar` : ''}</span>
                              </div>
                            </div>
                            <div>
                              <div className="space-y-2">
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
                          <div className="flex gap-5">
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
                                  className="w-80"
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
                                <NativeSelect
                                  id="kecamatan"
                                  onChange={(e) => {
                                    setKecamatanID(Number(e.target.value));
                                    setForm({
                                      ...form,
                                      penduduk: {
                                        ...form.penduduk,
                                        kelurahan_id: ''
                                      }
                                    });
                                  }}
                                  value={kecamatanID}
                                  className="w-full"
                                  required
                                >
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
                                  value={form.penduduk.kelurahan_id || ''}
                                  className="w-full"
                                >
                                  <NativeSelectOption disabled value="" className="text-center">
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
                        <div className="w-2/9">
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
                              <span className="text-red-600">
                                {selected_peserta_didik.peserta_didik ? `Ps.D dengan NISN ${selected_peserta_didik.peserta_didik.peserta_didik.nisn} sudah terdaftar` : ''}
                              </span>
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
                        disabled={mutation.isPending || selected_peserta_didik.peserta_didik || !isDirty}
                        className="bg-blue-600 hover:bg-blue-700
                                           text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                      >
                        {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Simpan'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <DialogNonaktifkanPD
                pid={pid}
                nama={peserta_didik.peserta_didik.penduduk.nama}
                onSuccess={() => {
                  navigate({
                    to: '/sekolah/pesertadidik'
                  });
                }}
              >
                <Button variant="destructive" className="gap-2">
                  <ClipboardX />
                  Nonaktifkan
                </Button>
              </DialogNonaktifkanPD>
            </div>
          </div>
          <div>
            <div className="flex px-6 py-4 gap-3">
              <div className="flex-2 border">
                <div className="border-b p-3 bg-blue-50">
                  <h2 className="font-semibold">Data Penduduk</h2>
                </div>
                <div className="flex p-3">
                  <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground mb-1">NIK</p>
                      <p>{peserta_didik.peserta_didik.penduduk.nik}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground mb-1">Nama</p>
                      <p>{peserta_didik.peserta_didik.penduduk.nama}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground mb-1">Jenis Kelamin</p>
                      <p>{peserta_didik.peserta_didik.penduduk.jenis_kelamin}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground mb-1">Tanggal Lahir</p>
                      <p>{formatTanggalIndonesia(peserta_didik.peserta_didik.penduduk.tanggal_lahir)}</p>
                    </div>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground mb-1">No HP</p>
                      <p>{peserta_didik.peserta_didik.penduduk.no_hp}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground mb-1">Alamat Domisili</p>
                      <p>{peserta_didik.peserta_didik.penduduk.alamat}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground mb-1">Kecamatan Domisili</p>
                      <p>{peserta_didik.peserta_didik.penduduk.kecamatan_nama}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground mb-1">Kelurahan Domisili</p>
                      <p>{peserta_didik.peserta_didik.penduduk.kelurahan_nama}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 border">
                <div className="border-b p-3 bg-blue-50">
                  <h2 className="font-semibold">Data Ps.D</h2>
                </div>
                <div className="space-y-4 p-3">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground mb-1">NISN</p>
                    <p>{peserta_didik.peserta_didik.peserta_didik.nisn}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground mb-1">Kelas</p>
                    <p>{peserta_didik.peserta_didik.peserta_didik.kelas}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground mb-1">Rombel</p>
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
