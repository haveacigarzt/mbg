import type { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { errorToast, successToast } from '@/lib/constants';
import { requireAuth } from '@/main';
import { createBalitaMutationOptions, getBalitaQueryOptions, getIbuQueryOptions } from '@/queryOptions/posyandu';
import { balitaSchema, pendudukSchema } from '@/schema/formValidation';
import type { BalitaInput } from '@/types/posyandu';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/posyandu/balita')({
  beforeLoad: async () => {
    const { user } = await requireAuth();
    if (user.role.role_id !== 5) {
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
  const [form, setForm] = useState<BalitaInput>({
    penduduk: {
      nik: '6101011508210001',
      nama: 'Andi Saputra',
      jenis_kelamin: 'L',
      tanggal_lahir: '2024-08-15',
      kelurahan_id: 1,
      alamat: 'Jl. Pembangunan No. 12, Sanggau',
      no_hp: '081234567890'
    },
    balita: {
      ibu_id: 14, //penduduk.id
      anak_ke: 2,
      berat_lahir: 3200,
      panjang_lahir: 49
    }
  });

  const mutation = useMutation({
    ...createBalitaMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil menambahkan balita.', {
        style: successToast as React.CSSProperties
      });
      refetch();
    },
    onError: (error: ApiError) => {
      toast.error(error.data.error.nik || error.data.error.nisn || 'Gagal menambahkan balita.', {
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

    const result = balitaSchema.safeParse(form.balita);
    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors).flat()[0];

      if (firstError) {
        toast.error(firstError, {
          style: errorToast as React.CSSProperties
        });
      }
      return;
    }
    try {
      await mutation.mutateAsync({ posyandu_id: user.role.id_in_role, input: form });
    } catch (error: any) {
      console.log(error.data.error);
    }
  };

  const { user } = Route.useRouteContext();

  const { data, refetch } = useQuery(getBalitaQueryOptions(user.role.id_in_role));
  const { data: ibu, refetch: refetchIbu } = useQuery(getIbuQueryOptions(user.role.id_in_role));
  console.log(data);
  console.log(ibu);
  return (
    <div>
      <div className="w-100 mx-auto p-5 bg-amber-100">
        <h1 className="text-xl">Form Balita</h1>
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
            <h2 className="font-semibold text-lg">Data Balita</h2>
          </div>

          <div className="space-y-2">
            <Label>Ibu</Label>
            <Input
              value={form.balita.ibu_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  balita: {
                    ...form.balita,
                    ibu_id: Number(e.target.value)
                  }
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Anak Ke</Label>
            <Input
              value={form.balita.anak_ke}
              onChange={(e) =>
                setForm({
                  ...form,
                  balita: {
                    ...form.balita,
                    anak_ke: Number(e.target.value)
                  }
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Berat Lahir</Label>
            <Input
              value={form.balita.berat_lahir}
              onChange={(e) =>
                setForm({
                  ...form,
                  balita: {
                    ...form.balita,
                    berat_lahir: Number(e.target.value)
                  }
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Panjang Lahir</Label>
            <Input
              value={form.balita.panjang_lahir}
              onChange={(e) =>
                setForm({
                  ...form,
                  balita: {
                    ...form.balita,
                    panjang_lahir: Number(e.target.value)
                  }
                })
              }
            />
          </div>

          <Button type="submit">Tambah</Button>
        </form>
      </div>
      <div>
        <h1>Tabel Balita</h1>
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
              <th>Ibu</th>
              <th>Anak Ke</th>
              <th>Berat Lahir</th>
              <th>Panjang Lahir</th>
            </tr>
          </thead>

          <tbody>
            {data?.balita.map((item, index) => (
              <tr key={item.penduduk.id}>
                <td>{index + 1}</td>
                <td>{item.penduduk.nik}</td>
                <td>{item.penduduk.nama}</td>
                <td>{item.penduduk.jenis_kelamin}</td>
                <td>{item.penduduk.tanggal_lahir.slice(0, 10)}</td>
                <td>{item.penduduk.kelurahan_nama}</td>
                <td>{item.penduduk.alamat}</td>
                <td>{item.penduduk.no_hp}</td>
                <td>{item.balita.ibu_nama}</td>
                <td>{item.balita.anak_ke}</td>
                <td>{item.balita.berat_lahir}</td>
                <td>{item.balita.panjang_lahir}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
