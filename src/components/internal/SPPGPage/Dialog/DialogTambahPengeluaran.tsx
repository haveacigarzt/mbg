import type { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createDriverMutationOptions } from '@/queryOptions/drivers';
import { driverSchema, pengeluaranSchema } from '@/schema/formValidation';
import type { PostDriver } from '@/types/drivers';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DialogTambahPengeluaranProps {
  onPengeluaranUpdate: () => void;
  children: React.ReactNode;
}

const DialogTambahPengeluaran = ({ onPengeluaranUpdate, children }: DialogTambahPengeluaranProps) => {
  const [open, setOpen] = useState(false);
  const initialForm = { produk: '', jumlah: 0, satuan: '', harga_satuan: 0 };
  const [form, setForm] = useState(initialForm);

  function updateField(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  const mutation = useMutation({
    ...createDriverMutationOptions(),
    onSuccess: () => {
      toast.success('Berhasil menambahkan data Driver.', {
        style: {
          '--normal-bg': 'color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))',
          '--normal-text': 'light-dark(var(--color-green-600), var(--color-green-400))',
          '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))'
        } as React.CSSProperties
      });
      onPengeluaranUpdate();
      setOpen(false);
    },
    onError: (error: ApiError) => {
      toast.error('Gagal menambahkan data Driver.', {
        style: {
          '--normal-bg': 'color-mix(in oklab, light-dark(var(--color-red-600), var(--color-red-400)) 10%, var(--background))',
          '--normal-text': 'light-dark(var(--color-red-600), var(--color-red-400))',
          '--normal-border': 'light-dark(var(--color-red-400), var(--color-red-400))'
        } as React.CSSProperties
      });
      console.log('ERROR:', error);
    }
  });
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...form,
      jumlah: Number(form.jumlah),
      harga_satuan: Number(form.harga_satuan)
    };

    const result = pengeluaranSchema.safeParse(payload);

    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors).flat()[0];

      if (firstError) {
        toast.error(firstError, {
          style: {
            '--normal-bg': 'color-mix(in oklab, light-dark(var(--color-red-600), var(--color-red-400)) 10%, var(--background))',
            '--normal-text': 'light-dark(var(--color-red-600), var(--color-red-400))',
            '--normal-border': 'light-dark(var(--color-red-400), var(--color-red-400))'
          } as React.CSSProperties
        });
      }
      return;
    }
    // await mutation.mutateAsync({
    //   input: result.data as PostDriver
    // });
    console.log({
      // input: result.data as PostDriver
      input: result.data
    });
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
            <DialogTitle className="text-lg font-semibold">Tambah data Pengeluaran</DialogTitle>
            <DialogDescription>Tambah data Pengeluaran Hari Ini di SPPG anda. Klik simpan saat selesai.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 py-5">
            <div className="flex flex-col flex-1 gap-4">
              <div>
                <Label htmlFor="produk" className="mb-1">
                  Produk
                </Label>
                <Input id="produk" placeholder="Beras" value={form.produk} onChange={(e) => updateField('produk', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="jumlah" className="mb-1">
                  Jumlah
                </Label>
                <Input id="jumlah" type="number" value={form.jumlah} onChange={(e) => updateField('jumlah', e.target.value)} required />
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-4">
              <div>
                <Label htmlFor="satuan" className="mb-1">
                  Satuan
                </Label>
                <Input id="satuan" placeholder="kg" value={form.satuan} onChange={(e) => updateField('satuan', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="harga_satuan" className="mb-1">
                  Harga Satuan
                </Label>
                <Input id="harga_satuan" type="number" value={form.harga_satuan} onChange={(e) => updateField('harga_satuan', e.target.value)} required />
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
              disabled={mutation.isPending}
              className="bg-blue-600 hover:bg-blue-700
                             text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogTambahPengeluaran;
