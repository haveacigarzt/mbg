import type { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { errorToast, successToast } from '@/lib/constants';
import { requireAuth } from '@/main';
import { createPesertaDidikMutationOptions, getPesertaDidikQueryOptions } from '@/queryOptions/sekolah';
import { pendudukSchema, pesertaDidikSchema } from '@/schema/formValidation';
import type { PesertaDidikInput } from '@/types/sekolah';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/sekolah/pesertadidik')({
  beforeLoad: async () => {
    const { user } = await requireAuth();
    if (user.role.role_id !== 6) {
      toast.error('Access denied', {
        style: errorToast as React.CSSProperties
      });
      throw redirect({ to: '/dashboard' });
    }
    return {
      user
    };
  },
  component: RouteComponent
});

function RouteComponent() {
  const [form, setForm] = useState<PesertaDidikInput>({
    penduduk: {
      nik: '6101010101010002',
      nama: 'Budi Santoso',
      jenis_kelamin: 'L',
      tanggal_lahir: '2016-08-15',
      kelurahan_id: 41,
      alamat: 'Jl. Jenderal Sudirman No. 10, Sanggau',
      no_hp: '081234567890'
    },
    peserta_didik: {
      nisn: '1234567891',
      kelas: '5',
      rombel: '5A'
    }
  });

  const mutation = useMutation({
    ...createPesertaDidikMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil menambahkan peserta didik.', {
        style: successToast as React.CSSProperties
      });
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
      await mutation.mutateAsync({ sekolah_id: user.role.id_in_role, input: form });
    } catch (error: any) {
      console.log(error.data.error);
    }
  };

  const { user } = Route.useRouteContext();

  const { data, refetch } = useQuery(getPesertaDidikQueryOptions(user.role.id_in_role));

  return (
    <div>
      <div className="w-100 mx-auto p-5 bg-amber-100">
        <h1 className="text-xl">Form Peserta Didik</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="font-semibold text-lg">Data Penduduk</h2>
          </div>

          <div className="space-y-2">
            <Label>NIK</Label>
            <Input
              value={form.penduduk.nik}
              onChange={(e) =>
                setForm({
                  ...form,
                  penduduk: {
                    ...form.penduduk,
                    nik: e.target.value
                  }
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Nama</Label>
            <Input
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

          <div className="space-y-2">
            <Label>Kelurahan ID</Label>
            <Input
              type="number"
              value={form.penduduk.kelurahan_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  penduduk: {
                    ...form.penduduk,
                    kelurahan_id: Number(e.target.value)
                  }
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Alamat</Label>
            <Textarea
              value={form.penduduk.alamat}
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
            <Label>No HP</Label>
            <Input
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

          <div>
            <h2 className="font-semibold text-lg">Data Peserta Didik</h2>
          </div>

          <div className="space-y-2">
            <Label>NISN</Label>
            <Input
              value={form.peserta_didik.nisn}
              onChange={(e) =>
                setForm({
                  ...form,
                  peserta_didik: {
                    ...form.peserta_didik,
                    nisn: e.target.value
                  }
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Kelas</Label>
            <Input
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

          <Button type="submit">Tambah</Button>
        </form>
      </div>
      <div>
        <h1>Tabel Peserta Didik</h1>
        <table border={1}>
          <thead>
            <tr>
              <th>No</th>
              <th>NIK</th>
              <th>Nama</th>
              <th>JK</th>
              <th>Tanggal Lahir</th>
              <th>Kelurahan</th>
              <th>Alamat</th>
              <th>No HP</th>
              <th>NISN</th>
              <th>Kelas</th>
              <th>Rombel</th>
              <th>Sekolah</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {data?.peserta_didik.map((item, index) => (
              <tr key={item.penduduk.id}>
                <td>{index + 1}</td>
                <td>{item.penduduk.nik}</td>
                <td>{item.penduduk.nama}</td>
                <td>{item.penduduk.jenis_kelamin}</td>
                <td>{item.penduduk.tanggal_lahir.slice(0, 10)}</td>
                <td>{item.penduduk.kelurahan_nama}</td>
                <td>{item.penduduk.alamat}</td>
                <td>{item.penduduk.no_hp}</td>
                <td>{item.peserta_didik.nisn}</td>
                <td>{item.peserta_didik.kelas}</td>
                <td>{item.peserta_didik.rombel}</td>
                <td>{item.peserta_didik.sekolah_nama}</td>
                <td>{item.peserta_didik.status_aktif ? 'Aktif' : 'Tidak Aktif'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
