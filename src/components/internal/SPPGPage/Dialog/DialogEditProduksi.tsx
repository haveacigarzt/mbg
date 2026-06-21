import type { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { errorToast, successToast } from '@/lib/constants';
import { timeToDateTime } from '@/lib/utils';
import { createProduksiHarianMutationOptions } from '@/queryOptions/sppg';
import { produksiSchema } from '@/schema/formValidation';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  children: React.ReactNode;
  waktu_mulai: string;
  estimasi_waktu_selesai: string;
  tanggal: string;
  sppg_id: number;
  onUpdate: () => void;
}

const DialogEditDriver = ({ onUpdate, sppg_id, children, waktu_mulai, estimasi_waktu_selesai, tanggal }: Props) => {
  const [open, setOpen] = useState(false);
  const initialForm = {
    waktu_mulai: waktu_mulai,
    estimasi_waktu_selesai: estimasi_waktu_selesai
  };
  const [form, setForm] = useState(initialForm);

  function updateField(field: string, value: any) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }
  const mutation = useMutation({
    ...createProduksiHarianMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil mengubah produksi harian.', {
        style: successToast as React.CSSProperties
      });
      onUpdate();
    },
    onError: (error: ApiError) => {
      toast.error('Gagal mengubah produksi harian.', {
        style: errorToast as React.CSSProperties
      });
      console.log('ERROR:', error);
    }
  });
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { tanggal, waktu_mulai: timeToDateTime(tanggal, form.waktu_mulai), estimasi_waktu_selesai: timeToDateTime(tanggal, form.estimasi_waktu_selesai) };
    console.log('payload', payload);

    const result = produksiSchema.safeParse(payload);
    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors).flat()[0];

      if (firstError) {
        toast.error(firstError, {
          style: errorToast as React.CSSProperties
        });
      }
      return;
    }
    await mutation.mutateAsync({ sppg_id: sppg_id, input: payload });
    // setIsLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="sm:max-w-xl
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0
            data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95
            data-[state=open]:zoom-in-95
            duration-300
          "
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader className="gap-0">
            <DialogTitle className="text-lg font-semibold">Atur waktu Produksi Hari Ini</DialogTitle>
            <DialogDescription>Atur waktu Produksi Hari Ini di SPPG anda. Klik simpan saat selesai.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 py-5">
            <div className="flex-1">
              <Label htmlFor="waktu_mulai" className="mb-1">
                Waktu Mulai
              </Label>
              <Input id="waktu_mulai" type="time" value={form.waktu_mulai} onChange={(e) => updateField('waktu_mulai', e.target.value)} required />
            </div>
            <div className="flex-1">
              <Label htmlFor="estimasi_waktu_selesai" className="mb-1">
                Estimasi Waktu Selesai
              </Label>
              <Input id="estimasi_waktu_selesai" type="time" value={form.estimasi_waktu_selesai} onChange={(e) => updateField('estimasi_waktu_selesai', e.target.value)} required />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditDriver;
