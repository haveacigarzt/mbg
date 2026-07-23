import type { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { errorToast, successToast } from '@/lib/constants';
import { requireAuth } from '@/main';
import { createBalitaMutationOptions, createBumilMutationOptions, getBalitaQueryOptions, getBumilQueryOptions, getIbuQueryOptions } from '@/queryOptions/posyandu';
import { balitaSchema, bumilSchema, pendudukSchema } from '@/schema/formValidation';
import type { BalitaInput, BumilInput } from '@/types/posyandu';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/posyandu/bumil')({
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
  const [form, setForm] = useState<BumilInput>({
    penduduk: {
      nik: '6101015001980001',
      nama: 'Nur Aisyah',
      jenis_kelamin: 'P',
      tanggal_lahir: '1998-01-05',
      kelurahan_id: 1,
      alamat: 'Jl. Ahmad Yani No. 15, Sanggau',
      no_hp: '081234567890'
    },
    bumil: {
      hpht: '2026-04-15T00:00:00Z',
      hpl: '2027-01-20T00:00:00Z',
      gravida: 2,
      para: 1,
      abortus: 0
    }
  });

  const mutation = useMutation({
    ...createBumilMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil menambahkan bumil.', {
        style: successToast as React.CSSProperties
      });
      refetch();
    },
    onError: (error: ApiError) => {
      toast.error(error.data.error.nik || error.data.error.nisn || 'Gagal menambahkan bumil.', {
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

    console.log('post: ', form.bumil);

    const result = bumilSchema.safeParse(form.bumil);
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
      form.penduduk = { ...form.penduduk, jenis_kelamin: 'P' };
      form.bumil = { ...form.bumil, hpht: new Date(form.bumil.hpht).toISOString(), hpl: new Date(form.bumil.hpl).toISOString() };
      await mutation.mutateAsync({ posyandu_id: user.role.id_in_role, input: form });
    } catch (error: any) {
      console.log(error.data.error);
    }
  };

  const { user } = Route.useRouteContext();

  const { data, refetch } = useQuery(getBumilQueryOptions(user.role.id_in_role));
  console.log(data);

  return (
    <div>
      <div className="w-100 mx-auto p-5 bg-amber-100">
        <h1 className="text-xl">Form Bumil</h1>
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
            <h2 className="font-semibold text-lg">Data Ibu Hamil</h2>
          </div>

          <div className="space-y-2">
            <Label>HPHT</Label>
            <Input
              value={form.bumil.hpht}
              type="date"
              onChange={(e) =>
                setForm({
                  ...form,
                  bumil: {
                    ...form.bumil,
                    hpht: e.target.value
                  }
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>HPL</Label>
            <Input
              value={form.bumil.hpl}
              type="date"
              onChange={(e) =>
                setForm({
                  ...form,
                  bumil: {
                    ...form.bumil,
                    hpl: e.target.value
                  }
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Gravida</Label>
            <Input
              value={form.bumil.gravida}
              onChange={(e) =>
                setForm({
                  ...form,
                  bumil: {
                    ...form.bumil,
                    gravida: Number(e.target.value)
                  }
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Para</Label>
            <Input
              value={form.bumil.para}
              onChange={(e) =>
                setForm({
                  ...form,
                  bumil: {
                    ...form.bumil,
                    para: Number(e.target.value)
                  }
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Abortus</Label>
            <Input
              value={form.bumil.abortus}
              onChange={(e) =>
                setForm({
                  ...form,
                  bumil: {
                    ...form.bumil,
                    abortus: Number(e.target.value)
                  }
                })
              }
            />
          </div>

          <Button type="submit">Tambah</Button>
        </form>
      </div>
      <div>
        <h1>Tabel Bumil</h1>
        <table border={1}>
          <thead>
            <tr>
              <th>No</th>
              <th>NIK</th>
              <th>Nama</th>
              <th>Tanggal Lahir</th>
              <th>Kelurahan</th>
              <th>Alamat</th>
              <th>No HP</th>
              <th>HPHT</th>
              <th>HPL</th>
              <th>Gavida</th>
              <th>Para</th>
              <th>Abortus</th>
            </tr>
          </thead>

          <tbody>
            {data?.bumil.map((item, index) => (
              <tr key={item.penduduk.id}>
                <td>{index + 1}</td>
                <td>{item.penduduk.nik}</td>
                <td>{item.penduduk.nama}</td>
                <td>{item.penduduk.tanggal_lahir.slice(0, 10)}</td>
                <td>{item.penduduk.kelurahan_nama}</td>
                <td>{item.penduduk.alamat}</td>
                <td>{item.penduduk.no_hp}</td>
                <td>{item.bumil.hpht}</td>
                <td>{item.bumil.hpl}</td>
                <td>{item.bumil.gravida}</td>
                <td>{item.bumil.para}</td>
                <td>{item.bumil.abortus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
