import type { ApiError } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createDriverMutationOptions } from '@/queryOptions/drivers';
import { driverSchema } from '@/schema/formValidation';
import type { PostDriver } from '@/types/drivers';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface DialogTambahDriverProps {
  onDriverUpdate: () => void;
  children: React.ReactNode;
}

const DialogTambahDriver = ({ onDriverUpdate, children }: DialogTambahDriverProps) => {
  const [open, setOpen] = useState(false);
  const initialForm = {
    nama: '',
    no_telepon: '',
    email: '',
    password: ''
  };
  const [form, setForm] = useState(initialForm);

  function updateField(field: string, value: any) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
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
      onDriverUpdate();
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

    const result = driverSchema.safeParse(form);

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
    await mutation.mutateAsync({
      input: result.data as PostDriver
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
            <DialogTitle className="text-lg font-semibold">Tambah data Driver</DialogTitle>
            <DialogDescription>Tambah data Driver di SPPG anda. Klik simpan saat selesai.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 py-5">
            <div className="flex flex-col flex-1 gap-4">
              <div>
                <Label htmlFor="nama" className="mb-1">
                  Nama Driver
                </Label>
                <Input id="nama" placeholder="Nama" value={form.nama} onChange={(e) => updateField('nama', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email" className="mb-1">
                  Email
                </Label>
                <Input id="email" placeholder="Email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-4">
              <div>
                <Label htmlFor="telepon" className="mb-1">
                  No Telepon
                </Label>
                <Input id="telepon" placeholder="No Telepon" value={form.no_telepon} onChange={(e) => updateField('no_telepon', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password" className="mb-1">
                  Password
                </Label>
                <Input id="password" placeholder="Password" value={form.password} onChange={(e) => updateField('password', e.target.value)} required />
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

export default DialogTambahDriver;
