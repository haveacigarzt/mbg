import type { CreateSPPGByInvitationRequest, SPPGInvitation } from '@/types/sppg_invitations';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { NativeSelect, NativeSelectOption } from '../ui/native-select';
import { useState } from 'react';
import { Label } from '../ui/label';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getKecamatanQueryOptions, getKelurahanQueryOptions } from '@/queryOptions/sppg';
import { Button } from '../ui/button';
import { AlertCircleIcon, Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/api/client';
import { errorToast, successToast } from '@/lib/constants';
import { sppgNewSchema } from '@/schema/formValidation';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { createSPPGByInvitationMutationOptions } from '@/queryOptions/sppg_invitations';
import RegisterSuccess from './RegisterSuccess';

interface Props {
  invitation: SPPGInvitation;
}

const Register = ({ invitation }: Props) => {
  const { data: kecamatan } = useQuery(getKecamatanQueryOptions());
  const { data: kelurahan } = useQuery(getKelurahanQueryOptions(1));
  // const initialForm = {
  //   nama: invitation.nama_sppg,
  //   alamat: '',
  //   kepala_sppg: '',
  //   nomor_telepon: '',
  //   email: '',
  //   kelurahan_id: 0,
  //   kecamatan_id: 0,
  //   kapasitas_porsi: '',
  //   latitude: '',
  //   longitude: '',
  //   sosmed_url: [] as string[],
  //   username: '',
  //   email_user: '',
  //   password: '',
  //   konfirmasi_password: '' as string | undefined
  // };
  const initialForm = {
    nama: invitation.nama_sppg,
    alamat: 'Jl. Ahmad Yani No. 123, Pontianak',
    kepala_sppg: 'Budi Santoso',
    nomor_telepon: '081234567890',
    email: 'sppg@example.com',
    kelurahan_id: 1,
    kecamatan_id: 1,
    kapasitas_porsi: '1500',
    latitude: '-0.026330',
    longitude: '109.342504',
    sosmed_url: ['https://instagram.com/sppg_pontianak', 'https://facebook.com/sppg.pontianak'],
    email_user: 'admin@sppg.example.com',
    password: 'Password123!',
    konfirmasi_password: 'Password123!' as string | undefined
  };
  const [currentEmail, setCurrentEmail] = useState('');
  const [isErrorEmail, setIsErrorEmail] = useState(false);

  const [form, setForm] = useState(initialForm);

  function updateField(field: string, value: any) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }
  const { data: kelurahanNew } = useQuery({
    ...getKelurahanQueryOptions(form.kecamatan_id),
    enabled: form.kecamatan_id !== null,
    initialData: kelurahan
  });

  function updateKelurahan(id: number) {
    updateField('kecamatan_id', id);
  }
  const [getLocLoading, setGetLocLoading] = useState(false);

  async function getLocation() {
    setGetLocLoading(true);
    type Location = {
      latitude: number;
      longitude: number;
    };
    async function getLocation(): Promise<Location> {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            resolve({
              latitude: coords.latitude,
              longitude: coords.longitude
            });
          },
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });
    }
    const location = await getLocation();
    updateField('latitude', Number(location.latitude));
    updateField('longitude', Number(location.longitude));
    setGetLocLoading(false);
  }

  const MAX_URL = 3;

  const addSosmed = () => {
    if (form.sosmed_url.length >= MAX_URL) return;
    updateField('sosmed_url', [...form.sosmed_url, '']);
  };

  const updateSosmed = (index: number, value: string) => {
    const urls = [...form.sosmed_url];
    urls[index] = value;
    updateField('sosmed_url', urls);
  };

  const removeSosmed = (index: number) => {
    updateField(
      'sosmed_url',
      form.sosmed_url.filter((_, i) => i !== index)
    );
  };
  const [isRegisAkun, setRegisAkun] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const mutation = useMutation({
    ...createSPPGByInvitationMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil mendaftarkan SPPG.', {
        style: successToast as React.CSSProperties
      });
      setRegisAkun(false);
      setIsSuccess(true);
    }
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  const [isPending, setIsPending] = useState(false);
  const handleSubmit2 = async () => {
    setIsPending(true);
    let payload = { ...form, kapasitas_porsi: Number(form.kapasitas_porsi), latitude: Number(form.latitude), longitude: Number(form.longitude) };
    const result = sppgNewSchema.safeParse(payload);

    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors).flat()[0];

      if (firstError) {
        toast.error(firstError, {
          style: errorToast as React.CSSProperties
        });
      }
      return;
    }
    delete payload['konfirmasi_password'];
    try {
      await mutation.mutateAsync({
        token: invitation.token,
        input: payload as CreateSPPGByInvitationRequest
      });
    } catch (err) {
      let message = 'Gagal menambahkan SPPG.';
      if (err instanceof ApiError) {
        const errors = err.data?.error;
        if (errors?.email) {
          message = `Gagal: ${errors.email}`;
          setCurrentEmail(payload.email_user);
          setIsErrorEmail(true);
        }
        if (errors?.password) {
          message = `Gagal: ${errors.password}`;
        }
      }
      toast.error(message, {
        style: errorToast as React.CSSProperties
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisAkun(true);
  };
  function validatePassword(password: string) {
    if (password.length < 8) {
      return 'Password minimal 8 karakter';
    }

    if (password.length > 15) {
      return 'Password maksimal 15 karakter';
    }

    if (!/[A-Za-z]/.test(password)) {
      return 'Password harus mengandung huruf';
    }

    if (!/\d/.test(password)) {
      return 'Password harus mengandung angka';
    }

    return '';
  }
  const invalidPass = form.password && validatePassword(form.password);
  const unMatchedPass = Boolean(form.konfirmasi_password) && form.password != form.konfirmasi_password;
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center p-5">
      <h1 className="text-2xl text-center mb-3">{isRegisAkun ? 'Akun Pengelola SPPG' : 'Registrasi SPPG'}</h1>
      {!isSuccess ? (
        !isRegisAkun ? (
          <form onSubmit={handleNext} className="w-250 p-5 rounded shadow">
            <div className="flex gap-4 py-5">
              <div className="flex flex-1 flex-col gap-5">
                <div>
                  <Label htmlFor="sppg" className="mb-1">
                    Nama SPPG <span className="text-red-500">*</span>
                  </Label>
                  <Input id="sppg" placeholder="Nama" value={form.nama} onChange={(e) => updateField('nama', e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="kepala_sppg" className="mb-1">
                      Kepala SPPG <span className="text-red-500">*</span>
                    </Label>
                    <Input id="kepala_sppg" placeholder="Nama Lengkap Kepala SPPG" value={form.kepala_sppg} onChange={(e) => updateField('kepala_sppg', e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="kapasitas" className="mb-1">
                      Kapasitas Porsi <span className="text-red-500">*</span>
                    </Label>
                    <Input id="kapasitas" type="number" placeholder="Kapasitas Porsi" value={form.kapasitas_porsi} onChange={(e) => updateField('kapasitas_porsi', e.target.value)} required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="alamat" className="mb-1">
                    Alamat <span className="text-red-500">*</span>
                  </Label>
                  <Textarea id="alamat" placeholder="Alamat lengkap dapur SPPG" value={form.alamat} onChange={(e) => updateField('alamat', e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="kecamatan" className="mb-1">
                      Kecamatan <span className="text-red-500">*</span>
                    </Label>
                    <NativeSelect
                      id="kecamatan"
                      value={form.kecamatan_id === 0 ? '' : form.kecamatan_id}
                      onChange={(e) => {
                        updateField('kecamatan_id', Number(e.target.value));
                        updateKelurahan(Number(e.target.value));
                      }}
                      className="w-full"
                      required
                    >
                      <NativeSelectOption className="text-center" value="" disabled>
                        --- Pilih Kecamatan ---
                      </NativeSelectOption>

                      {kecamatan?.map((el) => (
                        <NativeSelectOption key={el.id} value={el.id}>
                          {el.name}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </div>
                  <div>
                    <Label htmlFor="kelurahan" className="mb-1">
                      Kelurahan <span className="text-red-500">*</span>
                    </Label>
                    <NativeSelect
                      id="kelurahan"
                      value={form.kelurahan_id === 0 ? '' : form.kelurahan_id}
                      onChange={(e) => {
                        updateField('kelurahan_id', Number(e.target.value));
                      }}
                      className="w-full"
                      required
                    >
                      <NativeSelectOption className="text-center" value="" disabled>
                        --- Pilih Kelurahan ---
                      </NativeSelectOption>

                      {form.kecamatan_id ? (
                        kelurahanNew?.map((el) => (
                          <NativeSelectOption key={el.id} value={el.id}>
                            {el.name}
                          </NativeSelectOption>
                        ))
                      ) : (
                        <NativeSelectOption disabled value={0} className="text-center">
                          Kecamatan belum dipilih
                        </NativeSelectOption>
                      )}
                    </NativeSelect>
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-5">
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-3">
                    <Label htmlFor="email" className="mb-1">
                      Email SPPG <span className="text-red-500">*</span>
                    </Label>
                    <Input id="email" placeholder="Contoh: sppg.kapuas1@gmail.com" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="telepon" className="mb-1">
                      No. Telepon <span className="text-red-500">*</span>
                    </Label>
                    <Input id="telepon" placeholder="Contoh: 08123456789" value={form.nomor_telepon} onChange={(e) => updateField('nomor_telepon', e.target.value)} required />
                  </div>
                </div>
                <div className="grid grid-cols-9 gap-2 items-end">
                  <div className="col-span-4">
                    <Label htmlFor="lat" className="mb-1">
                      Laltitude <span className="text-red-500">*</span>
                    </Label>
                    <Input id="lat" type="number" placeholder="Koordinat lat. lokasi dapur" value={form.latitude} onChange={(e) => updateField('latitude', e.target.value)} required />
                  </div>
                  <div className="col-span-4">
                    <Label htmlFor="lon" className="mb-1">
                      Longitude <span className="text-red-500">*</span>
                    </Label>
                    <Input id="lon" type="number" placeholder="Koordinat lon. lokasi dapur" value={form.longitude} onChange={(e) => updateField('longitude', e.target.value)} required />
                  </div>

                  <Button
                    className="col-span-1 bg-blue-50 hover:bg-blue-100 disabled:bg-blue-50 text-blue-700 disabled:text-blue-300 text-sm font-semibold p-3 rounded-xl transition-colors"
                    type="button"
                    onClick={getLocation}
                  >
                    {getLocLoading ? <Loader2 className="animate-spin" /> : <MapPin />}
                  </Button>
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Sosial Media</Label>
                  {form.sosmed_url.length > 0 && (
                    <div className="pb-2 flex flex-col gap-2">
                      {form.sosmed_url.map((url, index) => (
                        <div key={index} className="flex gap-2">
                          <Input value={url} placeholder="https://..." onChange={(e) => updateSosmed(index, e.target.value)} />

                          <Button type="button" variant="destructive" className="rounded-xl" onClick={() => removeSosmed(index)}>
                            Hapus
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div>
                    <Button
                      type="button"
                      className="bg-blue-50 hover:bg-blue-100 disabled:bg-blue-50 text-blue-700 disabled:text-blue-300 text-sm font-semibold p-3 rounded-xl transition-colors"
                      onClick={addSosmed}
                    >
                      Tambah URL
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center pt-4 mt-2 border-t">
              <Button
                type="submit"
                // disabled={!isDirty}
                className="bg-blue-600 hover:bg-blue-700
                                 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                Berikutnya
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="w-250 p-5 rounded shadow">
            <div className="flex flex-col gap-4 py-5 w-100 mx-auto">
              <div className="flex flex-1 flex-col gap-5">
                <div className="flex items-end gap-3">
                  <div className="flex-4">
                    <Label htmlFor="email_user" className="mb-1">
                      Email User<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email_user"
                      placeholder="Email untuk login"
                      value={form.email_user}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateField('email_user', value);
                        setIsErrorEmail(value === currentEmail);
                      }}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    className="flex-1 bg-blue-50 hover:bg-blue-100 disabled:bg-blue-50 text-blue-700 disabled:text-blue-300 text-sm font-semibold p-3 rounded-xl transition-colors"
                    onClick={() => updateField('email_user', form.email)}
                  >
                    Ikuti SPPG
                  </Button>
                </div>
                <div>
                  <Label htmlFor="password" className="mb-1">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input id="password" placeholder="Min. 8 karakter kombinasi" value={form.password} onChange={(e) => updateField('password', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="konfirmasi_password" className="mb-1">
                    Konfirmasi Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="konfirmasi_password"
                    placeholder="Min. 8 karakter kombinasi"
                    value={form.konfirmasi_password}
                    onChange={(e) => updateField('konfirmasi_password', e.target.value)}
                    required
                  />
                </div>
              </div>
              {invalidPass ? (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircleIcon className="w-4 h-4" />
                  <AlertDescription>{invalidPass}</AlertDescription>
                </Alert>
              ) : (
                unMatchedPass && (
                  <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertCircleIcon className="w-4 h-4" />
                    <AlertDescription>Password dan Konfirmasi Password tidak sesuai</AlertDescription>
                  </Alert>
                )
              )}
              {isErrorEmail && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircleIcon className="w-4 h-4" />
                  <AlertDescription>Email User: {currentEmail} sudah terdaftar. Harap gunakan yang lain.</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="flex justify-center pt-4 mt-2 border-t">
              <div className="flex justify-center gap-5">
                <Button
                  type="button"
                  onClick={() => setRegisAkun(false)}
                  // disabled={!isDirty}
                  className="bg-blue-50 hover:bg-blue-100 disabled:bg-blue-50 text-blue-700 disabled:text-blue-300 text-sm font-semibold p-3 rounded-xl transition-colors"
                >
                  Kembali
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700
                                 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                      // disabled={mutation.isPending}
                      disabled={isPending}
                    >
                      {/* {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Submit'} */}
                      {isPending ? <Loader2 className="animate-spin" /> : 'Daftar'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>Konfirmasi Pendaftaran</AlertDialogTitle>

                    <AlertDialogDescription>
                      Pastikan seluruh data yang Anda masukkan sudah benar. Email user dan password yang didaftarkan akan digunakan untuk Login.
                      <br />
                      <br />
                      <strong>Disarankan untuk mengambil tangkapan layar (screenshot) halaman ini agar Anda tidak lupa email user dan password yang telah didaftarkan.</strong>
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-blue-50 hover:bg-blue-100 disabled:bg-blue-50 text-blue-700 disabled:text-blue-300 text-sm font-semibold p-3 rounded-xl transition-colors">
                        Kembali
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          onClick={handleSubmit2}
                          className="bg-blue-600 hover:bg-blue-700
                                 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                        >
                          Lanjut
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </form>
        )
      ) : (
        <RegisterSuccess />
      )}
    </div>
  );
};

export default Register;
