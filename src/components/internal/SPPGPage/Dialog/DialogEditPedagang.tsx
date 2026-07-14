import type { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { errorToast, successToast } from '@/lib/constants';
import { createPengeluaranMutationOptions } from '@/queryOptions/sppg';
import { pedagangSchema } from '@/schema/formValidation';
import type { PedagangLokalType } from '@/types/pedaganglokal';
import { useMutation } from '@tanstack/react-query';
import { Loader2, MapPin } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  onSuccess: () => void;
  children: React.ReactNode;
  sppg_id: number;
  data: PedagangLokalType;
}

const DialogEditPedagang = ({ onSuccess, children, sppg_id, data }: Props) => {
  const [open, setOpen] = useState(false);
  const initialForm = { nama: data.nama, alamat: data.alamat, no_hp: data.no_hp, jenis_produk: data.jenis_produk, longitude: data.longitude, latitude: data.latitude };
  const [form, setForm] = useState(initialForm);

  function updateField(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
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

  const mutation = useMutation({
    ...createPengeluaranMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil mengirim pengeluaran harian.', {
        style: successToast as React.CSSProperties
      });
      onSuccess();
      setOpen(false);
    },
    onError: (error: ApiError) => {
      toast.error('Gagal mengirim pengeluaran harian.', {
        style: errorToast as React.CSSProperties
      });
      console.log('ERROR:', error);
    }
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form
    };

    const result = pedagangSchema.safeParse(payload);

    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors).flat()[0];

      if (firstError) {
        toast.error(firstError, {
          style: errorToast as React.CSSProperties
        });
      }
      return;
    }
    // await mutation.mutateAsync({ sppg_id: sppg_id, input: { ...payload, alokasi_harian_id } });
    console.log({
      // input: result.data as PostDriver
      input: result.data
    });
  }

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)} modal={false}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-md
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0
            data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95
            data-[state=open]:zoom-in-95
            duration-300
          "
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader className="gap-0">
            <DialogTitle className="text-lg font-semibold">Ubah data Pedagang Lokal</DialogTitle>
            <DialogDescription>Perbarui data Pedagang Lokal. Klik simpan saat selesai.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-5">
            <div>
              <Label htmlFor="nama" className="mb-1">
                Nama
              </Label>
              <Input id="nama" placeholder="Toko Makmur Jaya" value={form.nama} onChange={(e) => updateField('nama', e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="jenis_produk" className="mb-1">
                Jenis Produk
              </Label>
              <Input id="jenis_produk" placeholder="Sembako" value={form.jenis_produk} onChange={(e) => updateField('jenis_produk', e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="no_hp" className="mb-1">
                No HP
              </Label>
              <Input id="no_hp" placeholder="08123456789" value={form.no_hp} onChange={(e) => updateField('no_hp', e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="alamat" className="mb-1">
                Alamat
              </Label>
              <Textarea id="alamat" placeholder="Jl. Melati No. 10 Sanggau" value={form.alamat} onChange={(e) => updateField('alamat', e.target.value)} required></Textarea>
            </div>
            <div className="grid grid-cols-7 gap-2 items-end">
              <div className="col-span-3">
                <Label htmlFor="lat" className="mb-1">
                  Laltitude
                </Label>
                <Input id="lat" type="number" placeholder="Latitude" value={form.latitude} onChange={(e) => updateField('latitude', Number(e.target.value))} required />
              </div>
              <div className="col-span-3">
                <Label htmlFor="lon" className="mb-1">
                  Longitude
                </Label>
                <Input id="lon" type="number" placeholder="Longitude" value={form.longitude} onChange={(e) => updateField('longitude', Number(e.target.value))} required />
              </div>

              <Button title="Pakai lokasi perangkat saat ini" className="col-span-1 bg-blue-600 rounded-xl text-white hover:bg-blue-700" type="button" onClick={getLocation}>
                {getLocLoading ? <Loader2 className="animate-spin" /> : <MapPin />}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending} className="text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditPedagang;
